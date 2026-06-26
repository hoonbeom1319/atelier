// quick-todo — 흐름·기능 검증 spec (3단계 자동, 6단계에 그대로 재실행)
// 출처: 00-flow.md §플로우 + §화면별 구성요소·상태 + §인터랙션 모델.
// 포터블 셀렉터(role·aria·exact text)라 와이어(wireframe/)와 하이파이(screens/) 양쪽에 그대로 돈다.
//   실행: node scripts/test-project.js quick-todo projects/quick-todo/wire.spec.js
const path = require('path');
const { test, expect } = require('@playwright/test');
const { defineReachabilityTest } = require('../../scripts/lib/crawl');
const { defineDeadControlTest } = require('../../scripts/lib/controls');
const { fileUrl } = require('../../scripts/lib/selectors');

// ── 대상 디렉터리: 환경변수로 와이어/스크린 전환(같은 spec 재사용). 기본은 wireframe.
const TARGET = process.env.QT_DIR || 'wireframe';
const DIR = path.join(__dirname, TARGET);
const url = fileUrl(DIR);
const MAIN = url('main.html');
const ALL_SCREENS = ['index.html', 'main.html'];

// 깨끗한 시드 상태에서 시작(저장 비우고 재로드 → seed: 미완료2 + 완료1).
async function fresh(page) {
  await page.goto(MAIN);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.reload();
}

// ── 1층: 도달성 + 막다른 길 0 + 고아 0 ───────────────────────────────────────
defineReachabilityTest(test, expect, { dir: DIR, screens: ALL_SCREENS });

// ── 2층: 죽은 컨트롤 0 ───────────────────────────────────────────────────────
// index: 링크(nav)·테마 토글(aria-pressed) 모두 와이어드.
defineDeadControlTest(test, expect, { url: url('index.html'), name: 'index 진입' });
// main: 프로버는 컨트롤마다 "재로드→클릭"으로 격리 판정한다. 그런데 이 앱은 상태를 localStorage에
// 영속(요구사항 G5)하므로, 필터/삭제처럼 *영속되는 상태를 바꾸는* 컨트롤은 재로드가 초기화되지
// 않아 프로버의 격리 전제가 깨진다(false negative). 그 컨트롤들은 아래 전용 기능 assert가
// 직접·결정적으로 검증한다. 프로버는 구조를 바꾸지 않는 컨트롤(테마 토글·체크박스)만 본다.
defineDeadControlTest(test, expect, {
  url: MAIN, name: 'main 메인',
  ignore: ['추가', '전체', '미완료', '완료', '삭제'],
});

// ── 2층 기능별 assert(프로젝트 고유 — "무엇이 어떻게 변해야 맞나") ─────────────
test.describe('main 기능 완결성', () => {
  test('F1 추가: 텍스트+Enter → 목록 끝에 추가·카운터+1·입력창 비움', async ({ page }) => {
    await fresh(page);
    const box = page.getByRole('textbox', { name: '새 할 일' });
    await box.fill('책 읽기');
    await box.press('Enter');
    await expect(page.getByRole('listitem').filter({ hasText: '책 읽기' })).toBeVisible();
    await expect(page.locator('#counter')).toHaveText('남은 할 일 3개'); // 기존 미완료 2 + 신규 1
    await expect(box).toHaveValue('');
  });

  test('F1 엣지: 공백만 입력 → 추가 안 됨', async ({ page }) => {
    await fresh(page);
    await expect(page.getByRole('listitem')).toHaveCount(3);
    await page.getByRole('textbox', { name: '새 할 일' }).fill('   ');
    await page.getByRole('button', { name: '추가' }).click();
    await expect(page.getByRole('listitem')).toHaveCount(3); // 변화 없음
  });

  test('F2 완료 토글: 체크 → 완료 상태·카운터 감소', async ({ page }) => {
    await fresh(page);
    await expect(page.locator('#counter')).toHaveText('남은 할 일 2개');
    await page.getByRole('checkbox', { name: '완료 표시: 장보기' }).click();
    await expect(page.locator('#counter')).toHaveText('남은 할 일 1개');
    await expect(page.getByRole('listitem').filter({ hasText: '장보기' })).toHaveClass(/done/);
  });

  test('F3 삭제: ✕ → 즉시 제거·카운터 갱신', async ({ page }) => {
    await fresh(page);
    await page.getByRole('listitem').filter({ hasText: '장보기' })
      .getByRole('button', { name: '삭제' }).click();
    await expect(page.getByRole('listitem').filter({ hasText: '장보기' })).toHaveCount(0);
    await expect(page.getByRole('listitem')).toHaveCount(2);
    await expect(page.locator('#counter')).toHaveText('남은 할 일 1개');
  });

  test('F4 필터: 미완료/완료/전체 전환 + 탭 강조', async ({ page }) => {
    await fresh(page);
    await page.getByRole('tab', { name: '미완료', exact: true }).click();
    await expect(page.getByRole('tab', { name: '미완료', exact: true })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('listitem')).toHaveCount(2); // 미완료 2
    await expect(page.getByRole('listitem').filter({ hasText: '메일 확인' })).toHaveCount(0);

    await page.getByRole('tab', { name: '완료', exact: true }).click();
    await expect(page.getByRole('listitem')).toHaveCount(1); // 완료 1
    await expect(page.getByRole('listitem').filter({ hasText: '메일 확인' })).toBeVisible();

    await page.getByRole('tab', { name: '전체', exact: true }).click();
    await expect(page.getByRole('listitem')).toHaveCount(3);
  });

  test('F6 빈 상태(전체 0개): 모두 삭제 → 안내', async ({ page }) => {
    await fresh(page);
    for (let i = 0; i < 3; i++) await page.getByRole('button', { name: '삭제' }).first().click();
    await expect(page.getByRole('listitem')).toHaveCount(0);
    await expect(page.locator('#emptyTitle')).toHaveText('할 일이 없습니다');
  });

  test('F6 빈 상태(필터 매칭 0개): 완료 0개에서 완료 탭 → 필터별 안내', async ({ page }) => {
    await fresh(page);
    await page.getByRole('checkbox', { name: '완료 표시: 메일 확인' }).click(); // 완료→미완료, 완료 0개
    await page.getByRole('tab', { name: '완료', exact: true }).click();
    await expect(page.locator('#emptyTitle')).toHaveText('완료된 할 일이 없습니다');
  });

  test('G5 영속: 추가 후 새로고침 → 목록·필터 유지', async ({ page }) => {
    await fresh(page);
    await page.getByRole('textbox', { name: '새 할 일' }).fill('지속 테스트');
    await page.getByRole('button', { name: '추가' }).click();
    await page.getByRole('tab', { name: '미완료', exact: true }).click();
    await page.reload(); // 비우지 않고 재진입
    await expect(page.getByRole('listitem').filter({ hasText: '지속 테스트' })).toBeVisible();
    await expect(page.getByRole('tab', { name: '미완료', exact: true })).toHaveAttribute('aria-selected', 'true');
  });

  test('S5 테마 토글: aria-pressed 반전 + 영속', async ({ page }) => {
    await fresh(page);
    const t = page.getByRole('button', { name: '테마 전환' });
    await expect(t).toHaveAttribute('aria-pressed', 'false');
    await t.click();
    await expect(t).toHaveAttribute('aria-pressed', 'true');
    await page.reload();
    await expect(page.getByRole('button', { name: '테마 전환' })).toHaveAttribute('aria-pressed', 'true');
  });
});

// ── G4 반응형 무파손: 390px·1280px 가로 스크롤/오버플로 0 ─────────────────────
for (const w of [390, 1280]) {
  test(`G4 반응형 ${w}px: 가로 오버플로 0`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 800 });
    await fresh(page);
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `가로 오버플로 ${overflow}px`).toBeLessThanOrEqual(1);
  });
}
