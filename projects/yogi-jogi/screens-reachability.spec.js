// 하이파이 전체 도달성 — screens/index.html에서 BFS로 14화면 전부 도달 + 막다른 길 0 + 고아 0.
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const SCREENS = path.resolve(__dirname, 'screens');

const ALL = [
  'index.html','picker.html','assembling.html','review.html','finalize.html','course.html', // 묶음1
  'home.html','together.html','webview.html',                                                 // 묶음2
  'profile.html','user.html','search.html','login.html','settings.html',                      // 묶음3
];

test('하이파이 전체 도달성 — index에서 14화면 도달 + 막다른 길 0 + 고아 0', () => {
  const visited = new Set();
  const queue = ['index.html'];
  const missing = [];
  while (queue.length) {
    const cur = queue.shift();
    if (visited.has(cur)) continue;
    visited.add(cur);
    const full = path.join(SCREENS, cur);
    if (!fs.existsSync(full)) { missing.push(cur); continue; }
    const html = fs.readFileSync(full, 'utf8');
    for (let h of [...html.matchAll(/href\s*=\s*"([^"]+)"/g)].map(m => m[1])) {
      if (/^(https?:|mailto:|#)/.test(h)) continue;
      h = h.split('#')[0].split('?')[0].trim();
      if (!h.endsWith('.html') || h.includes('/')) continue; // 같은 폴더 스크린만
      if (!visited.has(h)) queue.push(h);
    }
  }
  expect(missing, '막다른 링크: ' + missing.join(', ')).toEqual([]);
  for (const s of ALL) expect(visited.has(s), s + ' 미도달').toBeTruthy();
  // 고아 없음: screens의 모든 .html이 ALL에 등록·도달
  const onDisk = fs.readdirSync(SCREENS).filter(f => f.endsWith('.html'));
  for (const f of onDisk) expect(ALL.includes(f), '미등록 화면 파일: ' + f).toBeTruthy();
});
