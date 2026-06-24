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

// 페이지의 인터랙티브 요소를 라벨과 함께 열거한다(범위 밖·disabled 표시 포함).
async function listInteractive(page) {
  return await page.evaluate((reSrc) => {
    const re = new RegExp(reSrc.source, reSrc.flags);
    const sel = 'a[href], button, [role="button"], input, select, textarea, [onclick], [tabindex]:not([tabindex="-1"])';
    const out = [];
    for (const el of document.querySelectorAll(sel)) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      const label = (el.getAttribute('aria-label') || el.textContent || el.value || el.getAttribute('placeholder') || el.name || '').trim().replace(/\s+/g, ' ').slice(0, 60);
      const scopeText = (el.closest('[data-scope="out"]') ? '[범위 밖]' : '') + ' ' + label + ' ' + (el.title || '');
      out.push({
        label,
        tag: el.tagName.toLowerCase(),
        role: el.getAttribute('role') || '',
        href: el.getAttribute('href') || '',
        type: el.getAttribute('type') || '',
        outOfScope: re.test(scopeText) || el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true',
      });
    }
    return out;
  }, { source: OUT_OF_SCOPE_RE.source, flags: OUT_OF_SCOPE_RE.flags });
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
  const sel = selector || 'a[href], button, [role="button"], input, select, textarea, [onclick], [tabindex]:not([tabindex="-1"])';
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
      const r = await probeWired(page, url, i);
      if (!r.wired) dead.push(`${c.tag}${c.role ? `[${c.role}]` : ''} "${c.label}"`);
    }
    expect(dead, `죽은 컨트롤(와이어드 안 됨·범위 밖 라벨도 없음): ${dead.join(' / ')}`).toEqual([]);
  });
}

module.exports = { listInteractive, probeWired, defineDeadControlTest, OUT_OF_SCOPE_RE };
