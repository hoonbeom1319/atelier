#!/usr/bin/env node
// handoff 완결성 린트 — 7단계 끝단에도 게이트를 건다(3·6단계만 green 게이트인 비대칭 해소).
//
//   node scripts/lint-handoff.js <project>
//
// 자동으로 본다(사람·에이전트가 빠뜨리기 쉬운 것):
//   ❌ 필수 패키지 파일 누락(hand-off.md · index.html · token-mapping.md · component-inventory.md)
//   ❌ hand-off.md에 안 채운 placeholder(<대상>·<atelier>·<chosen> …)가 남음
//   ❌ chosen final 화면이 비주얼 문서(index.html)에 안 실림(스크린샷/임베드 누락)
//   ❌ semantic 토큰이 매핑표에 빠짐 (primitive는 값이라 매핑 불필요 → 제외)
//   ❌ components/*.html이 컴포넌트 인벤토리에 빠짐
//   ⚠️ 컴포넌트가 "쓰이는 화면"에 매핑 안 됨 / PRD 있는데 hand-off.md가 참조 안 함
//
// green 없이 "handoff 완료" 선언 금지. errors 있으면 exit 1.
const fs = require('fs');
const path = require('path');

const project = process.argv[2];
if (!project || project.startsWith('-')) {
  console.error('사용법: node scripts/lint-handoff.js <project>');
  process.exit(1);
}
const ROOT = path.resolve(__dirname, '..');
const PROJ = path.join(ROOT, 'projects', project);
if (!fs.existsSync(PROJ)) { console.error(`프로젝트 없음: ${PROJ}`); process.exit(1); }

const errors = [];
const warns = [];
const ok = [];
const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null);
const htmls = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.html') && f !== 'index.html') : []);

// ── chosen final 결정: STATUS.md의 (chosen) 표시 → 없으면 screens/ (변형 폴더가 여럿이면 모호 경고)
function chosenDir() {
  const status = read(path.join(PROJ, 'STATUS.md')) || '';
  // 캡처는 글자로 시작해야 한다 — 안 그러면 "- screens-refined/ …(chosen)"의 줄머리 불릿 '-'가
  // [\w-]에 걸려 m[1]='-'로 잡히고 chosen 감지가 표준 STATUS 형식에서 항상 폴백된다.
  const m = status.match(/([A-Za-z][\w-]*)\/?[^\n]*\(chosen/i);
  if (m && fs.existsSync(path.join(PROJ, m[1]))) return m[1];
  const variants = fs.existsSync(PROJ) ? fs.readdirSync(PROJ).filter((d) => /^screens-/.test(d) && fs.statSync(path.join(PROJ, d)).isDirectory()) : [];
  if (variants.length) warns.push(`chosen final 미표시 — 변형 폴더 ${variants.length}개(${variants.join(', ')}) 중 무엇이 chosen인지 STATUS.md에 "(chosen)"으로 표시하세요. 일단 screens/로 검사.`);
  return 'screens';
}

const HO = path.join(PROJ, 'handoff');
if (!fs.existsSync(HO)) errors.push('handoff/ 폴더 자체가 없음 — 7단계 패키지 미작성.');

// 1) 필수 파일
for (const f of ['hand-off.md', 'index.html', 'token-mapping.md', 'component-inventory.md']) {
  if (read(path.join(HO, f))) ok.push(`handoff/${f} 존재`);
  else errors.push(`handoff/${f} 누락`);
}

// 2) hand-off.md placeholder 잔존
const handoffMd = read(path.join(HO, 'hand-off.md'));
if (handoffMd) {
  // 알려진 placeholder(<대상…>·<atelier>·<chosen>·<name>) + 한글이 든 <…>만 잡는다.
  // 과거의 catch-all([A-Za-z가-힣]{2,20})은 <div>·<button>·<a href> 같은 정상 HTML 태그까지 오탐해 게이트를 못 믿게 만들었다.
  // (atelier/chosen/name은 뒤에 '>'가 즉시 와야 매치 → <filename>·<atelier-root> 등은 안 걸린다.)
  const leftover = [...handoffMd.matchAll(/<(대상[^>]*|atelier|chosen|name|[^>]*[가-힣][^>]*)>/g)].map((m) => m[0]);
  const uniq = [...new Set(leftover)];
  if (uniq.length) errors.push(`hand-off.md에 안 채운 placeholder 잔존: ${uniq.join(', ')} — 실제 경로/이름으로 채우세요.`);
  else ok.push('hand-off.md placeholder 모두 채워짐');
  // PRD 참조
  const prd = read(path.join(PROJ, 'PRD.md'));
  if (prd && !/PRD\.md/i.test(handoffMd)) warns.push('PRD.md가 있는데 hand-off.md가 참조하지 않음 — "먼저 읽을 것"에 PRD 경로 추가 권장.');
}

// 3) chosen final 화면이 비주얼 문서에 실렸나
const chosen = chosenDir();
const indexHtml = read(path.join(HO, 'index.html')) || '';
const screens = htmls(path.join(PROJ, chosen));
if (!screens.length) warns.push(`${chosen}/ 에 화면(.html)이 없음 — chosen final 확인 필요.`);
const notEmbedded = screens.filter((s) => !indexHtml.includes(s) && !indexHtml.includes(s.replace('.html', '')));
if (notEmbedded.length) errors.push(`비주얼 문서(index.html)에 안 실린 chosen 화면: ${notEmbedded.join(', ')} (스크린샷/임베드 누락)`);
else if (screens.length) ok.push(`chosen(${chosen}) 화면 ${screens.length}개 전부 비주얼 문서에 실림`);

// 4) semantic 토큰이 매핑표에 빠졌나
// 판정은 화이트리스트가 아니라 블랙리스트로 한다(게이트엔 블랙리스트가 안전):
//   primitive(= --word-숫자, 다단어 허용: --coral-500·--gray-50·--blue-gray-900·--sp-2)는 *값*이라 매핑 불필요 → 제외.
//   그 외 foundation 토큰은 전부 매핑 대상. (접두사 화이트리스트는 --elevation-low·--gap-card 같은
//   비표준 이름의 semantic 토큰을 조용히 빠뜨려 게이트를 못 믿게 했다 — 그래서 뒤집었다.)
const tokensCss = read(path.join(PROJ, 'foundation', 'tokens.css'));
const tokensMap = read(path.join(HO, 'token-mapping.md')) || '';
if (tokensCss) {
  const all = [...new Set([...tokensCss.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]))];
  const isPrimitive = (t) => /^--[a-z]+(-[a-z]+)*-\d+$/.test(t);             // --coral-500, --gray-50, --blue-gray-900, --sp-2 …
  const semantic = all.filter((t) => !isPrimitive(t));
  const missing = semantic.filter((t) => !tokensMap.includes(t));
  if (missing.length) errors.push(`매핑표(token-mapping.md)에 빠진 semantic 토큰 ${missing.length}개: ${missing.slice(0, 12).join(', ')}${missing.length > 12 ? ' …' : ''}`);
  else if (semantic.length) ok.push(`semantic 토큰 ${semantic.length}개 전부 매핑표에 있음`);
} else warns.push('foundation/tokens.css 없음 — 토큰 매핑 검사 건너뜀.');

// 5) 컴포넌트가 인벤토리에 + 화면에 매핑됐나
const comps = htmls(path.join(PROJ, 'components'));
const compsMd = read(path.join(HO, 'component-inventory.md')) || '';
if (comps.length) {
  const missing = comps.filter((c) => { const n = c.replace('.html', ''); return !compsMd.includes(c) && !compsMd.includes(n); });
  if (missing.length) errors.push(`컴포넌트 인벤토리(component-inventory.md)에 빠진 컴포넌트: ${missing.join(', ')}`);
  else ok.push(`컴포넌트 ${comps.length}개 전부 인벤토리에 있음`);
  if (compsMd && !screens.some((s) => compsMd.includes(s) || compsMd.includes(s.replace('.html', '')))) {
    warns.push('component-inventory.md가 "쓰이는 화면"을 하나도 참조하지 않음 — 컴포넌트→화면 매핑 추가 권장.');
  }
}

// ── 리포트
const line = (s) => console.log(s);
line(`\n handoff 린트 — ${project} (chosen: ${chosen})\n`);
ok.forEach((m) => line(`  ✅ ${m}`));
warns.forEach((m) => line(`  ⚠️  ${m}`));
errors.forEach((m) => line(`  ❌ ${m}`));
line('');
if (errors.length) { line(` ❌ 실패 — 에러 ${errors.length}개. handoff 완료 선언 금지.\n`); process.exit(1); }
line(` ✅ 통과${warns.length ? ` (경고 ${warns.length}개 검토 권장)` : ''}.\n`);
