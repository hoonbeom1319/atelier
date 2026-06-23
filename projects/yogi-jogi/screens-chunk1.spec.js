// 하이파이 묶음1 — 2층 기능 회귀(폴리시 입히며 동작 안 깨졌나). 3단계 spec을 screens/에 재실행.
// 셀렉터는 와이어와 동일(getByRole/aria/텍스트) — 빌더가 보존했는지 검증.
const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');
const SCREENS = path.resolve(__dirname, 'screens');
const url = (f) => pathToFileURL(path.join(SCREENS, f)).href;

test.use({ viewport: { width: 430, height: 880 } });

test.describe('하이파이 묶음1 — 핵심 흐름 한 줄 통과', () => {
  test('빈상태→사진선택→로딩→검토→마무리→상세', async ({ page }) => {
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

test.describe('하이파이 C2 사진 선택', () => {
  test('0장 비활성 / 카운터 / 해제', async ({ page }) => {
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

test.describe('하이파이 C3 로딩', () => {
  test('진행률 100% + 검토하기 활성', async ({ page }) => {
    await page.goto(url('assembling.html'));
    const go = page.getByRole('link', { name: /검토하기/ });
    await expect(go).toHaveAttribute('aria-disabled', 'true');
    await expect(go).toHaveAttribute('aria-disabled', 'false', { timeout: 10000 });
    await expect(page.getByText('100%')).toBeVisible();
  });
});

test.describe('하이파이 C4 검토·보정 (회귀)', () => {
  test('지도 접기 토글', async ({ page }) => {
    await page.goto(url('review.html'));
    const t = page.getByRole('button', { name: '지도 접기' });
    await expect(t).toHaveAttribute('aria-expanded', 'true');
    await t.click();
    await expect(page.getByRole('button', { name: '지도 펼치기' })).toHaveAttribute('aria-expanded', 'false');
  });
  test('미분류 다중선택→시트→기존 Stop 지정→감소', async ({ page }) => {
    await page.goto(url('review.html'));
    await expect(page.getByText('미분류 7장', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: '미분류 사진 1' }).click();
    await page.getByRole('button', { name: '미분류 사진 2' }).click();
    await expect(page.getByText('2장 선택')).toBeVisible();
    await page.getByRole('button', { name: 'Stop에 지정' }).click();
    const sheet = page.getByRole('dialog', { name: 'Stop 지정' });
    await expect(sheet).toBeVisible();
    await sheet.getByRole('button', { name: /한옥마을/ }).first().click();
    await expect(page.getByText('미분류 5장', { exact: true })).toBeVisible();
  });
  test('새 Stop / 검색 / 핀 경로 + 쪼개기', async ({ page }) => {
    await page.goto(url('review.html'));
    await page.getByRole('button', { name: '미분류 사진 3' }).click();
    await page.getByRole('button', { name: 'Stop에 지정' }).click();
    await page.getByRole('button', { name: /새 Stop 만들어 지정/ }).click();
    await expect(page.getByRole('heading', { name: '방문지 4곳' })).toBeVisible();
    await page.getByRole('button', { name: '방문지 메뉴: 경기전' }).click();
    await page.getByRole('button', { name: /쪼개기/ }).first().click();
    await expect(page.getByRole('heading', { name: '방문지 5곳' })).toBeVisible();
  });
});

test.describe('하이파이 C5 마무리', () => {
  test('공개 토글 + 태그 추가/삭제', async ({ page }) => {
    await page.goto(url('finalize.html'));
    const sw = page.getByRole('button', { name: '공개 여부 토글' });
    await expect(sw).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByText('비공개', { exact: true })).toBeVisible();
    await sw.click();
    await expect(sw).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText('공개', { exact: true })).toBeVisible();
    await page.getByRole('textbox', { name: '태그 입력' }).fill('전주');
    await page.getByRole('button', { name: '추가' }).click();
    await expect(page.getByRole('button', { name: '태그 전주 삭제' })).toBeVisible();
    await page.getByRole('button', { name: '태그 전주 삭제' }).click();
    await expect(page.getByRole('button', { name: '태그 전주 삭제' })).toHaveCount(0);
  });
});

test.describe('하이파이 C6 코스 상세', () => {
  test('공유 링크 생성 토글', async ({ page }) => {
    await page.goto(url('course.html'));
    const share = page.getByRole('button', { name: '공유 링크 만들기' });
    await expect(share).toHaveAttribute('aria-pressed', 'false');
    await share.click();
    await expect(page.getByRole('button', { name: /링크 생성됨/ })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText(/공유 링크 생성됨/)).toBeVisible();
  });
});

test.describe('하이파이 C1 빈 상태', () => {
  test('샘플 코스 → 코스 상세 미리보기', async ({ page }) => {
    await page.goto(url('index.html'));
    await page.getByRole('link', { name: /샘플 코스/ }).click();
    await expect(page).toHaveURL(/course\.html/);
    await expect(page.getByText(/샘플 코스 미리보기/)).toBeVisible();
  });
});
