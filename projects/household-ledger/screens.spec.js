// household-ledger — hi-fi 인터랙션 검증 (6단계). 3단계 기능 spec을 screens/에 그대로 재실행(회귀) + axe.
// 포터블 셀렉터라 wire.spec.js와 동일 계약. screens/가 와이어 동작을 깨지 않았는지 본다.
const { test, expect } = require('@playwright/test');
const path = require('path');
const { defineReachabilityTest } = require('../../scripts/lib/crawl');
const { defineDeadControlTest } = require('../../scripts/lib/controls');
const { defineAxeTest } = require('../../scripts/lib/a11y');
const { fileUrl } = require('../../scripts/lib/selectors');

const DIR = path.join(__dirname, 'screens');
const url = fileUrl(DIR);
const SCREENS = ['index.html', 'add.html', 'list.html', 'detail.html', 'stats.html', 'recurring.html'];

test.use({ viewport: { width: 390, height: 844 } });

// ── 1층 도달성 ──
defineReachabilityTest(test, expect, { dir: DIR, screens: SCREENS });

// ── 2층 죽은 컨트롤 0 ──
defineDeadControlTest(test, expect, { url: url('index.html'), name: 'S1 홈' });
defineDeadControlTest(test, expect, { url: url('add.html'), name: 'S2 입력', ignore: ['지출', '나', '공동'] });
defineDeadControlTest(test, expect, { url: url('list.html'), name: 'S3 내역', ignore: ['이번 달'] });
defineDeadControlTest(test, expect, { url: url('detail.html'), name: 'S4 상세' });
defineDeadControlTest(test, expect, { url: url('stats.html'), name: 'S5 통계', ignore: ['지출'] });
defineDeadControlTest(test, expect, { url: url('recurring.html'), name: 'S6 반복' });

// ── 2층 기능 완결성 (회귀) ──
test('입력: 금액+카테고리 → 저장 활성 → 홈', async ({ page }) => {
  await page.goto(url('add.html'));
  const save = page.getByRole('button', { name: '저장' });
  await expect(save).toBeDisabled();
  await page.getByLabel('금액').fill('12000');
  await page.getByRole('button', { name: '식비' }).click();
  await expect(save).toBeEnabled();
  await save.click();
  await expect(page).toHaveURL(/index\.html$/);
});
test('입력: 세그먼트 전환(aria-pressed)', async ({ page }) => {
  await page.goto(url('add.html'));
  const inc = page.getByRole('button', { name: '수입' });
  await inc.click();
  await expect(inc).toHaveAttribute('aria-pressed', 'true');
});
test('입력: 반복 토글 → 옵션 표시', async ({ page }) => {
  await page.goto(url('add.html'));
  await page.getByRole('button', { name: '반복 거래로 설정' }).click();
  await expect(page.getByLabel('주기')).toBeVisible();
});
test('입력: 빠른입력 프리필', async ({ page }) => {
  await page.goto(url('add.html'));
  await page.getByRole('button', { name: '점심' }).click();
  await expect(page.getByLabel('금액')).toHaveValue('9000');
});
test('내역: 필터 토글 + 기간 단일', async ({ page }) => {
  await page.goto(url('list.html'));
  const cat = page.getByRole('button', { name: '식비' });
  await cat.click();
  await expect(cat).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: '지난 달' }).click();
  await expect(page.getByRole('button', { name: '이번 달' })).toHaveAttribute('aria-pressed', 'false');
});
test('내역 → 상세 → 삭제확인 → 내역', async ({ page }) => {
  await page.goto(url('list.html'));
  await page.locator('#results a.row').first().click();
  await expect(page).toHaveURL(/detail\.html$/);
  await page.getByRole('button', { name: '삭제' }).click();
  await expect(page.getByRole('dialog', { name: '삭제 확인' })).toBeVisible();
  await page.getByRole('link', { name: '삭제' }).click();
  await expect(page).toHaveURL(/list\.html$/);
});
test('통계: 월 이동 → 빈 달 + 탭 전환', async ({ page }) => {
  await page.goto(url('stats.html'));
  await expect(page.locator('#month')).toHaveText('2026.06');
  await page.getByRole('button', { name: '다음 달' }).click();
  await expect(page.locator('#month')).toHaveText('2026.07');
  await expect(page.locator('#empty')).toBeVisible();
  await page.getByRole('button', { name: '수입' }).click();
  await expect(page.getByRole('button', { name: '수입' })).toHaveAttribute('aria-pressed', 'true');
});
test('반복: 폼 열기 → 저장 → 카드 증가 / 토글', async ({ page }) => {
  await page.goto(url('recurring.html'));
  const before = await page.locator('#rules .card').count();
  await page.getByRole('button', { name: '추가' }).click();
  await expect(page.getByLabel('반복 규칙 추가')).toBeVisible();
  await page.getByRole('button', { name: '규칙 저장' }).click();
  await expect(page.locator('#rules .card')).toHaveCount(before + 1);
  const toggle = page.locator('#rules .toggle').first();
  await toggle.click();
  await expect(toggle).toHaveText('일시중지');
});

// ── 렌더 a11y (axe — serious+ 0) ──
SCREENS.forEach((s) => defineAxeTest(test, expect, { url: url(s), name: s }));
