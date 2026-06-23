// 하이파이 묶음2 — 2층 기능 회귀(screens/). 묶음3 화면(user/search)은 아직이라 그쪽 이동은 도달성 배리어에서.
const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');
const SCREENS = path.resolve(__dirname, 'screens');
const url = (f) => pathToFileURL(path.join(SCREENS, f)).href;

test.use({ viewport: { width: 430, height: 880 } });

test.describe('하이파이 S1 홈 누적지도', () => {
  test('누적 핀 수 + 코스 카드→상세 + ＋→사진선택 + 코스0개→빈상태', async ({ page }) => {
    await page.goto(url('home.html'));
    await expect(page.getByText('방문한 곳 8')).toBeVisible();
    await page.getByRole('link', { name: /전주 한옥마을 가족 나들이/ }).click();
    await expect(page).toHaveURL(/course\.html/);
    await page.goto(url('home.html'));
    await page.getByRole('link', { name: '새 코스' }).click();
    await expect(page).toHaveURL(/picker\.html/);
    await page.goto(url('home.html'));
    await page.getByRole('link', { name: /코스 0개일 때 빈 상태 보기/ }).click();
    await expect(page).toHaveURL(/index\.html/);
  });
});

test.describe('하이파이 S2 다같이', () => {
  test('읽음 표시→안읽음 감소→모두 읽음', async ({ page }) => {
    await page.goto(url('together.html'));
    await expect(page.getByText('안 읽음 3개')).toBeVisible();
    await page.getByRole('button', { name: '민지 코스 읽음 표시' }).click();
    await expect(page.getByText('안 읽음 2개')).toBeVisible();
    await page.getByRole('button', { name: '재호 코스 읽음 표시' }).click();
    await page.getByRole('button', { name: '수아 코스 읽음 표시' }).click();
    await expect(page.getByText('모두 읽음')).toBeVisible();
    await expect(page.getByText(/다 읽었어요/)).toBeVisible();
  });

  test('빈 상태 토글 + 사람 찾기 진입점 노출', async ({ page }) => {
    await page.goto(url('together.html'));
    await page.getByRole('button', { name: '팔로우 0명 상태 보기' }).click();
    const empty = page.getByRole('region', { name: '팔로우 0명 빈 상태' });
    await expect(empty).toBeVisible();
    await expect(empty.getByRole('link', { name: /사람 찾기/ })).toBeVisible();
  });

  test('이름·아바타=프로필 링크 / 코스 보기=상세 (분리)', async ({ page }) => {
    await page.goto(url('together.html'));
    // 이름·아바타는 user.html 로(묶음3, 아직 미빌드) — 링크 존재·타깃만 확인
    await expect(page.getByRole('link', { name: '민지 프로필 보기' })).toHaveAttribute('href', /user\.html\?of=/);
    // 코스 보기는 상세로 실제 이동
    await page.getByRole('link', { name: '재호 코스 보기' }).click();
    await expect(page).toHaveURL(/course\.html/);
  });
});

test.describe('하이파이 S4 코스 웹뷰', () => {
  test('공개/비공개 토글 + 나도 만들기→앱', async ({ page }) => {
    await page.goto(url('webview.html'));
    await expect(page.getByText('공개 코스 — 누구나 열람')).toBeVisible();
    await page.getByRole('button', { name: '비공개 링크였다면?' }).click();
    await expect(page.getByRole('region', { name: '비공개 코스 접근 불가' })).toBeVisible();
    await expect(page.getByText('비공개 코스 — 접근 불가')).toBeVisible();
    await page.getByRole('link', { name: /나도 코스 만들기/ }).click();
    await expect(page).toHaveURL(/index\.html/);
  });
});
