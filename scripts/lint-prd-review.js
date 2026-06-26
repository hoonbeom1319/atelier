#!/usr/bin/env node
// PRD 독립 비평 린트 — plan §C(PRD 완료 직전)·forge §B에 게이트를 건다.
//
//   node scripts/lint-prd-review.js <project>
//
// 배경: lint-prd.js 는 PRD의 *형식*(11개 섹션 존재)만 본다. 실질(측정가능 지표·기능 정당화·
// 데이터-기능 정합·내부 일관성·가정 노출 등)은 별도 컨텍스트(prd-critic)가 적대적으로 감정해야
// 하는데, 그게 지금까진 산문 약속이었다. 이 게이트는 그 비평이 *실제로 돌았고 PASS인지* 를 못박는다.
//
// 자동으로 본다(작성자·메인이 셀프검증으로 건너뛰기 쉬운 것):
//   ❌ prd-review.md 자체가 없음 (독립 비평이 안 돌았거나 산출물을 안 남김)
//   ❌ "비평가:" 미기재 — 누가(어느 별도 컨텍스트가) 봤는지 불명 (셀프검증 방지 최소장치)
//   ❌ 7개 판정 차원(measurable/justified/prioritized/dataCoherent/consistent/assumptionsSurfaced/scoped) 중 누락
//   ❌ 종합 "RESULT:" 미기재 / RESULT: FAIL (미달인데 /design 으로 진행 금지)
//
// green 없이 "PRD 완료" 선언·design 진입 금지. errors 있으면 exit 1.
const fs = require('fs');
const path = require('path');

const project = process.argv[2];
if (!project || project.startsWith('-')) {
  console.error('사용법: node scripts/lint-prd-review.js <project>');
  process.exit(1);
}
const ROOT = path.resolve(__dirname, '..');
const PROJ = path.join(ROOT, 'projects', project);
if (!fs.existsSync(PROJ)) { console.error(`프로젝트 없음: ${PROJ}`); process.exit(1); }

const errors = [];
const warns = [];
const ok = [];
const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null);

const RV = path.join(PROJ, 'prd-review.md');
const doc = read(RV);
if (!doc) {
  errors.push('prd-review.md 없음 — 독립 PRD 비평가(prd-critic)가 안 돌았거나 산출물을 안 남김. plan §C / forge §B 를 실행하세요.');
  report();
}

// 1) 비평가 기재 (누가 봤나 — 셀프검증 방지 최소장치)
const vm = doc.match(/비평가\s*[:：]\s*(.+)/);
const critic = vm ? vm[1].trim() : '';
if (!critic || /^[-–—\s]*$/.test(critic) || /<[^>]+>/.test(critic)) {
  errors.push('"비평가:" 미기재 — prd-review.md 머리에 누가(어느 별도 컨텍스트가) 비평했는지 적으세요. (작성자·메인 셀프검증 금지)');
} else {
  ok.push(`비평가 기재됨: ${critic}`);
}

// 2) 7개 판정 차원이 다뤄졌나
const DIMS = ['measurable', 'justified', 'prioritized', 'dataCoherent', 'consistent', 'assumptionsSurfaced', 'scoped'];
const missingDims = DIMS.filter((d) => !doc.includes(d));
if (missingDims.length) {
  errors.push(`판정 차원 누락: ${missingDims.join(', ')} — 7차원(measurable/justified/prioritized/dataCoherent/consistent/assumptionsSurfaced/scoped)을 다 판정하세요.`);
} else {
  ok.push('판정 차원 7개 전부 다룸');
}

// 3) 종합 RESULT
const rm = doc.match(/RESULT\s*[:：]\s*(PASS|FAIL)/i);
if (!rm) {
  errors.push('종합 "RESULT: PASS|FAIL" 미기재 — 문서 끝에 최종 판정을 적으세요.');
} else if (/fail/i.test(rm[1])) {
  errors.push('비평 결과 RESULT: FAIL — 지적된 차원을 작성자에게 되돌려 PRD를 개정 후 재비평하세요. green 없이 /design 진행 금지.');
} else {
  ok.push('종합 RESULT: PASS');
}

report();

// ── 리포트
function report() {
  const line = (s) => console.log(s);
  line(`\n PRD 독립 비평 린트 — ${project}\n`);
  ok.forEach((m) => line(`  ✅ ${m}`));
  warns.forEach((m) => line(`  ⚠️  ${m}`));
  errors.forEach((m) => line(`  ❌ ${m}`));
  line('');
  if (errors.length) { line(` ❌ 실패 — 에러 ${errors.length}개. PRD 독립 비평 미통과.\n`); process.exit(1); }
  line(` ✅ 통과${warns.length ? ` (경고 ${warns.length}개 검토 권장)` : ''}.\n`);
  process.exit(0);
}
