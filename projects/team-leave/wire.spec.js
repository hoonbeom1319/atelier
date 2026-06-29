// team-leave — 흐름·기능 자동 검증 (3단계). 00-flow.md §플로우·§구성요소·상태·§인터랙션 모델에서 파생.
// 1층(도달성)·2층(죽은 컨트롤)은 scripts/lib 골격 재사용. 프로젝트 고유 기능 assert만 직접.
// 뷰포트: 데스크톱 1280x900 (00-flow). 같은 spec이 hi-fi(6단계)에도 그대로 재사용된다(포터블 셀렉터).
const path = require('path');
const { test, expect } = require('@playwright/test');
const { defineReachabilityTest } = require('../../scripts/lib/crawl');
const { defineDeadControlTest } = require('../../scripts/lib/controls');
const { fileUrl } = require('../../scripts/lib/selectors');

// 와이어/스크린 폴더를 env로 전환 — 같은 spec을 screens/에도 재사용(6단계).
const DIR = process.env.TL_DIR || 'wireframe';
const url = fileUrl(path.join(__dirname, DIR));

const ALL_SCREENS = [
  'index.html', 'login.html', 'home.html', 'request.html', 'approvals.html',
  'calendar.html', 'balance.html', 'requests.html', 'notifications.html',
  'members.html', 'settings.html',
];

test.use({ viewport: { width: 1280, height: 900 } });

// ───────── 1층: 도달성 + 막다른 길 0 + 고아 0 ─────────
defineReachabilityTest(test, expect, { dir: path.join(__dirname, DIR), screens: ALL_SCREENS });

// ───────── 2층: 화면별 죽은 컨트롤 0 ─────────
// ignore: 현재 상태를 이미 반영한 "활성 탭"은 클릭해도 no-op(자기참조) — nav cur와 동성격이라 면제.
const DEAD_IGNORE = { 'approvals.html': ['대기 ('] };
for (const s of ALL_SCREENS) {
  defineDeadControlTest(test, expect, { url: url(s), name: s, ignore: DEAD_IGNORE[s] || [] });
}

// ───────── 2층: 프로젝트 고유 기능 완결성 ─────────

test('SC2 홈 — 역할 전환이 뷰를 바꾼다(직원→팀장→HR)', async ({ page }) => {
  await page.goto(url('home.html'));
  await expect(page.locator('#title')).toHaveText('홈 — 직원 뷰');
  await page.locator('#role').selectOption('mgr');
  await expect(page.locator('#title')).toHaveText('홈 — 팀장 뷰');
  await expect(page.getByText('승인 대기 큐', { exact: true })).toBeVisible();
  await page.locator('#role').selectOption('hr');
  await expect(page.locator('#title')).toHaveText('홈 — HR 뷰');
  await expect(page.getByText('부여 미설정 직원', { exact: true })).toBeVisible();
});

test('SC3 신청 — 잔액 미리보기 계산 + 제출 활성(유효 기간)', async ({ page }) => {
  await page.goto(url('request.html'));
  await expect(page.locator('#days')).toHaveText('2일');
  await expect(page.locator('#rem')).toHaveText('8일');
  // 유효 기간이면 제출 링크가 활성(disabled 없음)
  await expect(page.locator('#submit')).not.toHaveAttribute('disabled', /.*/);
});

test('SC3 신청 — 반차 선택 시 시간대 노출 + 0.5일 차감', async ({ page }) => {
  await page.goto(url('request.html'));
  await page.locator('#type').selectOption('half');
  await expect(page.locator('#halfWrap')).toBeVisible();
  await expect(page.locator('#days')).toHaveText('0.5일');
});

test('SC3 신청 — 기간 역순이면 경고 + 제출 차단(검증)', async ({ page }) => {
  await page.goto(url('request.html'));
  await page.locator('#start').fill('2026-07-25');
  await page.locator('#end').fill('2026-07-20');
  await expect(page.locator('#warn')).toBeVisible();
  await expect(page.locator('#submit')).toHaveAttribute('disabled', /.*/);
});

test('SC4 승인 큐 — 승인이 행 상태를 확정으로 바꾼다', async ({ page }) => {
  await page.goto(url('approvals.html'));
  const firstRow = page.locator('#rows tr[data-row]').first();
  await firstRow.getByRole('button', { name: '승인' }).click();
  await expect(firstRow.locator('[data-status]')).toHaveText('승인');
});

test('SC4 승인 큐 — 반려는 사유 필수(미입력 시 제출 비활성)', async ({ page }) => {
  await page.goto(url('approvals.html'));
  await page.locator('#rows tr[data-row]').first().getByRole('button', { name: '반려' }).click();
  await expect(page.locator('#rejectModal')).toBeVisible();
  await expect(page.locator('#rejSubmit')).toBeDisabled();
  await page.locator('#rejReason').fill('Q3 출시 주간과 겹침');
  await expect(page.locator('#rejSubmit')).toBeEnabled();
  await page.locator('#rejSubmit').click();
  await expect(page.locator('#rows tr[data-row]').first().locator('[data-status]')).toHaveText('반려');
});

test('SC4 승인 큐 — 탭 전환(대기/처리됨)', async ({ page }) => {
  await page.goto(url('approvals.html'));
  await page.getByRole('button', { name: /처리됨/ }).click();
  await expect(page.locator('#pane-done')).toBeVisible();
  await expect(page.locator('#pane-pending')).toBeHidden();
});

test('SC5 캘린더 — 월 이동 + 팀 필터 동작', async ({ page }) => {
  await page.goto(url('calendar.html'));
  await expect(page.locator('#month')).toHaveText('2026년 7월');
  await page.getByRole('button', { name: '▶' }).click();
  await expect(page.locator('#month')).toHaveText('2026년 8월');
  await page.getByRole('button', { name: '◀' }).click();
  await expect(page.locator('#month')).toHaveText('2026년 7월');
  await page.locator('#team').selectOption('biz');
  await expect(page.locator('#maxabs')).toHaveText('1명');
});

test('SC7 내 신청 — 상세 이력 열기 + 미래 승인 건 취소', async ({ page }) => {
  await page.goto(url('requests.html'));
  await page.locator('#rows tr[data-row]').first().getByRole('button', { name: '상세' }).click();
  await expect(page.locator('#detail')).toBeVisible();
  // 두 번째 행(승인·미래) 취소
  const approvedRow = page.locator('#rows tr[data-row]').nth(1);
  await approvedRow.getByRole('button', { name: '취소' }).click();
  await expect(approvedRow.locator('.tag')).toHaveText('취소');
});

test('SC8 알림 — 읽음 처리로 안읽음 카운트 감소', async ({ page }) => {
  await page.goto(url('notifications.html'));
  await expect(page.locator('#badge')).toHaveText('2');
  await page.locator('#list li[data-n]').first().getByRole('button', { name: '읽음' }).click();
  await expect(page.locator('#badge')).toHaveText('1');
  await page.getByRole('button', { name: '모두 읽음' }).click();
  await expect(page.locator('#badge')).toHaveText('0');
});

test('SC9 멤버 — 시드 하향(기존 사용분 침범) 차단', async ({ page }) => {
  await page.goto(url('members.html'));
  // 김민수: total=15, used=3, pending=2 → floor=5
  await page.locator('tbody tr').first().getByRole('button', { name: '부여 시드 편집' }).click();
  await expect(page.locator('#seedModal')).toBeVisible();
  await page.locator('#total').fill('4'); // floor(5) 미만
  await expect(page.locator('#seedWarn')).toBeVisible();
  await expect(page.locator('#seedSave')).toBeDisabled();
  await page.locator('#total').fill('-1'); // 음수
  await expect(page.locator('#seedSave')).toBeDisabled();
});

test('SC9 멤버 — 유효 시드 저장 시 잔여 갱신 + 미설정 플래그 해소', async ({ page }) => {
  await page.goto(url('members.html'));
  // 박지훈(3행): 부여 미설정 → 11일 부여
  const row = page.locator('tbody tr').nth(2);
  await expect(row.locator('.flag')).toBeVisible();
  await row.getByRole('button', { name: '부여 시드 편집' }).click();
  await page.locator('#total').fill('11');
  await page.locator('#seedSave').click();
  await expect(row.locator('[data-rem]')).toHaveText('11일');
  await expect(row.locator('.flag')).toHaveCount(0);
});
