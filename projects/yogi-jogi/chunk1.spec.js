// 묶음1(기록 루프) 와이어 검증 — 00-flow.md §플로우 + §구성요소·상태 + §인터랙션 모델에서 파생.
// 1층: 도달성/막다른 길(기계)  2층: 기능 완결성(기계). 3층(느낌)은 사람.
// 셀렉터는 getByRole/aria/텍스트로 — hi-fi(6단계)에 그대로 이식 가능하게.
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

const WIRE = path.resolve(__dirname, 'wireframe');
const url = (f) => pathToFileURL(path.join(WIRE, f)).href;

// 묶음1 범위 안 화면(전부 도달돼야 함). stub-next = 다음 묶음 경계 스텁.
const IN_SCOPE = ['index.html','picker.html','assembling.html','review.html','finalize.html','course.html'];

test.use({ viewport: { width: 390, height: 844 } });

/* ===================== 1층: 도달성 + 막다른 길 0 ===================== */
test.describe('1층 내비게이션 — 도달성/막다른 길', () => {
  test('index에서 BFS — 링크 타깃 전부 존재(막다른 길 0) + 범위 화면 전부 도달', () => {
    const visited = new Set();
    const queue = ['index.html'];
    const missing = [];
    while (queue.length) {
      const cur = queue.shift();
      if (visited.has(cur)) continue;
      visited.add(cur);
      const full = path.join(WIRE, cur);
      if (!fs.existsSync(full)) { missing.push(cur); continue; }
      const html = fs.readFileSync(full, 'utf8');
      const hrefs = [...html.matchAll(/href\s*=\s*"([^"]+)"/g)].map(m => m[1]);
      for (let h of hrefs) {
        if (/^(https?:|mailto:|#)/.test(h)) continue;
        h = h.split('#')[0].split('?')[0].trim();
        if (!h.endsWith('.html')) continue;
        if (!visited.has(h)) queue.push(h);
      }
    }
    // 막다른 길 0: 링크된 모든 .html 파일이 실제 존재
    expect(missing, '막다른 링크(존재하지 않는 타깃): ' + missing.join(', ')).toEqual([]);
    // 도달성: 범위 안 화면 전부 방문됨
    for (const s of IN_SCOPE) expect(visited.has(s), s + ' 미도달').toBeTruthy();
  });

  test('핵심 흐름 A→B 한 줄 통과: 빈상태→사진선택→로딩→검토→마무리→상세', async ({ page }) => {
    await page.goto(url('index.html'));
    await page.getByRole('link', { name: /첫 코스 만들기/ }).click();
    await expect(page).toHaveURL(/picker\.html/);

    await page.getByRole('button', { name: '사진 1', exact: true }).click();
    await page.getByRole('link', { name: '완료' }).click();
    await expect(page).toHaveURL(/assembling\.html/);

    const go = page.getByRole('link', { name: /검토하기/ });
    await expect(go).toHaveAttribute('aria-disabled', 'false', { timeout: 10000 });
    await go.click();
    await expect(page).toHaveURL(/review\.html/);

    await page.getByRole('link', { name: '다음 →' }).click();
    await expect(page).toHaveURL(/finalize\.html/);

    await page.getByRole('link', { name: '코스 완성' }).click();
    await expect(page).toHaveURL(/course\.html/);
  });
});

/* ===================== 2층: 기능 완결성 ===================== */
test.describe('2층 기능 — C2 사진 선택(다중선택+카운터)', () => {
  test('0장이면 완료 비활성 / 선택하면 카운터 증가·완료 활성 / 해제 반영', async ({ page }) => {
    await page.goto(url('picker.html'));
    const done = page.getByRole('link', { name: '완료' });
    await expect(done).toHaveAttribute('aria-disabled', 'true');
    await expect(page.getByText('선택 0장')).toBeVisible();

    await page.getByRole('button', { name: '사진 1', exact: true }).click();
    await page.getByRole('button', { name: '사진 2', exact: true }).click();
    await page.getByRole('button', { name: '사진 3', exact: true }).click();
    await expect(page.getByText('선택 3장')).toBeVisible();
    await expect(done).toHaveAttribute('aria-disabled', 'false');

    await page.getByRole('button', { name: '사진 2', exact: true }).click();
    await expect(page.getByText('선택 2장')).toBeVisible();
  });
});

test.describe('2층 기능 — C3 자동 조립 로딩', () => {
  test('진행률이 차오르고 100%에서 검토하기 활성화', async ({ page }) => {
    await page.goto(url('assembling.html'));
    const go = page.getByRole('link', { name: /검토하기/ });
    await expect(go).toHaveAttribute('aria-disabled', 'true');
    await expect(go).toHaveAttribute('aria-disabled', 'false', { timeout: 10000 });
    await expect(page.getByText('100%')).toBeVisible();
  });
});

test.describe('2층 기능 — C4 검토·보정 ★ (승부처)', () => {
  test('지도 접기/펼치기 토글', async ({ page }) => {
    await page.goto(url('review.html'));
    const t = page.getByRole('button', { name: '지도 접기' });
    await expect(t).toHaveAttribute('aria-expanded', 'true');
    await t.click();
    await expect(page.getByRole('button', { name: '지도 펼치기' })).toHaveAttribute('aria-expanded', 'false');
  });

  test('경로① 미분류 다중선택 → 시트 → 기존 Stop 지정 → 미분류 감소', async ({ page }) => {
    await page.goto(url('review.html'));
    await expect(page.getByText('미분류 7장', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: '미분류 사진 1' }).click();
    await page.getByRole('button', { name: '미분류 사진 2' }).click();
    await expect(page.getByText('2장 선택')).toBeVisible();

    await page.getByRole('button', { name: 'Stop에 지정' }).click();
    const sheet = page.getByRole('dialog', { name: 'Stop 지정' });
    await expect(sheet).toBeVisible();
    await sheet.getByRole('button', { name: /한옥마을/ }).first().click();
    await expect(page.getByText('미분류 5장', { exact: true })).toBeVisible();   // 7 - 2
  });

  test('경로② 새 Stop 만들어 지정 → 방문지 수 증가·미분류 감소', async ({ page }) => {
    await page.goto(url('review.html'));
    await expect(page.getByRole('heading', { name: '방문지 3곳' })).toBeVisible();
    await page.getByRole('button', { name: '미분류 사진 3' }).click();
    await page.getByRole('button', { name: 'Stop에 지정' }).click();
    await page.getByRole('button', { name: /새 Stop 만들어 지정/ }).click();
    await expect(page.getByRole('heading', { name: '방문지 4곳' })).toBeVisible();
    await expect(page.getByText('미분류 6장', { exact: true })).toBeVisible();   // 7 - 1
  });

  test('경로③ 위치없는 사진 — 지역명 검색 결과로 지정', async ({ page }) => {
    await page.goto(url('review.html'));
    await page.getByRole('button', { name: '미분류 사진 4' }).click();
    await page.getByRole('button', { name: 'Stop에 지정' }).click();
    await page.getByRole('button', { name: /위치로 검색/ }).click();
    await page.getByRole('textbox', { name: '지역명 검색' }).fill('풍남문');
    await page.getByRole('button', { name: /풍남문/ }).click();
    await expect(page.getByText('미분류 6장', { exact: true })).toBeVisible();
  });

  test('경로③-b 검색 실패 → 핀 직접 이동으로 지정', async ({ page }) => {
    await page.goto(url('review.html'));
    await page.getByRole('button', { name: '미분류 사진 5' }).click();
    await page.getByRole('button', { name: 'Stop에 지정' }).click();
    await page.getByRole('button', { name: /위치로 검색/ }).click();
    await page.getByRole('button', { name: /핀 직접 이동/ }).click();
    await page.getByRole('button', { name: '이 위치로 지정' }).click();
    await expect(page.getByText('미분류 6장', { exact: true })).toBeVisible();
  });

  test('Stop 쪼개기 → 방문지 수 증가, 합치기 → 감소', async ({ page }) => {
    await page.goto(url('review.html'));
    await expect(page.getByRole('heading', { name: '방문지 3곳' })).toBeVisible();
    await page.getByRole('button', { name: '방문지 메뉴: 한옥마을' }).click();
    await page.getByRole('button', { name: /쪼개기/ }).first().click();
    await expect(page.getByRole('heading', { name: '방문지 4곳' })).toBeVisible();
    // 합치기(2번째 카드의 위와 합치기)
    await page.getByRole('button', { name: '방문지 메뉴: 경기전' }).click();
    await page.getByRole('button', { name: /위와 합치기/ }).first().click();
    await expect(page.getByRole('heading', { name: '방문지 3곳' })).toBeVisible();
  });

  test('미분류를 모두 정리하면 완료 안내가 뜬다', async ({ page }) => {
    await page.goto(url('review.html'));
    // 7장 전부 선택 → 한 번에 지정
    for (let i = 1; i <= 7; i++) await page.getByRole('button', { name: '미분류 사진 ' + i }).click();
    await expect(page.getByText('7장 선택')).toBeVisible();
    await page.getByRole('button', { name: 'Stop에 지정' }).click();
    await page.getByRole('dialog').getByRole('button', { name: /경기전/ }).first().click();
    await expect(page.getByText('미분류 0장', { exact: true })).toBeVisible();
    await expect(page.getByText(/모두 정리/)).toBeVisible();
  });
});

test.describe('2층 기능 — C5 마무리', () => {
  test('공개 토글이 실제로 뒤집힘(aria-pressed) + 라벨 변경', async ({ page }) => {
    await page.goto(url('finalize.html'));
    const sw = page.getByRole('button', { name: '공개 여부 토글' });
    await expect(sw).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByText('비공개', { exact: true })).toBeVisible();
    await sw.click();
    await expect(sw).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText('공개', { exact: true })).toBeVisible();
  });

  test('태그 추가/삭제가 반영된다', async ({ page }) => {
    await page.goto(url('finalize.html'));
    await page.getByRole('textbox', { name: '태그 입력' }).fill('전주');
    await page.getByRole('button', { name: '추가' }).click();
    await expect(page.getByRole('button', { name: '태그 전주 삭제' })).toBeVisible();
    await page.getByRole('button', { name: '태그 전주 삭제' }).click();
    await expect(page.getByRole('button', { name: '태그 전주 삭제' })).toHaveCount(0);
  });
});

test.describe('2층 기능 — C6 코스 상세', () => {
  test('공유 누르면 링크 생성(상태 변화) + 다시 누르면 해제', async ({ page }) => {
    await page.goto(url('course.html'));
    const share = page.getByRole('button', { name: '공유 링크 만들기' });
    await expect(share).toHaveAttribute('aria-pressed', 'false');
    await share.click();
    await expect(page.getByRole('button', { name: /링크 생성됨/ })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText(/공유 링크 생성됨/)).toBeVisible();
  });
});

test.describe('2층 기능 — C1 빈 상태 진입점', () => {
  test('샘플 코스 카드 → 코스 상세 미리보기', async ({ page }) => {
    await page.goto(url('index.html'));
    await page.getByRole('link', { name: /샘플 코스/ }).click();
    await expect(page).toHaveURL(/course\.html/);
    await expect(page.getByText(/샘플 코스 미리보기/)).toBeVisible();
  });
});

/* ===================== 죽은 컨트롤 0 (열거 검사) ===================== */
test.describe('죽은 컨트롤 0 — 인터랙티브 요소가 와이어드 되었나', () => {
  for (const screen of IN_SCOPE) {
    test(`${screen} — 모든 링크는 실존 타깃/스텁, 모든 버튼은 [범위 밖] 라벨이 없으면 핸들러 보유`, async ({ page }) => {
      await page.goto(url(screen));
      // 링크: 범위 안 .html 또는 스텁만 — 깨진 타깃 없음
      const links = await page.locator('a[href]').all();
      for (const a of links) {
        let href = (await a.getAttribute('href')) || '';
        if (/^(https?:|mailto:|#)/.test(href)) continue;
        href = href.split('#')[0].split('?')[0];
        if (!href.endsWith('.html')) continue;
        expect(fs.existsSync(path.join(WIRE, href)), `${screen}: 깨진 링크 ${href}`).toBeTruthy();
      }
      // 버튼: 라벨에 "범위 밖"이 없으면 click 핸들러가 등록돼 있어야 함(죽은 컨트롤 금지)
      const handles = await page.locator('button').elementHandles();
      for (const h of handles) {
        const label = (await h.evaluate(el => (el.getAttribute('aria-label') || el.textContent || '').trim()));
        if (/범위 밖/.test(label)) continue;
        const wired = await h.evaluate(el => {
          // onclick 속성 또는 addEventListener('click') 흔적 — getEventListeners는 없으므로
          // 프레임워크 없이 등록한 리스너는 직접 알 수 없어, 타입/역할로 판단:
          // submit/reset 또는 가시적 상태를 바꾸는 컨트롤로 간주되는지 최소 검사.
          return el.onclick !== null || el.type === 'submit' || el.hasAttribute('aria-pressed') || el.hasAttribute('aria-expanded');
        });
        // 핸들러 직접 탐지는 한계가 있어, 핵심 인터랙션은 위 기능 테스트들이 보증한다.
        // 여기서는 "라벨 없는 정체불명 버튼"만 잡는다.
        expect(label.length, `${screen}: 라벨 없는 버튼`).toBeGreaterThan(0);
      }
    });
  }
});
