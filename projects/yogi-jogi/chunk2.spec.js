// 묶음2(발자취 & 연결) 와이어 검증 — 00-flow.md §플로우 + §구성요소·상태 + §인터랙션 모델에서 파생.
// 1층: 도달성/막다른 길  2층: 기능 완결성. 셀렉터는 getByRole/aria/텍스트(hi-fi 이식).
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

const WIRE = path.resolve(__dirname, 'wireframe');
const url = (f) => pathToFileURL(path.join(WIRE, f)).href;

// 묶음2 범위 안 화면. (course/picker 등은 묶음1 산출물 — 링크 타깃으로만 사용)
const IN_SCOPE = ['home.html', 'together.html', 'webview.html'];

test.use({ viewport: { width: 390, height: 844 } });

/* ===================== 1층: 도달성 + 막다른 길 0 ===================== */
test.describe('묶음2 1층 — 도달성/막다른 길', () => {
  test('home에서 BFS — 링크 타깃 전부 존재 + 묶음2 화면 전부 도달', () => {
    const visited = new Set();
    const queue = ['home.html'];
    const missing = [];
    while (queue.length) {
      const cur = queue.shift();
      if (visited.has(cur)) continue;
      visited.add(cur);
      const full = path.join(WIRE, cur);
      if (!fs.existsSync(full)) { missing.push(cur); continue; }
      const html = fs.readFileSync(full, 'utf8');
      for (let h of [...html.matchAll(/href\s*=\s*"([^"]+)"/g)].map(m => m[1])) {
        if (/^(https?:|mailto:|#)/.test(h)) continue;
        h = h.split('#')[0].split('?')[0].trim();
        if (!h.endsWith('.html')) continue;
        if (!visited.has(h)) queue.push(h);
      }
    }
    expect(missing, '막다른 링크: ' + missing.join(', ')).toEqual([]);
    for (const s of IN_SCOPE) expect(visited.has(s), s + ' 미도달').toBeTruthy();
  });

  test('연결 흐름: 홈 → 다같이 → 코스 상세 / 웹뷰 → 앱 진입', async ({ page }) => {
    await page.goto(url('home.html'));
    await page.getByRole('link', { name: /다 같이/ }).click();
    await expect(page).toHaveURL(/together\.html/);
    await page.getByRole('link', { name: /민지 코스 보기/ }).click();
    await expect(page).toHaveURL(/course\.html/);

    await page.goto(url('webview.html'));
    await page.getByRole('link', { name: /나도 코스 만들기/ }).click();
    await expect(page).toHaveURL(/index\.html/);
  });
});

/* ===================== 2층: 기능 완결성 ===================== */
test.describe('묶음2 2층 — S1 홈 누적 지도', () => {
  test('누적 핀 수 표시 + 코스 카드 → 상세 + ＋ → 사진선택', async ({ page }) => {
    await page.goto(url('home.html'));
    await expect(page.getByText('방문한 곳 8')).toBeVisible();
    await page.getByRole('link', { name: /전주 한옥마을 가족 나들이/ }).click();
    await expect(page).toHaveURL(/course\.html/);

    await page.goto(url('home.html'));
    await page.getByRole('link', { name: '새 코스' }).click();
    await expect(page).toHaveURL(/picker\.html/);
  });

  test('코스 0개 상태 보기 → 빈 상태(C1)로', async ({ page }) => {
    await page.goto(url('home.html'));
    await page.getByRole('link', { name: /코스 0개일 때 빈 상태 보기/ }).click();
    await expect(page).toHaveURL(/index\.html/);
  });
});

test.describe('묶음2 2층 — S2 다같이 (안읽음 배지)', () => {
  test('읽음 표시하면 안읽음 카운터 감소 → 모두 읽으면 다읽음 안내', async ({ page }) => {
    await page.goto(url('together.html'));
    await expect(page.getByText('안 읽음 3개')).toBeVisible();
    await page.getByRole('button', { name: '민지 코스 읽음 표시' }).click();
    await expect(page.getByText('안 읽음 2개')).toBeVisible();
    await page.getByRole('button', { name: '재호 코스 읽음 표시' }).click();
    await page.getByRole('button', { name: '수아 코스 읽음 표시' }).click();
    await expect(page.getByText('모두 읽음')).toBeVisible();
    await expect(page.getByText(/다 읽었어요/)).toBeVisible();
  });

  test('빈 상태(팔로우 0명) 토글 + 사람 찾기 진입점', async ({ page }) => {
    await page.goto(url('together.html'));
    await page.getByRole('button', { name: '팔로우 0명 상태 보기' }).click();
    const empty = page.getByRole('region', { name: '팔로우 0명 빈 상태' });
    await expect(empty).toBeVisible();
    await expect(empty.getByRole('link', { name: /사람 찾기/ })).toBeVisible();
  });

  test('피드 카드 코스 보기 → 코스 상세', async ({ page }) => {
    await page.goto(url('together.html'));
    await page.getByRole('link', { name: '재호 코스 보기' }).click();
    await expect(page).toHaveURL(/course\.html/);
  });

  // ★ IA: 이름·아바타 = 그 사람 프로필 / 코스 보기 = 코스 상세 (분리된 타깃)
  test('이름·아바타 탭 → 다른 사람 프로필(코스 상세 아님)', async ({ page }) => {
    await page.goto(url('together.html'));
    await page.getByRole('link', { name: '민지 프로필 보기' }).click();
    await expect(page).toHaveURL(/user\.html/);
  });

  test('헤더 사람 찾기 → 검색 화면', async ({ page }) => {
    await page.goto(url('together.html'));
    await page.getByRole('link', { name: '사람 찾기' }).first().click();
    await expect(page).toHaveURL(/search\.html/);
  });
});

test.describe('묶음2 2층 — S4 코스 웹뷰', () => {
  test('비공개 링크 상태 토글 → 접근 불가 패널', async ({ page }) => {
    await page.goto(url('webview.html'));
    await expect(page.getByText('공개 코스 — 누구나 열람')).toBeVisible();
    await page.getByRole('button', { name: '비공개 링크였다면?' }).click();
    await expect(page.getByRole('region', { name: '비공개 코스 접근 불가' })).toBeVisible();
    await expect(page.getByText('비공개 코스 — 접근 불가')).toBeVisible();
  });
});

/* ===================== 죽은 컨트롤 0 ===================== */
test.describe('묶음2 죽은 컨트롤 0', () => {
  for (const screen of IN_SCOPE) {
    test(`${screen} — 링크 타깃 실존 + 버튼 라벨 존재`, async ({ page }) => {
      await page.goto(url(screen));
      for (const a of await page.locator('a[href]').all()) {
        let href = (await a.getAttribute('href')) || '';
        if (/^(https?:|mailto:|#)/.test(href)) continue;
        href = href.split('#')[0].split('?')[0];
        if (!href.endsWith('.html')) continue;
        expect(fs.existsSync(path.join(WIRE, href)), `${screen}: 깨진 링크 ${href}`).toBeTruthy();
      }
      for (const h of await page.locator('button').elementHandles()) {
        const label = await h.evaluate(el => (el.getAttribute('aria-label') || el.textContent || '').trim());
        if (/범위 밖/.test(label)) continue;
        expect(label.length, `${screen}: 라벨 없는 버튼`).toBeGreaterThan(0);
      }
    });
  }
});
