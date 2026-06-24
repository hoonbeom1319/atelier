// 재사용 골격 ① — 1층 자동 검증: 도달성 + 막다른 링크 + 고아 파일.
//
// 매 프로젝트 spec이 BFS를 새로 짜지 않게 한다. file:// 상대 <a href>를 따라
// index.html에서 너비우선으로 훑어, ⓐ 링크 타깃이 실제 존재(막다른 길 0)
// ⓑ 범위 안 화면이 전부 방문됨(도달성) ⓒ 등록 안 된 고아 .html 없음 ⓓ 스텁 잔존 없음을 본다.
//
// 순수 Node(fs/path)만 쓴다 — page 불필요. 어느 디렉터리(wireframe/ · screens/ · screens-<variant>/)에도 그대로.
//
//   const { crawl, checkReachability, defineReachabilityTest } = require('../../scripts/lib/crawl');
const path = require('path');
const fs = require('fs');

// 한 디렉터리를 entry에서 BFS로 훑어 링크 그래프와 방문/누락을 돌려준다.
// 외부·앵커·쿼리·비-html 링크는 무시. 같은 폴더 상대 .html만 따라간다.
function crawl({ dir, entry = 'index.html' }) {
  const visited = new Set();
  const missing = [];
  const linkGraph = {};
  const queue = [entry];
  while (queue.length) {
    const cur = queue.shift();
    if (visited.has(cur)) continue;
    visited.add(cur);
    const full = path.join(dir, cur);
    if (!fs.existsSync(full)) { missing.push(cur); continue; }
    const html = fs.readFileSync(full, 'utf8');
    const targets = [];
    for (let h of [...html.matchAll(/href\s*=\s*"([^"]+)"/g)].map((m) => m[1])) {
      if (/^(https?:|mailto:|tel:|#)/.test(h)) continue;
      h = h.split('#')[0].split('?')[0].trim();
      if (!h.endsWith('.html')) continue;
      targets.push(h);
      if (!visited.has(h)) queue.push(h);
    }
    linkGraph[cur] = [...new Set(targets)];
  }
  return { visited, missing, linkGraph };
}

// 도달성 종합 판정. screens = 범위 안 필수 화면(파일명 배열). stubs = 사라졌어야 할 묶음 경계 스텁.
// orphanCheck = 디스크의 모든 .html이 screens에 등록·도달됐는지(고아 0)도 본다.
function checkReachability({ dir, entry = 'index.html', screens = [], stubs = [], orphanCheck = true }) {
  const { visited, missing, linkGraph } = crawl({ dir, entry });
  const unreached = screens.filter((s) => !visited.has(s));
  const leftoverStubs = stubs.filter(
    (s) => visited.has(s) || fs.existsSync(path.join(dir, s)),
  );
  let orphans = [];
  if (orphanCheck && screens.length) {
    const onDisk = fs.readdirSync(dir).filter((f) => f.endsWith('.html'));
    orphans = onDisk.filter((f) => !screens.includes(f));
  }
  const ok = !missing.length && !unreached.length && !leftoverStubs.length && !orphans.length;
  return { ok, visited, missing, unreached, leftoverStubs, orphans, linkGraph };
}

// 보일러플레이트 없이 바로 테스트를 건다. spec에서 한 줄로:
//   defineReachabilityTest(test, expect, { dir: WIRE, screens: ALL_SCREENS, stubs: ['stub-next.html'] });
function defineReachabilityTest(test, expect, opts) {
  const label = opts.label || `1층: ${opts.entry || 'index.html'}에서 BFS 도달성 + 막다른 길 0 + 고아 0`;
  test(label, () => {
    const r = checkReachability(opts);
    expect(r.missing, '존재하지 않는 링크 타깃(막다른 길): ' + r.missing.join(', ')).toEqual([]);
    expect(r.unreached, '범위 안인데 미도달: ' + r.unreached.join(', ')).toEqual([]);
    expect(r.leftoverStubs, '아직 링크된 스텁: ' + r.leftoverStubs.join(', ')).toEqual([]);
    expect(r.orphans, '등록 안 된 고아 화면 파일: ' + r.orphans.join(', ')).toEqual([]);
  });
}

module.exports = { crawl, checkReachability, defineReachabilityTest };
