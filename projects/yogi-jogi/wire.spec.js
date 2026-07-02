// 요기조기 — 와이어프레임 흐름·기능 검증 (3단계: 1·2층 자동)
// lib 골격 재사용: 1층 도달성/막다른길/고아 · 2층 죽은 컨트롤 0(클릭-디프).
// 셀렉터는 role·aria·exact-text → 같은 spec이 hi-fi(6단계)에도 그대로 돈다.
const { test, expect } = require('@playwright/test');
const path = require('path');
const { defineReachabilityTest } = require('../../scripts/lib/crawl');
const { defineDeadControlTest } = require('../../scripts/lib/controls');
const { fileUrl } = require('../../scripts/lib/selectors');

const WIRE = path.join(__dirname, 'wireframe');
const url = fileUrl(WIRE);

// 디스크의 모든 .html (고아 0 검사 대상). _buildkit.md(.md)는 무시됨.
const ALL = [
  'index.html',
  'auth.html', 'onboarding.html', 'follow-seed.html',
  'map-home.html', 'feed.html', 'search.html', 'post-detail.html',
  'upload-1-gallery.html', 'upload-2-classify.html', 'upload-3-manual.html', 'upload-4-meta.html',
  'profile-me.html', 'profile-friend.html', 'notifications.html', 'settings.html',
];

// ── 1층: index에서 BFS 전 화면 도달 + 막다른 링크 0 + 고아 0 ──────────────────
defineReachabilityTest(test, expect, {
  dir: WIRE,
  entry: 'index.html',
  screens: ALL,
  label: '1층: 전 15화면 도달성 + 막다른 링크 0 + 고아 0',
});

// ── 2층: 화면별 죽은 컨트롤 0 (모든 컨트롤이 와이어드 or [범위 밖]) ───────────────
// ignore = 클릭-디프 프로브가 오탐하는 "기본 활성 세그먼트/라디오"(재로드 시 이미 선택돼 클릭해도 무변화).
//          비활성 옵션은 정상 검사된다 — 활성 옵션 1개만 면제. (team-leave 선례)
const DEAD = [
  ['index.html', '진입 인덱스', []],
  ['auth.html', 'SC-01·02 로그인/회원가입', []],
  ['onboarding.html', 'SC-03·04·05 온보딩', []],
  ['follow-seed.html', 'SC-06 팔로우 시드', ['추천 목록']],
  ['map-home.html', 'SC-07·08 지도 홈', []],
  ['feed.html', 'SC-09 피드', []],
  ['search.html', 'SC-15 검색', ['장소']],
  ['post-detail.html', 'SC-18 게시물 상세', []],
  ['upload-1-gallery.html', 'SC-10 업로드1 갤러리', []],
  ['upload-2-classify.html', 'SC-11 업로드2 자동분류', []],
  ['upload-3-manual.html', 'SC-12·13 업로드3 수동지정', ['블루보틀 성수']],
  ['upload-4-meta.html', 'SC-14 업로드4 메타', ['팔로워']],
  ['profile-me.html', 'SC-16 내 프로필', ['그리드']],
  ['profile-friend.html', 'SC-17 친구 프로필', ['그리드']],
  ['notifications.html', 'SC-19 알림', []],
  ['settings.html', 'SC-20 설정', ['followers']],
];
for (const [file, name, ignore] of DEAD) {
  defineDeadControlTest(test, expect, { url: url(file), name, ignore });
}

// ── 핵심 기능 assert (차별 코어 — 지도 홈) ──────────────────────────────────
test('기능: 지도 홈 핀 탭 → 장소 바텀시트 열림 (SC-08)', async ({ page }) => {
  await page.goto(url('map-home.html'));
  const sheet = page.getByRole('dialog', { name: '장소 상세' });
  await expect(sheet).toBeHidden();
  await page.getByRole('button', { name: /블루보틀 성수/ }).click();
  await expect(sheet).toBeVisible();
  await expect(page.getByRole('heading', { name: '블루보틀 성수' })).toBeVisible();
});

test('기능: 지도 홈 빈 상태 토글 → "첫 사진 올리기" CTA 노출 (SC-07 빈상태)', async ({ page }) => {
  await page.goto(url('map-home.html'));
  const cta = page.getByRole('link', { name: '첫 사진 올리기' });
  await expect(cta).toBeHidden();
  await page.getByRole('button', { name: /빈 지도 보기/ }).click();
  await expect(cta).toBeVisible();
});
