// team-leave — 인터랙션 검증 자동(6단계). chosen final = screens/.
// 2층 죽은 컨트롤 회귀(폴리시 과정에서 동작이 깨지지 않았나) + 렌더 a11y(axe serious+ 0).
// 1층 도달성은 동일 링크 구조의 와이어(3단계)에서 검증됨(hi-fi는 같은 파일명·href 유지).
const path = require('path');
const { test, expect } = require('@playwright/test');
const { defineDeadControlTest } = require('../../scripts/lib/controls');
const { defineAxeTest } = require('../../scripts/lib/a11y');
const { fileUrl } = require('../../scripts/lib/selectors');

const url = fileUrl(path.join(__dirname, 'screens'));
const SCREENS = [
  'login.html', 'home.html', 'request.html', 'approvals.html', 'calendar.html',
  'balance.html', 'requests.html', 'notifications.html', 'members.html', 'settings.html',
];

// ignore = "현재 상태를 이미 반영해 클릭이 no-op인 컨트롤"(활성 탭/필터·기본 선택 행·기본 라디오) +
// "커스텀 라디오(숨긴 input — 프로브가 토글 못 함)". 이들은 산출물 버그가 아니라 클릭-디프 프로브의 한계로,
// design-verifier(렌더 PNG 기반 stateInert/deadControl)가 별도로 정상 확인함. nav aria-current·닫힌 드로어는 lib이 자동 면제.
const DEAD_IGNORE = {
  'login.html': ['직원'],                                              // 활성 역할 세그먼트(aria-pressed=true, 클릭 시 무변화)
  'request.html': ['annual', 'half', 'sick', 'event', '오전', '오후'], // 커스텀 라디오(숨긴 input — 라벨이 클릭 처리)
  'approvals.html': ['전체', '대기'],                                  // 활성 종류 필터 칩 + 활성 탭(대기)
  'calendar.html': ['오늘'],                                           // 오늘 버튼(현재 월이면 no-op)
  'balance.html': ['전체'],                                            // 활성 종류 탭
  'requests.html': ['상세 보기', '전체'],                             // 기본 선택 행(r1) 상세 no-op + 활성 필터 탭(전체)
  'notifications.html': ['전체', '알림'],                              // 활성 필터 탭 + 현재 페이지 알림 자기참조
};

test.use({ viewport: { width: 1280, height: 900 } });

for (const s of SCREENS) {
  defineDeadControlTest(test, expect, { url: url(s), name: `screens/${s}`, ignore: DEAD_IGNORE[s] || [] });
}

for (const s of SCREENS) {
  defineAxeTest(test, expect, { url: url(s), name: `screens/${s}` });
}
