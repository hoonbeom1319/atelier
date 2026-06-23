// 하이파이 묶음3 — 2층 기능 회귀(screens/).
const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');
const SCREENS = path.resolve(__dirname, 'screens');
const url = (f) => pathToFileURL(path.join(SCREENS, f)).href;

test.use({ viewport: { width: 430, height: 880 } });

test.describe('하이파이 S3 내 프로필', () => {
  test('설정 항상 노출 + 팔로우 버튼 없음 + 내 코스 → 상세', async ({ page }) => {
    await page.goto(url('profile.html'));
    await expect(page.getByRole('link', { name: '설정 열기' })).toBeVisible();
    await expect(page.getByRole('button', { name: '팔로우 토글' })).toHaveCount(0);
    await expect(page.getByText('내 코스', { exact: true })).toBeVisible();
    await page.getByRole('link', { name: '내 코스 1 보기' }).click();
    await expect(page).toHaveURL(/course\.html/);
  });
});

test.describe('하이파이 S3b 다른 사람 프로필', () => {
  test('일방 팔로우 토글 + 공개 코스 → 상세', async ({ page }) => {
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
  test('?of= 파라미터로 이름 변경', async ({ page }) => {
    await page.goto(url('user.html') + '?of=재호');
    await expect(page.getByText('재호', { exact: true })).toBeVisible();
  });
});

test.describe('하이파이 S7 사람 찾기', () => {
  test('검색→결과→팔로우 토글→결과 탭으로 프로필', async ({ page }) => {
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
  test('없는 닉네임 → 결과 없음', async ({ page }) => {
    await page.goto(url('search.html'));
    await page.getByRole('searchbox', { name: '닉네임 검색' }).fill('없는사람');
    await expect(page.getByText('일치하는 사람이 없어요.')).toBeVisible();
  });
});

test.describe('하이파이 S5 로그인', () => {
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

test.describe('하이파이 S6 설정', () => {
  test('범위 밖 라벨 + 로그아웃 → 로그인', async ({ page }) => {
    await page.goto(url('settings.html'));
    await expect(page.getByText('[범위 밖] Later').first()).toBeVisible();
    await page.getByRole('link', { name: '로그아웃' }).click();
    await expect(page).toHaveURL(/login\.html/);
  });
});
