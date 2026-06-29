// 재사용 골격 ② — 2층 자동 검증: 죽은 컨트롤 0.
//
// "인터랙티브한데 와이어드 안 됨(상태도 안 변하고 이동도 안 함)"을 자동으로 잡는다.
// 정적 추측이 아니라 런타임 클릭-디프로 본다(인라인 JS는 addEventListener로 붙는 게 흔해
// onclick 속성 유무로는 판정이 틀린다). 컨트롤마다 페이지를 새로 로드해 격리 → 클릭 → 변화 측정.
//
// "와이어드"의 정의(하나라도 해당):
//   nav  — URL이 바뀜(다른 화면으로 이동)        dom  — 본문 텍스트가 바뀜(항목 추가/삭제/카운터 등)
//   aria — aria-pressed/checked/selected/expanded·value·체크 상태가 바뀜
// 어느 것도 안 변하면 "죽은 컨트롤". 단 [범위 밖] 라벨(또는 disabled/aria-disabled)이면 면제.
//
//   const { listInteractive, probeWired, defineDeadControlTest } = require('../../scripts/lib/controls');
const OUT_OF_SCOPE_RE = /\[범위\s*밖|out[\s-]?of[\s-]?scope|\[scope\s*out/i;

// 인터랙티브 셀렉터는 한 곳에서만 정의한다 — listInteractive(querySelectorAll)와
// probeWired(page.locator)가 **같은 집합·같은 순서**를 봐야 domIndex↔nth 정렬이 성립한다.
const INTERACTIVE_SEL = 'a[href], button, [role="button"], input, select, textarea, [onclick], [tabindex]:not([tabindex="-1"])';

// 페이지의 인터랙티브 요소를 라벨과 함께 열거한다(범위 밖·disabled 표시 포함).
// 숨김 요소는 건너뛰되, 각 컨트롤에 **전체 DOM 인덱스(domIndex, 숨김 포함)**를 달아 반환한다.
// probeWired는 재로드 후 nth(domIndex)로 같은 요소를 다시 찾으므로, 압축 인덱스가 아니라
// 전체 인덱스를 써야 앞에 숨김 컨트롤이 있어도 엉뚱한 요소를 클릭하지 않는다.
async function listInteractive(page) {
  return await page.evaluate(({ reSrc, sel }) => {
    const re = new RegExp(reSrc.source, reSrc.flags);
    const all = document.querySelectorAll(sel);
    const out = [];
    for (let i = 0; i < all.length; i++) {
      const el = all[i];
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      // 조상이 display:none이면 el 자신의 computed display는 none이 아니다(getComputedStyle은 조상 무시).
      // getClientRects()는 조상 숨김까지 반영해 빈 배열 → 렌더 안 되는 컨트롤(숨긴 role-뷰·닫힌 모달 안)은 스킵.
      // (position:fixed로 offsetParent가 null인 *보이는* 모달은 rect가 있어 정상 포함된다.)
      if (el.getClientRects().length === 0) continue;
      const label = (el.getAttribute('aria-label') || el.textContent || el.value || el.getAttribute('placeholder') || el.name || '').trim().replace(/\s+/g, ' ').slice(0, 60);
      const scopeText = (el.closest('[data-scope="out"]') ? '[범위 밖]' : '') + ' ' + label + ' ' + (el.title || '');
      out.push({
        domIndex: i, // ← querySelectorAll 전체에서의 위치(숨김 포함). probeWired의 nth와 정렬된다.
        label,
        tag: el.tagName.toLowerCase(),
        role: el.getAttribute('role') || '',
        href: el.getAttribute('href') || '',
        type: el.getAttribute('type') || '',
        // aria-current="page" = 현재 위치를 나타내는 내비 항목 → 자기 자신을 가리켜 이동 안 함이 정상(죽은 컨트롤 아님).
        outOfScope: re.test(scopeText) || el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true' || el.getAttribute('aria-current') === 'page',
      });
    }
    return out;
  }, { reSrc: { source: OUT_OF_SCOPE_RE.source, flags: OUT_OF_SCOPE_RE.flags }, sel: INTERACTIVE_SEL });
}

// 페이지 상태 지문 — URL + 본문 텍스트 + 상태 속성 모음. 클릭 전후 비교용.
async function snapshot(page) {
  const url = page.url();
  const dom = await page.evaluate(() => {
    const text = (document.body.innerText || '').replace(/\s+/g, ' ').trim();
    const states = [...document.querySelectorAll('[aria-pressed],[aria-checked],[aria-selected],[aria-expanded],:checked,[value]')]
      .map((el) => `${el.getAttribute('aria-pressed') ?? ''}|${el.getAttribute('aria-checked') ?? ''}|${el.getAttribute('aria-selected') ?? ''}|${el.getAttribute('aria-expanded') ?? ''}|${el.checked ?? ''}|${el.value ?? ''}`)
      .join('§');
    return { text, states };
  });
  return { url, ...dom };
}

// 컨트롤 하나를 격리 클릭해 와이어드 여부를 본다. nth = listInteractive 순서의 인덱스.
// 페이지를 새로 로드해 다른 컨트롤의 영향과 누적을 배제한다(순서 무관·비파괴).
async function probeWired(page, url, nth, selector) {
  page.removeAllListeners?.('dialog');
  page.on('dialog', (d) => d.dismiss().catch(() => {}));
  await page.goto(url);
  const sel = selector || INTERACTIVE_SEL;
  const target = page.locator(sel).nth(nth);
  const before = await snapshot(page);
  try {
    await target.click({ timeout: 1500, trial: false });
  } catch {
    // 클릭 자체가 막힘(가려짐 등) → 판정 불가, 와이어드로 보지 않음
    return { wired: false, how: null, error: 'click-failed' };
  }
  await page.waitForTimeout(150); // 전환·상태 반영 대기
  const after = await snapshot(page);
  if (after.url !== before.url) return { wired: true, how: 'nav' };
  if (after.states !== before.states) return { wired: true, how: 'aria' };
  if (after.text !== before.text) return { wired: true, how: 'dom' };
  return { wired: false, how: null };
}

// 보일러플레이트 없이 한 화면의 "죽은 컨트롤 0"을 건다.
//   defineDeadControlTest(test, expect, { url: url('list.html'), name: 'S2 목록' });
// ignore = 라벨 부분일치로 제외할 컨트롤(예: 데모용 상태 토글 버튼).
function defineDeadControlTest(test, expect, { url, name = '', ignore = [] }) {
  test(`2층: ${name || url} — 죽은 컨트롤 0 (모든 컨트롤이 와이어드 or [범위 밖])`, async ({ page }) => {
    await page.goto(url);
    const controls = await listInteractive(page);
    const dead = [];
    for (let i = 0; i < controls.length; i++) {
      const c = controls[i];
      if (c.outOfScope) continue;
      if (ignore.some((g) => c.label.includes(g))) continue;
      // 텍스트 입력류는 클릭이 아니라 입력이 본분 → 죽은 컨트롤 검사 면제(기능 spec이 따로 본다)
      if (c.tag === 'input' && !['button', 'submit', 'checkbox', 'radio', 'reset'].includes(c.type)) continue;
      if (c.tag === 'textarea' || c.tag === 'select') continue;
      const r = await probeWired(page, url, c.domIndex); // ← 압축 i가 아니라 전체 DOM 인덱스로 정확히 그 컨트롤을 클릭
      if (!r.wired) dead.push(`${c.tag}${c.role ? `[${c.role}]` : ''} "${c.label}"`);
    }
    expect(dead, `죽은 컨트롤(와이어드 안 됨·범위 밖 라벨도 없음): ${dead.join(' / ')}`).toEqual([]);
  });
}

module.exports = { listInteractive, probeWired, defineDeadControlTest, OUT_OF_SCOPE_RE };
