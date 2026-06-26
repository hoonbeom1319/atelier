// spotlog — 흐름·기능 검증 spec (3단계 자동, 6단계에 그대로 재실행)
// 출처: 00-flow.md §플로우 + §화면별 구성요소·상태 + §인터랙션 모델.
// 포터블 셀렉터(role·aria·exact text)라 와이어(wireframe/)와 하이파이(screens/) 양쪽에 그대로 돈다.
//   실행: node scripts/test-project.js spotlog projects/spotlog/wire.spec.js
//   하이파이 대상:  SPOTLOG_DIR=screens node scripts/test-project.js spotlog projects/spotlog/wire.spec.js
const path = require('path');
const { test, expect } = require('@playwright/test');
const { defineReachabilityTest } = require('../../scripts/lib/crawl');
const { defineDeadControlTest } = require('../../scripts/lib/controls');
const { fileUrl } = require('../../scripts/lib/selectors');

// ── 대상 디렉터리: 환경변수로 와이어/스크린 전환(같은 spec 재사용). 기본은 wireframe.
const TARGET = process.env.SPOTLOG_DIR || 'wireframe';
const DIR = path.join(__dirname, TARGET);
const url = fileUrl(DIR);
const ALL_SCREENS = [
  'index.html', 'upload-select.html', 'upload-group.html', 'map-pin.html',
  'upload-publish.html', 'card-detail.html', 'explore.html', 'profile.html',
];

// 모바일 폭 컬럼 셸이 기준(390px). 데스크톱(1280px)도 같은 디자인이라 별도 분기 없음.
test.use({ viewport: { width: 390, height: 840 } });

// ── 1층: 도달성 + 막다른 길 0 + 고아 0 ───────────────────────────────────────
defineReachabilityTest(test, expect, { dir: DIR, screens: ALL_SCREENS });

// ── 2층: 죽은 컨트롤 0 (화면별) ───────────────────────────────────────────────
// ignore = "와이어드는 됐으나 격리 프로버(fresh-load 클릭) 전제가 깨지는" 컨트롤. 모두 아래 기능 assert가 직접 검증한다:
//   · '사진 올리기'  — 빈 상태 안에 있어 기본 hidden(데모 토글로만 노출). 부모가 hidden이라 격리 클릭 불가.
//   · '지도에서 직접 지정'·'닫기' — 팝오버(기본 hidden) 내부. 팝오버를 열어야 도달.
//   · '사진 1 보기'  — 기본 활성 썸네일이라 격리 클릭 시 같은 상태(무변화). thumb2가 전환을 증명.
defineDeadControlTest(test, expect, { url: url('index.html'), name: 'index 메인 피드', ignore: ['사진 올리기'] });
defineDeadControlTest(test, expect, { url: url('upload-select.html'), name: 'upload-select 사진 선택' });
defineDeadControlTest(test, expect, { url: url('upload-group.html'), name: 'upload-group 자동 그룹핑', ignore: ['지도에서 직접 지정', '닫기'] });
defineDeadControlTest(test, expect, { url: url('map-pin.html'), name: 'map-pin 핀 지정' });
// '태그 추가'는 텍스트 입력 의존(빈 입력 클릭은 무동작) → 격리 프로버 면제, 아래 기능 assert가 직접 검증.
defineDeadControlTest(test, expect, { url: url('upload-publish.html'), name: 'upload-publish 게시', ignore: ['태그 추가'] });
defineDeadControlTest(test, expect, { url: url('card-detail.html'), name: 'card-detail 카드 상세', ignore: ['사진 1 보기'] });
// '시작하기' — 탐색 빈 상태 안의 CTA(기본 hidden). 격리 프로버가 못 열어 클릭 불가 → 면제(빈 상태 토글 테스트가 노출 검증).
defineDeadControlTest(test, expect, { url: url('explore.html'), name: 'explore 탐색', ignore: ['시작하기'] });
defineDeadControlTest(test, expect, { url: url('profile.html'), name: 'profile 프로필' });

// ── 2층 기능별 assert(프로젝트 고유 — "무엇이 어떻게 변해야 맞나") ─────────────

test.describe('흐름 A — 업로드 핵심 루프', () => {
  test('F1 다중 선택: 사진 3장 선택 → 카운터 증가 + 다음 활성 → 그룹핑 화면 이동', async ({ page }) => {
    await page.goto(url('upload-select.html'));
    await expect(page.getByRole('button', { name: '다음' })).toBeDisabled();
    for (const n of [1, 2, 3]) await page.getByRole('checkbox', { name: `사진 ${n} 선택` }).click();
    await expect(page.locator('#selCount')).toHaveText('3장 선택');
    await expect(page.getByRole('checkbox', { name: '사진 1 선택' })).toHaveAttribute('aria-checked', 'true');
    const next = page.getByRole('button', { name: '다음' });
    await expect(next).toBeEnabled();
    await next.click();
    await expect(page).toHaveURL(/upload-group\.html/);
  });

  test('F1 엣지: 선택 0장이면 다음 비활성(이동 불가)', async ({ page }) => {
    await page.goto(url('upload-select.html'));
    await expect(page.getByRole('button', { name: '다음' })).toBeDisabled();
    // 한 장 선택했다 해제하면 다시 비활성
    await page.getByRole('checkbox', { name: '사진 5 선택' }).click();
    await expect(page.getByRole('button', { name: '다음' })).toBeEnabled();
    await page.getByRole('checkbox', { name: '사진 5 선택' }).click();
    await expect(page.locator('#selCount')).toHaveText('0장 선택');
    await expect(page.getByRole('button', { name: '다음' })).toBeDisabled();
  });

  test('F2 후보 팝오버: 장소명 탭 → 후보 선택 → 카드 장소명 확정·팝오버 닫힘', async ({ page }) => {
    await page.goto(url('upload-group.html'));
    const editBtn = page.getByRole('button', { name: /성수동 인근/ });
    await editBtn.click();
    const pop = page.getByRole('dialog', { name: '장소명 후보' });
    await expect(pop).toBeVisible();
    await expect(editBtn).toHaveAttribute('aria-expanded', 'true');
    await page.getByRole('button', { name: /카페 오니/ }).click();
    await expect(pop).toBeHidden();
    await expect(page.getByRole('button', { name: /카페 오니/ })).toBeVisible(); // 카드 장소명이 갱신됨
  });

  test('F2 엣지: 후보 0건 카드 → "주변 등록된 장소 없음" + 지도 직접 지정 폴백', async ({ page }) => {
    await page.goto(url('upload-group.html'));
    await page.getByRole('button', { name: /좌표만/ }).click();
    const pop = page.getByRole('dialog', { name: '장소명 후보' });
    await expect(pop).toBeVisible();
    await expect(pop.getByText('주변 등록된 장소가 없습니다')).toBeVisible();
    await expect(pop.getByRole('link', { name: '지도에서 직접 지정' })).toBeVisible();
  });

  test('F2(c) 지도 핀: 핀 이동 → 좌표 변화 → 확정 시 그룹핑 복귀', async ({ page }) => {
    await page.goto(url('map-pin.html'));
    const before = await page.locator('#coord').textContent();
    await page.getByRole('button', { name: '핀 위로' }).click();
    await expect(page.locator('#coord')).not.toHaveText(before);
    await page.getByRole('link', { name: '이 위치로 확정' }).click();
    await expect(page).toHaveURL(/upload-group\.html/);
  });

  test('F3 미분류 이동: 사진 이동 → 트레이 카운트 감소 → 0이면 섹션 숨김', async ({ page }) => {
    await page.goto(url('upload-group.html'));
    await expect(page.locator('#unclassCount')).toHaveText('(3장)');
    const moveBtns = page.getByRole('button', { name: '첫 카드로 이동' });
    await moveBtns.first().click();
    await expect(page.locator('#unclassCount')).toHaveText('(2장)');
    await moveBtns.first().click();
    await moveBtns.first().click();
    await expect(page.locator('#unclassified')).toBeHidden(); // 0장 → 섹션 사라짐
  });

  test('F6+F7 게시: 공개 토글(기본 비공개) → 고지 변화 + 태그 추가 + 게시 → 홈 복귀', async ({ page }) => {
    await page.goto(url('upload-group.html'));
    await page.getByRole('link', { name: '다음' }).click();
    await expect(page).toHaveURL(/upload-publish\.html/);
    // 기본 비공개
    const sw = page.locator('#visToggle');
    await expect(sw).toHaveAttribute('aria-checked', 'false');
    await expect(page.locator('#notice')).toContainText('비공개');
    // 공개로 토글 → 고지 변화
    await sw.click();
    await expect(sw).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('#notice')).toContainText('공개됩니다');
    // 태그 추가
    await page.locator('#tagInput').fill('카페');
    await page.getByRole('button', { name: '태그 추가' }).click();
    await expect(page.locator('#chips')).toContainText('#카페');
    // 게시
    await page.getByRole('link', { name: '게시' }).click();
    await expect(page).toHaveURL(/index\.html/);
  });
});

test.describe('흐름 B — 내 기록 열람', () => {
  test('카드 탭 → 상세 → 썸네일로 대표 사진 교체', async ({ page }) => {
    await page.goto(url('index.html'));
    await page.getByRole('link', { name: /성수동 카페 오니/ }).click();
    await expect(page).toHaveURL(/card-detail\.html/);
    await expect(page.locator('#hero')).toHaveText('대표 사진 1');
    await page.getByRole('button', { name: '사진 2 보기' }).click();
    await expect(page.locator('#hero')).toHaveText('대표 사진 2');
    await expect(page.getByRole('button', { name: '사진 2 보기' })).toHaveAttribute('aria-pressed', 'true');
  });

  test('빈 상태 데모: 토글 → "첫 장소를 기록하세요" + 업로드 CTA', async ({ page }) => {
    await page.goto(url('index.html'));
    await page.getByRole('button', { name: /빈 상태 토글/ }).click();
    await expect(page.locator('#feedEmpty')).toBeVisible();
    await expect(page.locator('#emptyTitle')).toHaveText('사진을 올려 첫 장소를 기록하세요');
    await expect(page.getByRole('link', { name: /사진 올리기/ })).toBeVisible();
  });
});

test.describe('흐름 C — 탐색·팔로우', () => {
  test('탐색 → 프로필 → 팔로우 토글(aria-pressed + 팔로워 수 +1)', async ({ page }) => {
    await page.goto(url('explore.html'));
    await page.getByRole('link', { name: '@mina_walks' }).first().click();
    await expect(page).toHaveURL(/profile\.html/);
    const btn = page.getByRole('button', { name: '팔로우' });
    await expect(btn).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('#followerCount')).toHaveText('312');
    await btn.click();
    await expect(page.getByRole('button', { name: '팔로잉' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#followerCount')).toHaveText('313');
  });

  test('탐색 빈 상태 데모 토글', async ({ page }) => {
    await page.goto(url('explore.html'));
    await page.getByRole('button', { name: /빈 상태 토글/ }).click();
    await expect(page.locator('#exploreEmpty')).toBeVisible();
  });

  test('탐색 카드 → 상세 이동', async ({ page }) => {
    await page.goto(url('explore.html'));
    await page.getByRole('link', { name: /망원 한강공원/ }).click();
    await expect(page).toHaveURL(/card-detail\.html/);
  });
});

// ── G4 반응형 무파손: 390px·1280px에서 전 화면 가로 오버플로 0 ─────────────────
for (const w of [390, 1280]) {
  for (const screen of ALL_SCREENS) {
    test(`G4 반응형 ${w}px: ${screen} 가로 오버플로 0`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto(url(screen));
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `가로 오버플로 ${overflow}px`).toBeLessThanOrEqual(1);
    });
  }
}
