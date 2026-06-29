#!/usr/bin/env node
// handoff 패키저 — handoff/ 를 *self-contained* 로 만든다(handoff/만 떼서 넘겨도 열리게).
//
//   node scripts/pack-handoff.js <project>
//
// 왜: 인계 패키지는 hand-off.md·index.html·token-mapping.md·component-inventory.md 4종만 handoff/ 안에 있고
//     나머지(PRD·00-flow·chosen 화면·tokens·스크린샷)는 ../ 로 프로젝트 루트를 가리켰다.
//     → handoff/만 넘기면 스크린샷도 화면도 토큰도 다 깨진다(포터블하지 않음).
//     이 스크립트가 필요한 소스를 handoff/ 안에 *같은 상대 레이아웃*으로 복사하고, 패키지 문서의 ../ 참조를 ./ 로 고친다.
//     (screens/components 의 ../foundation/tokens.css 는 handoff/<chosen>/ + handoff/foundation/ 으로 함께 복사되면 그대로 맞아떨어진다.)
//
// 멱등: 관리 대상(PRD.md·00-flow.md·foundation·components·_shots·<chosen>)을 매 실행마다 새로 복사한다.
//       생성 문서 4종(hand-off.md·index.html·token-mapping.md·component-inventory.md)은 건드리지 않는다(경로 재작성만).
const fs = require('fs');
const path = require('path');

const project = process.argv[2];
if (!project || project.startsWith('-')) {
  console.error('사용법: node scripts/pack-handoff.js <project>');
  process.exit(1);
}
const ROOT = path.resolve(__dirname, '..');
const PROJ = path.join(ROOT, 'projects', project);
const HO = path.join(PROJ, 'handoff');
if (!fs.existsSync(PROJ)) { console.error(`프로젝트 없음: ${PROJ}`); process.exit(1); }
if (!fs.existsSync(HO)) { fs.mkdirSync(HO, { recursive: true }); }

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const done = [];

// ── chosen final 결정: STATUS.md의 (chosen) 표시 → 없으면 screens/ (lint-handoff.js와 동일 규칙)
function chosenDir() {
  const status = read(path.join(PROJ, 'STATUS.md')) || '';
  const m = status.match(/([A-Za-z][\w-]*)\/?[^\n]*\(chosen/i);
  if (m && fs.existsSync(path.join(PROJ, m[1]))) return m[1];
  return 'screens';
}
const chosen = chosenDir();

// ── handoff/ 안에 같은 상대 레이아웃으로 복사할 소스 목록(존재하는 것만)
//    chosen 은 자기 이름 그대로 복사 → index.html 의 ../<chosen>/ 참조가 ./<chosen>/ 로만 바뀌면 맞는다.
const items = ['PRD.md', '00-flow.md', 'foundation', 'components', '_shots', chosen];

for (const it of items) {
  const src = path.join(PROJ, it);
  if (!fs.existsSync(src)) continue;
  const dst = path.join(HO, it);
  if (fs.existsSync(dst)) fs.rmSync(dst, { recursive: true, force: true });
  fs.cpSync(src, dst, { recursive: true });
  done.push(it + (fs.statSync(src).isDirectory() ? '/' : ''));
}

// ── 경로 재작성: 패키지 문서가 handoff/ 밖(../ · projects/<name>/)을 가리키지 않게
// index.html — href/src/url(...) 의 선행 ../ 들을 ./ 로 (handoff 루트 기준)
const idxPath = path.join(HO, 'index.html');
const idx = read(idxPath);
if (idx) {
  const fixed = idx
    .replace(/((?:href|src)\s*=\s*["'])(?:\.\.\/)+/gi, '$1./')
    .replace(/(url\(\s*["']?)(?:\.\.\/)+/gi, '$1./');
  if (fixed !== idx) { fs.writeFileSync(idxPath, fixed); done.push('index.html(경로 ../→./ )'); }
}

// hand-off.md — atelier-내부 경로(…projects/<name>/…)를 handoff/ 기준 ./ 상대경로로
const hoMdPath = path.join(HO, 'hand-off.md');
let md = read(hoMdPath);
if (md) {
  const before = md;
  const pre = '[^\\s`)\\]]*';                                  // 선행 prefix(<atelier>/ 등) 흡수, 단 공백·백틱·)·] 은 안 넘음
  md = md
    .replace(new RegExp(pre + 'projects/' + esc(project) + '/handoff/', 'g'), './')
    .replace(new RegExp(pre + 'projects/' + esc(project) + '/' + esc(chosen) + '/', 'g'), './' + chosen + '/')
    .replace(new RegExp(pre + 'projects/' + esc(project) + '/', 'g'), './');
  if (md !== before) { fs.writeFileSync(hoMdPath, md); done.push('hand-off.md(경로 →./ )'); }
}

console.log(`\n handoff 패키징 — ${project} (chosen: ${chosen})\n`);
if (done.length) done.forEach((d) => console.log(`  ✅ ${d}`));
else console.log('  ⚠️  복사·재작성할 게 없음(소스 미존재 또는 이미 self-contained).');
console.log(`\n → handoff/ 가 self-contained 되었는지 검증: node scripts/lint-handoff.js ${project}\n`);
