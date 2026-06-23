// 묶음3(계정·주변) 와이어 검증 — 00-flow.md §플로우 + §구성요소·상태 + §인터랙션 모델에서 파생.
// IA 수정 반영: 프로필 탭=내 프로필(S3) / 다른 사람 프로필=user(S3b) / 사람 찾기=search(S7).
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

const WIRE = path.resolve(__dirname, 'wireframe');
const url = (f) => pathToFileURL(path.join(WIRE, f)).href;

const IN_SCOPE = ['profile.html', 'user.html', 'search.html', 'login.html', 'settings.html'];

test.use({ viewport: { width: 390, height: 844 } });

/* ===================== 1층 ===================== */
test.describe('묶음3 1층 — 도달성/막다른 길', () => {
  test('index에서 BFS — 링크 타깃 전부 존재 + 묶음3 화면 전부 도달', () => {
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

  test('계정 흐름: 내 프로필 → 설정 → 로그아웃 → 로그인 → 앱 진입', async ({ page }) => {
    await page.goto(url('profile.html'));
    await page.getByRole('link', { name: '설정 열기' }).click();   // 내 프로필이라 설정 항상 노출
    await expect(page).toHaveURL(/settings\.html/);
    await page.getByRole('link', { name: '로그아웃' }).click();
    await expect(page).toHaveURL(/login\.html/);
    await page.getByRole('link', { name: '카카오로 시작하기' }).click();
    await expect(page).toHaveURL(/home\.html/);
  });
});

/* ===================== 2층 ===================== */
test.describe('묶음3 2층 — S3 내 프로필 (탭 루트)', () => {
  test('설정 항상 노출 + 팔로우 버튼 없음 + 내 코스 → 상세', async ({ page }) => {
    await page.goto(url('profile.html'));
    await expect(page.getByRole('link', { name: '설정 열기' })).toBeVisible();
    await expect(page.getByRole('button', { name: '팔로우 토글' })).toHaveCount(0); // 내 프로필엔 팔로우 없음
    await expect(page.getByText('내 코스', { exact: true })).toBeVisible();
    await page.getByRole('link', { name: '내 코스 1 보기' }).click();
    await expect(page).toHaveURL(/course\.html/);
  });
});

test.describe('묶음3 2층 — S3b 다른 사람 프로필', () => {
  test('일방 팔로우 토글(팔로우↔팔로잉) + 공개 코스 → 상세', async ({ page }) => {
    await page.goto(url('user.html'));
    const fb = page.getByRole('button', { name: '팔로우 토글' });
    await expect(fb).toHaveAttribute('aria-pressed', 'false');
    await expect(fb).toHaveText('팔로우');
    await fb.click();
    await expect(fb).toHaveAttribute('aria-pressed', 'true');
    await expect(fb).toHaveText(/팔로잉/);
    await page.getByRole('link', { name: '코스 1 보기' }).click();
    await expect(page).toHaveURL(/course\.html/);
  });

  test('?of= 파라미터로 대상 이름이 바뀐다', async ({ page }) => {
    await page.goto(url('user.html') + '?of=재호');
    await expect(page.getByText('재호', { exact: true })).toBeVisible();
  });
});

test.describe('묶음3 2층 — S7 사람 찾기', () => {
  test('검색 → 결과 노출 → 팔로우 토글 → 결과 탭으로 프로필', async ({ page }) => {
    await page.goto(url('search.html'));
    await expect(page.getByText(/팔로우하고 싶은 사람/)).toBeVisible();
    await page.getByRole('searchbox', { name: '닉네임 검색' }).fill('민지');
    const follow = page.getByRole('button', { name: '민지 팔로우' });
    await expect(follow).toBeVisible();
    await follow.click();
    await expect(follow).toHaveText(/팔로잉/);
    await page.getByRole('link', { name: '민지 프로필 보기' }).click();
    await expect(page).toHaveURL(/user\.html/);
  });

  test('없는 닉네임 → 결과 없음 안내', async ({ page }) => {
    await page.goto(url('search.html'));
    await page.getByRole('searchbox', { name: '닉네임 검색' }).fill('없는사람');
    await expect(page.getByText('일치하는 사람이 없어요.')).toBeVisible();
  });
});

test.describe('묶음3 2층 — S6 설정', () => {
  test('범위 밖 항목 라벨 + 로그아웃 → 로그인', async ({ page }) => {
    await page.goto(url('settings.html'));
    await expect(page.getByText('[범위 밖] Later').first()).toBeVisible();
    await page.getByRole('link', { name: '로그아웃' }).click();
    await expect(page).toHaveURL(/login\.html/);
  });
});

test.describe('묶음3 2층 — S5 로그인', () => {
  test('이메일 폼 토글 + 소셜 → 홈', async ({ page }) => {
    await page.goto(url('login.html'));
    const eb = page.getByRole('button', { name: '이메일로 로그인' });
    await expect(eb).toHaveAttribute('aria-expanded', 'false');
    await eb.click();
    await expect(page.getByRole('group', { name: '이메일 로그인 폼' })).toBeVisible();
    await page.getByRole('link', { name: '구글로 계속하기' }).click();
    await expect(page).toHaveURL(/home\.html/);
  });
});

/* ===================== 죽은 컨트롤 0 ===================== */
test.describe('묶음3 죽은 컨트롤 0', () => {
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
