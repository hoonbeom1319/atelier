// collab-kanban — 흐름·기능 검증 spec (3단계 자동, 6단계에 그대로 재실행)
// 출처: 00-flow.md §플로우 + §화면별 구성요소·상태 + §인터랙션 모델.
// 포터블 셀렉터(role·aria·exact text)라 와이어(wireframe/)와 하이파이(screens/) 양쪽에 그대로 돈다.
//   실행: node scripts/test-project.js collab-kanban projects/collab-kanban/wire.spec.js
const path = require('path');
const { test, expect } = require('@playwright/test');
const { defineReachabilityTest } = require('../../scripts/lib/crawl');
const { defineDeadControlTest } = require('../../scripts/lib/controls');
const { fileUrl } = require('../../scripts/lib/selectors');

// ── 대상 디렉터리: 환경변수로 와이어/스크린 전환(같은 spec 재사용). 기본은 wireframe.
const TARGET = process.env.CK_DIR || 'wireframe';
const DIR = path.join(__dirname, TARGET);
const url = fileUrl(DIR);
const BOARD = url('board.html');
const ALL_SCREENS = ['index.html', 'board.html'];

async function fresh(page) {
  await page.goto(BOARD);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.reload();
}
const colCount = (page, name) => page.getByRole('region', { name, exact: true }).locator('.col-count');
const cardLi = (page, text) => page.getByRole('listitem').filter({ hasText: text });

// ── 1층: 도달성 + 막다른 길 0 + 고아 0 ───────────────────────────────────────
defineReachabilityTest(test, expect, { dir: DIR, screens: ALL_SCREENS });

// ── 2층: 죽은 컨트롤 0 ───────────────────────────────────────────────────────
defineDeadControlTest(test, expect, { url: url('index.html'), name: 'index 진입' });
defineDeadControlTest(test, expect, { url: BOARD, name: 'board 메인' });

// ── 2층 기능별 assert(프로젝트 고유) ─────────────────────────────────────────
test.describe('board 기능 완결성', () => {
  test('초기 시드: 컬럼별 카드 수 + 총 6장', async ({ page }) => {
    await fresh(page);
    await expect(page.getByRole('listitem')).toHaveCount(6);
    await expect(colCount(page, '백로그')).toHaveText('2');
    await expect(colCount(page, '할 일')).toHaveText('2');
    await expect(colCount(page, '진행 중')).toHaveText('1');
    await expect(colCount(page, '검토')).toHaveText('0');   // 빈 컬럼 변형(G3)
    await expect(colCount(page, '완료')).toHaveText('1');
  });

  test('F1 카드 이동(메뉴/키보드 경로): 백로그→진행 중 + 카운터 갱신 + 활동 로그', async ({ page }) => {
    await fresh(page);
    const card = cardLi(page, '온보딩 플로우 개선');
    await card.getByRole('button', { name: /카드 메뉴: 온보딩/ }).click();
    await card.getByRole('menuitem', { name: '진행 중(으)로 이동', exact: true }).click();
    // 카운터 갱신
    await expect(colCount(page, '백로그')).toHaveText('1');
    await expect(colCount(page, '진행 중')).toHaveText('2');
    // 카드가 진행 중 컬럼에 있음
    await expect(page.getByRole('region', { name: '진행 중', exact: true })
      .getByRole('listitem').filter({ hasText: '온보딩 플로우 개선' })).toBeVisible();
    // 활동 로그 'moved' 기록 — 상세 패널 활동 타임라인에서 확인
    await cardLi(page, '온보딩 플로우 개선').getByRole('button', { name: /카드 열기: 온보딩/ }).click();
    await page.getByRole('dialog').getByRole('button', { name: '타임라인 필터: 활동', exact: true }).click();
    await expect(page.getByRole('dialog').getByText('진행 중(으)로 이동함')).toBeVisible();
  });

  test('F1 드래그 시각 상태(G2): dragstart→dragging, 컬럼 dragenter→drop-target', async ({ page }) => {
    await fresh(page);
    const card = cardLi(page, '대시보드 차트 추가');
    await card.dispatchEvent('dragstart');
    await expect(card).toHaveClass(/dragging/);
    const target = page.getByRole('region', { name: '완료', exact: true });
    await target.dispatchEvent('dragenter');
    await expect(target).toHaveClass(/drop-target/);
  });

  test('F2 담당자 배정: 미배정 카드 → 배정 → 카드 표면 아바타 반영', async ({ page }) => {
    await fresh(page);
    const card = cardLi(page, '결제 오류 수정');
    await expect(card.locator('[aria-label="미배정"]')).toBeVisible();
    await card.getByRole('button', { name: /카드 열기: 결제/ }).click();
    const dlg = page.getByRole('dialog');
    await dlg.getByRole('button', { name: '담당자 변경' }).click();
    await dlg.getByRole('button', { name: '담당자 지정: 박서연' }).click();
    await dlg.getByRole('button', { name: '상세 닫기' }).click();
    await expect(cardLi(page, '결제 오류 수정').locator('[aria-label="담당자: 박서연"]')).toBeVisible();
  });

  test('F3 멤버 필터: 박서연 토글 → 박서연 카드만 + 카운트 반영 + 해제 복귀', async ({ page }) => {
    await fresh(page);
    await page.getByRole('button', { name: '담당자 필터: 박서연' }).click();
    await expect(page.getByRole('listitem')).toHaveCount(1);
    await expect(cardLi(page, '대시보드 차트 추가')).toBeVisible();
    await expect(colCount(page, '할 일')).toHaveText('1');
    await expect(colCount(page, '백로그')).toHaveText('0');
    await page.getByRole('button', { name: '담당자 필터: 박서연' }).click(); // off
    await expect(page.getByRole('listitem')).toHaveCount(6);
  });

  test('F3 필터 0건: 마감 "오늘" → 빈 보드 상태 + 필터 해제', async ({ page }) => {
    await fresh(page);
    await page.getByRole('button', { name: '마감 필터: 오늘' }).click();
    await expect(page.getByRole('listitem')).toHaveCount(0);
    await expect(page.getByText('조건에 맞는 카드가 없습니다')).toBeVisible();
    await page.getByRole('button', { name: '필터 해제' }).first().click();
    await expect(page.getByRole('listitem')).toHaveCount(6);
  });

  test('F3 "내 카드만"(김지원): 본인 카드만', async ({ page }) => {
    await fresh(page);
    await page.getByRole('button', { name: '내 카드만' }).click();
    await expect(page.getByRole('listitem')).toHaveCount(1);
    await expect(cardLi(page, '온보딩 플로우 개선')).toBeVisible();
  });

  test('F4 @멘션 댓글: 작성 → 타임라인 추가 + 멘션 칩 + 표면 댓글수 +1', async ({ page }) => {
    await fresh(page);
    await cardLi(page, '로그인 화면 리디자인').getByRole('button', { name: /카드 열기: 로그인/ }).click();
    const dlg = page.getByRole('dialog');
    await dlg.getByRole('textbox', { name: '댓글 입력' }).fill('@박서연 확인 부탁드려요');
    await dlg.getByRole('button', { name: '댓글 작성' }).click();
    await expect(dlg.getByText('확인 부탁드려요')).toBeVisible();
    await expect(dlg.locator('.mention')).toContainText('박서연');
    await dlg.getByRole('button', { name: '상세 닫기' }).click();
    await expect(cardLi(page, '로그인 화면 리디자인').locator('[aria-label="댓글 6개"]')).toBeVisible();
  });

  test('F4 빈 댓글 무시: 공백 → 추가 안 됨', async ({ page }) => {
    await fresh(page);
    await cardLi(page, 'API 문서 작성').getByRole('button', { name: /카드 열기: API/ }).click();
    const dlg = page.getByRole('dialog');
    await expect(dlg.getByRole('button', { name: '타임라인 필터: 댓글', exact: true })).toBeVisible();
    await dlg.getByRole('button', { name: '타임라인 필터: 댓글', exact: true }).click();
    const before = await dlg.locator('.tl-item.comment').count();
    await dlg.getByRole('textbox', { name: '댓글 입력' }).fill('   ');
    await dlg.getByRole('button', { name: '댓글 작성' }).click();
    await expect(dlg.locator('.tl-item.comment')).toHaveCount(before);
  });

  test('F4 타임라인 필터: 전체/댓글/활동 전환', async ({ page }) => {
    await fresh(page);
    await cardLi(page, '로그인 화면 리디자인').getByRole('button', { name: /카드 열기: 로그인/ }).click();
    const dlg = page.getByRole('dialog');
    await dlg.getByRole('button', { name: '타임라인 필터: 활동', exact: true }).click();
    await expect(dlg.locator('.tl-item.comment')).toHaveCount(0);
    await expect(dlg.locator('.tl-item.activity').first()).toBeVisible();
    await dlg.getByRole('button', { name: '타임라인 필터: 댓글', exact: true }).click();
    await expect(dlg.locator('.tl-item.activity')).toHaveCount(0);
  });

  test('F5 카드 추가: 할 일에 추가 → 카운트 +1', async ({ page }) => {
    await fresh(page);
    await page.getByRole('button', { name: '카드 추가: 할 일' }).click();
    await page.getByRole('textbox', { name: '새 카드 제목: 할 일' }).fill('스모크 테스트 카드');
    await page.getByRole('textbox', { name: '새 카드 제목: 할 일' }).press('Enter');
    await expect(page.getByRole('region', { name: '할 일', exact: true })
      .getByRole('listitem').filter({ hasText: '스모크 테스트 카드' })).toBeVisible();
    await expect(colCount(page, '할 일')).toHaveText('3');
  });

  test('F5 빈 제목 무시: 공백 → 추가 안 됨', async ({ page }) => {
    await fresh(page);
    await page.getByRole('button', { name: '카드 추가: 백로그' }).click();
    await page.getByRole('textbox', { name: '새 카드 제목: 백로그' }).fill('   ');
    await page.getByRole('button', { name: '추가 확정: 백로그' }).click();
    await expect(colCount(page, '백로그')).toHaveText('2');
  });

  test('F6 overdue 강조: 결제 오류 수정(지남) → overdue 클래스', async ({ page }) => {
    await fresh(page);
    await expect(cardLi(page, '결제 오류 수정').locator('.due.overdue')).toBeVisible();
  });

  test('F8 뷰어 읽기 전용: 드래그 불가 + 메뉴/추가 숨김 + 안내', async ({ page }) => {
    await fresh(page);
    await page.getByRole('button', { name: '역할 전환' }).click();
    await expect(page.getByRole('button', { name: '역할 전환' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText('읽기 전용 — 보기만 가능합니다')).toBeVisible();
    await expect(page.getByRole('button', { name: /카드 메뉴/ })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /카드 추가/ })).toHaveCount(0);
    await expect(page.getByRole('listitem').first()).toHaveAttribute('draggable', 'false');
  });

  test('F8 뷰어 상세: 댓글 입력 숨김', async ({ page }) => {
    await fresh(page);
    await page.getByRole('button', { name: '역할 전환' }).click();
    await cardLi(page, '로그인 화면 리디자인').getByRole('button', { name: /카드 열기: 로그인/ }).click();
    await expect(page.getByRole('dialog').getByText('읽기 전용 — 댓글을 남길 수 없습니다')).toBeVisible();
    await expect(page.getByRole('dialog').getByRole('textbox', { name: '댓글 입력' })).toHaveCount(0);
  });

  test('F9 테마 토글: aria-pressed 반전 + 영속', async ({ page }) => {
    await fresh(page);
    const t = page.getByRole('button', { name: '테마 전환' });
    await expect(t).toHaveAttribute('aria-pressed', 'false');
    await t.click();
    await expect(t).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.reload(); // 비우지 않고 재진입
    await expect(page.getByRole('button', { name: '테마 전환' })).toHaveAttribute('aria-pressed', 'true');
  });
});

// ── 앱 셸 / 대시보드 홈 ──────────────────────────────────────────────────────
test.describe('앱 셸 / 대시보드 홈', () => {
  test('사이드바 네비: 홈 → 보드 → 홈 이동', async ({ page }) => {
    await page.goto(url('index.html'));
    await page.getByRole('link', { name: '보드', exact: true }).click();
    await expect(page).toHaveURL(/board\.html$/);
    await page.getByRole('link', { name: '홈', exact: true }).click();
    await expect(page).toHaveURL(/index\.html$/);
  });

  test('대시보드: 인사 + 내게 배정된 카드 + 내 보드 링크', async ({ page }) => {
    await page.goto(url('index.html'));
    await expect(page.getByRole('heading', { name: /안녕하세요/ })).toBeVisible();
    await expect(page.getByRole('region', { name: '내게 배정된 카드' }).getByText('온보딩 플로우 개선')).toBeVisible();
    await expect(page.getByRole('region', { name: '최근 활동' })).toBeVisible();
    await page.getByRole('link', { name: '제품 보드 열기' }).click();
    await expect(page).toHaveURL(/board\.html$/);
  });

  test('탑바 알림 드롭다운: aria-expanded 토글 (홈)', async ({ page }) => {
    await page.goto(url('index.html'));
    const n = page.getByRole('button', { name: '알림' });
    await expect(n).toHaveAttribute('aria-expanded', 'false');
    await n.click();
    await expect(n).toHaveAttribute('aria-expanded', 'true');
  });

  test('탑바 사용자 메뉴 드롭다운: aria-expanded 토글 (보드)', async ({ page }) => {
    await fresh(page);
    const u = page.getByRole('button', { name: '사용자 메뉴' });
    await u.click();
    await expect(u).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('menu', { name: '사용자 메뉴' })).toBeVisible();
  });
});

// ── G5 데스크톱 레이아웃 무파손: 1280·1440px 가로 오버플로 0 ──────────────────
for (const w of [1280, 1440]) {
  test(`G5 데스크톱 ${w}px: 페이지 가로 오버플로 0`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 900 });
    await fresh(page);
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `가로 오버플로 ${overflow}px`).toBeLessThanOrEqual(1);
  });
}
