// 와이어 단계 배리어 — 전체 도달성 크롤 1회 (스텁 제거·묶음 간 링크 연결 후).
// index.html에서 BFS로 전 화면(12)이 도달되고 막다른 길이 0인지 한 번에 확인한다.
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const WIRE = path.resolve(__dirname, 'wireframe');

// 범위 안 전체 화면(= 00-flow §1, '내 코스 목록'은 home 안에 포함 → 파일 14개)
const ALL_SCREENS = [
  'index.html',      // C1 빈 상태(진입점)
  'picker.html',     // C2 사진 선택
  'assembling.html', // C3 자동 조립 로딩
  'review.html',     // C4 검토·보정 ★
  'finalize.html',   // C5 마무리
  'course.html',     // C6 코스 상세
  'home.html',       // S1 발자취 누적 지도
  'together.html',   // S2 다 같이
  'webview.html',    // S4 코스 웹뷰
  'profile.html',    // S3 내 프로필
  'user.html',       // S3b 다른 사람 프로필
  'search.html',     // S7 사람 찾기
  'login.html',      // S5 로그인
  'settings.html',   // S6 설정
];

test('전체 도달성 — index에서 BFS로 14화면 전부 도달 + 막다른 길 0 + 스텁 없음', () => {
  const visited = new Set();
  const queue = ['index.html'];
  const missing = [];
  const linkGraph = {};
  while (queue.length) {
    const cur = queue.shift();
    if (visited.has(cur)) continue;
    visited.add(cur);
    const full = path.join(WIRE, cur);
    if (!fs.existsSync(full)) { missing.push(cur); continue; }
    const html = fs.readFileSync(full, 'utf8');
    const targets = [];
    for (let h of [...html.matchAll(/href\s*=\s*"([^"]+)"/g)].map(m => m[1])) {
      if (/^(https?:|mailto:|#)/.test(h)) continue;
      h = h.split('#')[0].split('?')[0].trim();
      if (!h.endsWith('.html')) continue;
      targets.push(h);
      if (!visited.has(h)) queue.push(h);
    }
    linkGraph[cur] = [...new Set(targets)];
  }

  // 막다른 길 0
  expect(missing, '존재하지 않는 링크 타깃: ' + missing.join(', ')).toEqual([]);
  // 전 화면 도달
  for (const s of ALL_SCREENS) expect(visited.has(s), s + ' 미도달').toBeTruthy();
  // 묶음 경계 스텁이 남아있지 않음(전부 실제 화면으로 연결됨)
  expect(visited.has('stub-next.html'), '스텁이 아직 링크돼 있음').toBeFalsy();
  expect(fs.existsSync(path.join(WIRE, 'stub-next.html')), '스텁 파일이 남아있음').toBeFalsy();

  // 고아 파일 없음: wireframe의 모든 .html이 ALL_SCREENS에 등록·도달됨
  const onDisk = fs.readdirSync(WIRE).filter(f => f.endsWith('.html'));
  for (const f of onDisk) expect(ALL_SCREENS.includes(f), '미등록 화면 파일: ' + f).toBeTruthy();
});
