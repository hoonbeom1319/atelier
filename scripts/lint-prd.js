#!/usr/bin/env node
// PRD 완결성 린트 — plan→design 경계에도 게이트를 건다(design→dev만 lint-handoff로 막던 비대칭 해소).
//
//   node scripts/lint-prd.js <project>
//
// /plan SKILL §C의 PRD 11개 섹션을 기준으로 본다. 매칭은 정확한 제목이 아니라
// **헤더 라인(마크다운 #·**bold**·번호목록)에서 alias 키워드**로 — 제목 표기가 달라도 잡되,
// '비기능'이 '기능'(§4)으로 오인되는 충돌은 exclude로 막는다(늑대소년 방지).
//
// ERROR(= /design 진입 차단): 11개 섹션 중 부재.
// WARN(검토 권장):           내용 깊이 — §5 관계표기·물리스키마 범위밖 / §4 MVP 마커 / §8 다크모드·뷰포트 / §11 빈 가정 / 전체 thin.
//
// errors 있으면 exit 1.
const fs = require('fs');
const path = require('path');

const project = process.argv[2];
if (!project || project.startsWith('-')) {
  console.error('사용법: node scripts/lint-prd.js <project>');
  process.exit(1);
}
const ROOT = path.resolve(__dirname, '..');
const PRD_PATH = path.join(ROOT, 'projects', project, 'PRD.md');
if (!fs.existsSync(PRD_PATH)) { console.error(`PRD 없음: ${PRD_PATH}`); process.exit(1); }

const md = fs.readFileSync(PRD_PATH, 'utf8');
const lines = md.split(/\r?\n/);

const errors = [];
const warns = [];
const ok = [];

// ── 헤더 라인 식별: 마크다운 헤딩 / 한 줄 통째 **bold** / 번호목록(1. · 1)) ───────────────
function isHeader(ln) {
  return /^\s{0,3}#{1,6}\s+\S/.test(ln) ||            // ## 데이터 모델
    /^\s{0,3}\*\*[^*]+\*\*\s*:?\s*$/.test(ln) ||       // **데이터 모델**
    /^\s{0,3}\d+[.)]\s+\S/.test(ln);                   // 5. 데이터 모델
}
const headerIdx = [];
lines.forEach((ln, i) => { if (isHeader(ln)) headerIdx.push(i); });

// 헤더 i 다음 섹션 본문(다음 헤더 전까지).
function bodyAfter(i) {
  const next = headerIdx.find((h) => h > i);
  return lines.slice(i + 1, next == null ? lines.length : next).join('\n').trim();
}

// 11개 섹션 — alias(헤더에서 찾을 키워드) + exclude(오인 차단).
const SECTIONS = [
  { n: 1, name: '배경과 문제 정의', alias: /배경|문제\s*정의|problem|background/i },
  { n: 2, name: '목표 및 성공 지표', alias: /목표|성공\s*지표|지표|goal|success|metric|kpi/i },
  { n: 3, name: '타깃 사용자·시나리오', alias: /타깃|대상\s*사용자|페르소나|persona|target|사용\s*시나리오|사용자.*시나리오/i },
  { n: 4, name: '기능 요구사항', alias: /기능\s*요구|핵심\s*기능|기능\s*정의|기능\s*목록|feature|functional/i, exclude: /비기능|non[\s-]?functional/i },
  { n: 5, name: '데이터 모델', alias: /데이터\s*모델|엔터티|엔티티|data\s*model|entity|erd/i },
  { n: 6, name: '사용자 흐름', alias: /사용자\s*흐름|유저\s*플로우|user\s*flow|플로우|흐름/i },
  { n: 7, name: '화면 목록·요구사항', alias: /화면\s*목록|화면별|화면\s*요구|스크린|screen|와이어|화면/i },
  { n: 8, name: '디자인 방향', alias: /디자인\s*방향|디자인\s*가이드|비주얼\s*방향|톤\s*앤|톤앤|design\s*direction|디자인/i },
  { n: 9, name: '비기능 요구사항', alias: /비기능|non[\s-]?functional|성능|보안|접근성|nfr/i },
  { n: 10, name: '범위 외 (Out of Scope)', alias: /범위\s*외|out\s*of\s*scope|제외\s*범위|scope\s*out/i },
  { n: 11, name: '미해결 이슈와 가정', alias: /미해결|가정|열린\s*질문|open\s*question|assumption|unresolved|미정/i },
];

// ── 1) 11개 섹션 존재(ERROR) + §11 본문 위치 확보 ───────────────────────────────────
const matched = {}; // n → header line index
for (const s of SECTIONS) {
  const hit = headerIdx.find((i) => s.alias.test(lines[i]) && !(s.exclude && s.exclude.test(lines[i])));
  if (hit != null) { matched[s.n] = hit; ok.push(`§${s.n} ${s.name} 있음`); }
  else errors.push(`§${s.n} ${s.name} 섹션 부재 — /design이 받을 입력이 빈다(제목에 "${s.name}" 같은 키워드 필요).`);
}

// ── 2) 내용 깊이(WARN) ─────────────────────────────────────────────────────────────
// §5 데이터 모델: 관계 표기 + 물리 스키마 범위 밖 명시
if (matched[5] != null) {
  const hasRel = /1\s*:\s*1|1\s*:\s*N|N\s*:\s*M|1\s*:\s*n|n\s*:\s*m|일대다|다대다|일대일|1대1|1대다|관계/i.test(md);
  if (!hasRel) warns.push('§5 데이터 모델에 관계 표기(1:1·1:N·N:M 또는 "관계" 설명)가 안 보임 — 엔터티 간 관계를 명시하세요.');
  if (!/물리\s*스키마|physical\s*schema/i.test(md)) warns.push('§5에 "물리 스키마 확정은 범위 밖" 명시가 안 보임 — /plan 규칙상 개발 단계 결정임을 못박으세요.');
}
// §4 기능 요구사항: MVP 우선순위 마커
if (matched[4] != null && !/MVP|다음|나중|p0|p1|우선순위/i.test(md)) {
  warns.push('§4 기능 요구사항에 우선순위 마커(MVP/다음/나중)가 안 보임 — 무엇이 MVP인지 분명히 하세요.');
}
// §8 디자인 방향: 다크모드 + 뷰포트(→ /design 인테이크 입력)
if (matched[8] != null) {
  if (!/다크\s*모드|dark\s*mode|라이트\s*\/?\s*다크/i.test(md)) warns.push('§8에 다크모드 여부가 안 보임 — /design 토큰 설계에 필요합니다.');
  if (!/모바일|데스크톱|desktop|mobile|뷰포트|반응형|390|태블릿/i.test(md)) warns.push('§8에 대상 뷰포트(모바일/데스크톱 등)가 안 보임 — /design이 화면 크기를 정할 근거입니다.');
}
// §11 미해결 이슈와 가정: 빈 헤더 아님
if (matched[11] != null) {
  const body = bodyAfter(matched[11]);
  if (body.replace(/[\s\-*>#]/g, '').length < 10) {
    warns.push('§11 미해결 이슈와 가정이 비어 있음 — 검증 안 된 가정이 본문에 사실처럼 숨어 있지 않은지 확인(빈 가정 섹션은 대개 과신).');
  }
}
// 전체 thin
if (md.replace(/\s/g, '').length < 600) warns.push(`PRD 본문이 얇음(공백 제외 ${md.replace(/\s/g, '').length}자) — 개발 착수에 충분한 구체성인지 점검.`);

// ── 리포트 (lint-handoff와 동일 UX) ───────────────────────────────────────────────
const line = (s) => console.log(s);
line(`\n PRD 린트 — ${project}\n`);
ok.forEach((m) => line(`  ✅ ${m}`));
warns.forEach((m) => line(`  ⚠️  ${m}`));
errors.forEach((m) => line(`  ❌ ${m}`));
line('');
if (errors.length) { line(` ❌ 실패 — 섹션 부재 ${errors.length}개. /design 진입 전 PRD를 보완하세요.\n`); process.exit(1); }
line(` ✅ 통과 — 11개 섹션 완비${warns.length ? ` (경고 ${warns.length}개 검토 권장)` : ''}.\n`);
