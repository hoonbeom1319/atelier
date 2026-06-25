// household-ledger — 흐름·기능 검증 (3단계). 00-flow.md에서 파생.
// 포터블 셀렉터(role·aria·text) → 같은 spec이 hi-fi(6단계)에도 그대로 돈다.
const { test, expect } = require('@playwright/test');
const path = require('path');
const { defineReachabilityTest } = require('../../scripts/lib/crawl');
const { defineDeadControlTest } = require('../../scripts/lib/controls');
const { fileUrl } = require('../../scripts/lib/selectors');

const WIRE = path.join(__dirname, 'wireframe');
const url = fileUrl(WIRE);
const SCREENS = ['index.html', 'add.html', 'list.html', 'detail.html', 'stats.html', 'recurring.html'];

// 모바일 390px (00-flow 대상 뷰포트)
test.use({ viewport: { width: 390, height: 844 } });

// ── 1층: 도달성 + 막다른 길 0 + 고아 0 ─────────────────────────────
defineReachabilityTest(test, expect, { dir: WIRE, screens: SCREENS });

// ── 2층: 죽은 컨트롤 0 (화면별) ────────────────────────────────────
// ignore = 기본 선택된 단일선택 항목(재클릭이 멱등이라 격리 클릭 시 변화 없음 — 죽은 게 아니라 이미 선택됨).
//          이들은 아래 기능 assert에서 '반대 옵션 클릭→aria 변화'로 따로 검증한다.
defineDeadControlTest(test, expect, { url: url('index.html'), name: 'S1 홈' });
defineDeadControlTest(test, expect, { url: url('add.html'), name: 'S2 입력', ignore: ['지출', '나', '공동'] });
defineDeadControlTest(test, expect, { url: url('list.html'), name: 'S3 내역', ignore: ['이번 달'] });
defineDeadControlTest(test, expect, { url: url('detail.html'), name: 'S4 상세' });
defineDeadControlTest(test, expect, { url: url('stats.html'), name: 'S5 통계', ignore: ['지출'] });
defineDeadControlTest(test, expect, { url: url('recurring.html'), name: 'S6 반복' });

// ── 2층 기능 완결성 (프로젝트 고유 assert) ─────────────────────────

test('입력: 금액+카테고리 채우면 저장 활성 → 저장 시 홈으로 (핵심 입력 경로)', async ({ page }) => {
  await page.goto(url('add.html'));
  const save = page.getByRole('button', { name: '저장' });
  await expect(save).toBeDisabled();                       // 유효성 미충족
  await page.getByLabel('금액').fill('12000');
  await page.getByRole('button', { name: '식비' }).click(); // 카테고리 단일선택
  await expect(save).toBeEnabled();                         // 유효 → 활성
  await save.click();
  await expect(page).toHaveURL(/index\.html$/);             // 저장 → 홈
});

test('입력: 수입/지출 세그먼트가 실제로 전환된다(aria-pressed)', async ({ page }) => {
  await page.goto(url('add.html'));
  const inc = page.getByRole('button', { name: '수입' });
  await expect(inc).toHaveAttribute('aria-pressed', 'false');
  await inc.click();
  await expect(inc).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: '지출' })).toHaveAttribute('aria-pressed', 'false');
});

test('입력: 반복 토글을 켜면 반복 옵션이 나타난다', async ({ page }) => {
  await page.goto(url('add.html'));
  const rep = page.getByRole('button', { name: '반복 거래로 설정' });
  await rep.click();
  await expect(rep).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByLabel('주기')).toBeVisible();
});

test('입력: 빠른입력 칩이 금액·카테고리를 채운다', async ({ page }) => {
  await page.goto(url('add.html'));
  await page.getByRole('button', { name: '점심' }).click();
  await expect(page.getByLabel('금액')).toHaveValue('9000');
  await expect(page.getByRole('button', { name: '식비' })).toHaveAttribute('aria-pressed', 'true');
});

test('내역: 필터 칩 토글이 목록 상태를 바꾼다', async ({ page }) => {
  await page.goto(url('list.html'));
  const cat = page.getByRole('button', { name: '식비' });
  await expect(cat).toHaveAttribute('aria-pressed', 'false');
  await cat.click();
  await expect(cat).toHaveAttribute('aria-pressed', 'true');
  // 기간 단일선택 전환
  await page.getByRole('button', { name: '지난 달' }).click();
  await expect(page.getByRole('button', { name: '지난 달' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: '이번 달' })).toHaveAttribute('aria-pressed', 'false');
});

test('내역 → 상세 → 삭제 확인 → 내역 (분기 도달)', async ({ page }) => {
  await page.goto(url('list.html'));
  await page.locator('#results a.row').first().click();
  await expect(page).toHaveURL(/detail\.html$/);
  await page.getByRole('button', { name: '삭제' }).click();      // 확인 시트
  await expect(page.getByRole('dialog', { name: '삭제 확인' })).toBeVisible();
  await page.getByRole('link', { name: '삭제' }).click();         // 확인 → 내역
  await expect(page).toHaveURL(/list\.html$/);
});

test('통계: 월 이동이 요약을 갱신하고, 데이터 없는 달은 빈 상태', async ({ page }) => {
  await page.goto(url('stats.html'));
  await expect(page.locator('#month')).toHaveText('2026.06');
  await page.getByRole('button', { name: '다음 달' }).click();
  await expect(page.locator('#month')).toHaveText('2026.07');
  await expect(page.locator('#empty')).toBeVisible();            // 빈 달
  // 수입/지출 탭 전환
  await page.getByRole('button', { name: '수입' }).click();
  await expect(page.getByRole('button', { name: '수입' })).toHaveAttribute('aria-pressed', 'true');
});

test('반복: 추가 폼 열고 규칙 저장 → 카드 증가 / 활성 토글', async ({ page }) => {
  await page.goto(url('recurring.html'));
  const before = await page.locator('#rules .card').count();
  await page.getByRole('button', { name: '추가' }).click();
  await expect(page.getByLabel('반복 규칙 추가')).toBeVisible();
  await page.getByRole('button', { name: '규칙 저장' }).click();
  await expect(page.locator('#rules .card')).toHaveCount(before + 1);
  // 활성 토글이 일시중지로
  const toggle = page.locator('#rules .toggle').first();
  await toggle.click();
  await expect(toggle).toHaveText('일시중지');
});
