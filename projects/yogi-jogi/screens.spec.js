// 요기조기 — 하이파이 인터랙션 검증 (6단계: 2층 회귀 + axe a11y, 390×844 실뷰포트).
// 같은 lib·같은 셀렉터(role·aria·text)를 와이어(3단계)와 hi-fi 양쪽에 — 마크업이 바뀌어도 의미만 지키면 green.
const { test, expect } = require('@playwright/test');
const path = require('path');
const { defineReachabilityTest } = require('../../scripts/lib/crawl');
const { defineDeadControlTest } = require('../../scripts/lib/controls');
const { defineAxeTest } = require('../../scripts/lib/a11y');
const { fileUrl } = require('../../scripts/lib/selectors');

test.use({ viewport: { width: 390, height: 844 } });

const SCR = path.join(__dirname, 'screens');
const url = fileUrl(SCR);

const ALL = [
  'index.html',
  'auth.html', 'onboarding.html', 'follow-seed.html',
  'map-home.html', 'feed.html', 'search.html', 'post-detail.html',
  'upload-1-gallery.html', 'upload-2-classify.html', 'upload-4-meta.html',
  'profile-me.html', 'profile-friend.html', 'notifications.html', 'settings.html',
];

// ── 1층: 도달성 + 막다른 링크 0 + 고아 0 ─────────────────────────────────────
defineReachabilityTest(test, expect, {
  dir: SCR, entry: 'index.html', screens: ALL,
  label: '1층(hi-fi): 전 15화면 도달성 + 막다른 링크 0 + 고아 0',
});

// ── 2층: 화면별 죽은 컨트롤 0 (hi-fi 회귀) ───────────────────────────────────
// ignore = 기본 활성 세그먼트/라디오(클릭-디프 프로브가 무변화로 오탐). 비활성 옵션은 정상 검사.
const DEAD = [
  ['index.html', 'hi-fi 진입 인덱스', []],
  ['auth.html', 'SC-01·02 로그인/회원가입', []],
  ['onboarding.html', 'SC-03·04·05 온보딩', []],
  ['follow-seed.html', 'SC-06 팔로우 시드', ['추천 목록']],
  ['map-home.html', 'SC-07·08 지도 홈', []],
  ['feed.html', 'SC-09 피드', []],
  ['search.html', 'SC-15 검색', ['장소']],
  ['post-detail.html', 'SC-18 게시물 상세', []],
  ['upload-1-gallery.html', 'SC-10 업로드1 갤러리', []],
  ['upload-2-classify.html', 'SC-11·12·13 분류+미분류배정', []],
  ['upload-4-meta.html', 'SC-14 업로드 메타', ['팔로워']],
  ['profile-me.html', 'SC-16 내 프로필', ['그리드']],
  ['profile-friend.html', 'SC-17 친구 프로필', ['그리드']],
  ['notifications.html', 'SC-19 알림', []],
  ['settings.html', 'SC-20 설정', ['followers']],
];
for (const [file, name, ignore] of DEAD) {
  defineDeadControlTest(test, expect, { url: url(file), name: `hi-fi ${name}`, ignore });
}

// ── axe a11y (serious+ 0) — chosen final 렌더 ───────────────────────────────
for (const [file, name] of DEAD.map((d) => [d[0], d[1]])) {
  defineAxeTest(test, expect, { url: url(file), name: `hi-fi ${name}` });
}
