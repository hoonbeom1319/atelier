#!/usr/bin/env node
// 독립 검증 린트 — design §C step 5(하이파이 독립 검증)에 게이트를 건다.
//
//   node scripts/lint-verify.js <project>
//
// 배경: §C의 "독립 검증 에이전트"는 지금까지 *산문 약속*이었다(누가 봤는지·무엇을 봤는지
// 강제하는 게 없었다). 이 게이트는 그 약속을 *검증 가능한 산출물*로 못박는다 —
// 빌더도 메인도 아닌 별도 컨텍스트(Agent 도구)가 render-check를 돌리고 그 결과를
// `projects/<name>/design-verify.md`에 남겼는지, 그리고 그 종합 판정이 PASS인지 본다.
//
// 자동으로 본다(에이전트가 빠뜨리거나 honor-system으로 건너뛰기 쉬운 것):
//   ❌ design-verify.md 자체가 없음 (독립 검증이 안 돌았거나 산출물을 안 남김)
//   ❌ "검증자:" 미기재 — 누가(어느 컨텍스트가) 봤는지 불명 (셀프검증 방지 최소장치)
//   ❌ chosen/screens 화면 중 판정에서 빠진 게 있음 (일부만 보고 통과 위장)
//   ❌ render-check 7항목(thin/bad/variantsIdentical/off-brief/deadControl/stateInert/wireframey) 중 누락
//   ❌ 종합 "RESULT:" 미기재 / RESULT: FAIL (미달인데 다음 단계로 진행 금지)
//
// green 없이 5단계(하이파이) 완료·다음 단계로 진행 금지. errors 있으면 exit 1.
const fs = require('fs');
const path = require('path');

const project = process.argv[2];
if (!project || project.startsWith('-')) {
  console.error('사용법: node scripts/lint-verify.js <project>');
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

// ── 대상 폴더 결정: STATUS.md의 (chosen) 표시 → 없으면 screens/ (lint-handoff와 동일 규칙)
function chosenDir() {
  const status = read(path.join(PROJ, 'STATUS.md')) || '';
  const m = status.match(/([A-Za-z][\w-]*)\/?[^\n]*\(chosen/i);
  if (m && fs.existsSync(path.join(PROJ, m[1]))) return m[1];
  return 'screens';
}

// ── 검증 산출물 존재
const VF = path.join(PROJ, 'design-verify.md');
const doc = read(VF);
if (!doc) {
  errors.push('design-verify.md 없음 — 독립 검증 에이전트가 안 돌았거나 산출물을 안 남김. §C step 5를 실행하세요.');
  report();
}

// 1) 검증자 기재 (누가 봤나 — 셀프검증 방지 최소장치)
const vm = doc.match(/검증자\s*[:：]\s*(.+)/);
const verifier = vm ? vm[1].trim() : '';
if (!verifier || /^[-–—\s]*$/.test(verifier) || /<[^>]+>/.test(verifier)) {
  errors.push('"검증자:" 미기재 — design-verify.md 머리에 누가(어느 별도 컨텍스트가) 검증했는지 적으세요. (빌더·메인 셀프검증 금지)');
} else {
  ok.push(`검증자 기재됨: ${verifier}`);
}

// 2) render-check 7항목이 다뤄졌나 (wireframey = hi-fi인데 와이어 수준 — 렌더 기반 판정)
const DIMS = ['thin', 'bad', 'variantsIdentical', 'off-brief', 'deadControl', 'stateInert', 'wireframey'];
const missingDims = DIMS.filter((d) => !doc.includes(d));
if (missingDims.length) {
  errors.push(`render-check 항목 누락: ${missingDims.join(', ')} — 7항목(thin/bad/variantsIdentical/off-brief/deadControl/stateInert/wireframey)을 다 판정하세요.`);
} else {
  ok.push('render-check 7항목 전부 다룸');
}

// 3) chosen/screens 화면이 전부 판정됐나
const chosen = chosenDir();
const screens = htmls(path.join(PROJ, chosen));
if (!screens.length) {
  warns.push(`${chosen}/ 에 화면(.html)이 없음 — 검증 대상 확인 필요.`);
} else {
  const uncovered = screens.filter((s) => !doc.includes(s) && !doc.includes(s.replace('.html', '')));
  if (uncovered.length) errors.push(`검증에서 빠진 ${chosen} 화면: ${uncovered.join(', ')} — 모든 화면을 판정해야 합니다(일부만 보고 통과 금지).`);
  else ok.push(`${chosen} 화면 ${screens.length}개 전부 판정됨`);
}

// 4) 종합 RESULT
const rm = doc.match(/RESULT\s*[:：]\s*(PASS|FAIL)/i);
if (!rm) {
  errors.push('종합 "RESULT: PASS|FAIL" 미기재 — 문서 끝에 최종 판정을 적으세요.');
} else if (/fail/i.test(rm[1])) {
  errors.push('검증 결과 RESULT: FAIL — 지적된 화면을 빌더에게 되돌려 수정 후 재검증하세요. green 없이 진행 금지.');
} else {
  ok.push('종합 RESULT: PASS');
}

report();

// ── 리포트
function report() {
  const line = (s) => console.log(s);
  line(`\n 독립 검증 린트 — ${project}${doc ? ` (chosen: ${chosenDir()})` : ''}\n`);
  ok.forEach((m) => line(`  ✅ ${m}`));
  warns.forEach((m) => line(`  ⚠️  ${m}`));
  errors.forEach((m) => line(`  ❌ ${m}`));
  line('');
  if (errors.length) { line(` ❌ 실패 — 에러 ${errors.length}개. 하이파이 독립 검증 미통과.\n`); process.exit(1); }
  line(` ✅ 통과${warns.length ? ` (경고 ${warns.length}개 검토 권장)` : ''}.\n`);
  process.exit(0);
}
