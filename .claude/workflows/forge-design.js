export const meta = {
  name: 'forge-design',
  description: 'forge 디자인 핵심을 결정론적으로 오케스트레이션 — 하이파이 빌드 fan-out → 화면당 N명 적대적 검증(다수결) → 트렌드 점수 → 미달 시 리디자인 1회 → design-verify.md·design-critique.md 기록. honor-system 구멍(셀프검증·검증 누락)을 코드로 강제한다.',
  whenToUse: 'forge(무인)의 C-5 하이파이 ~ C-6 트렌드 구간. 토큰(C-4)·와이어(C-2)·Playwright/axe/lint 게이트는 메인이 인라인으로 처리하고, 생성+적대적 검증+점수+리디자인만 이 workflow가 코드로 돌린다.',
  phases: [
    { title: 'Build', detail: '화면당 screen-builder 1개 fan-out' },
    { title: 'Verify', detail: '화면당 design-verifier N명 적대적 검증(다수결)' },
    { title: 'Trend', detail: 'design-trend-expert가 brief 방향 안에서 0~100 감정' },
    { title: 'Redesign', detail: '점수 미달 시 발산 리디자인 1회 + 재검증·재감정' },
    { title: 'Record', detail: 'design-verify.md·design-critique.md 작성 + STATUS chosen 표시' },
  ],
}

// ── 입력 (forge가 args로 넘긴다) ────────────────────────────────────────────
// 런타임에 따라 args가 객체가 아니라 JSON 문자열로 도착할 수 있다(직렬화). 방어적으로 파싱한다.
const A = typeof args === 'string' ? (() => { try { return JSON.parse(args); } catch { return {}; } })() : (args || {});
const project = A && A.project;
if (!project) throw new Error('forge-design: args.project 가 필요합니다.');
const screens = (A && A.screens) || []; // [{ name:'home.html', spec:'…' }]
if (!screens.length) throw new Error('forge-design: args.screens(화면 목록)이 비었습니다.');
const V = (A && A.verifiers) || 3; // 화면당 회의론자 수
const threshold = (A && A.trendThreshold) || 80;
const p = (A && A.paths) || {};
const tokensCss = p.tokensCss || `projects/${project}/foundation/tokens.css`;
const flow = p.flow || `projects/${project}/00-flow.md`;
const prd = p.prd || `projects/${project}/PRD.md`;
const screensDir = p.screensDir || `projects/${project}/screens`;
const wireDir = p.wireDir || `projects/${project}/wireframe`;
const viewport = (A && A.viewport) || '(00-flow의 대상 뷰포트)';
const VARIANT = 'screens-bold';

// ── 스키마 ────────────────────────────────────────────────────────────────
const enumOkNg = { type: 'string', enum: ['ok', 'ng'] };
const DIMS = ['thin', 'bad', 'variantsIdentical', 'offBrief', 'deadControl', 'stateInert'];
const BUILD_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: { screen: { type: 'string' }, path: { type: 'string' }, summary: { type: 'string' } },
  required: ['screen', 'path'],
};
const VERDICT_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    screen: { type: 'string' },
    dims: {
      type: 'object', additionalProperties: false,
      properties: { thin: enumOkNg, bad: enumOkNg, variantsIdentical: enumOkNg, offBrief: enumOkNg, deadControl: enumOkNg, stateInert: enumOkNg },
      required: DIMS,
    },
    verdict: { type: 'string', enum: ['PASS', 'FAIL'] },
    notes: { type: 'string' },
  },
  required: ['screen', 'dims', 'verdict'],
};
const TREND_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    score: { type: 'number' },
    perScreen: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { screen: { type: 'string' }, score: { type: 'number' }, notes: { type: 'string' } }, required: ['screen', 'score'] } },
    critique: { type: 'string' },
    sources: { type: 'array', items: { type: 'string' } },
    recommendations: { type: 'string' },
  },
  required: ['score', 'critique'],
};

// ── 다수결 집계(plain JS — 에이전트 아님) ───────────────────────────────────
function aggregate(screen, votes) {
  const valid = votes.filter(Boolean);
  if (!valid.length) {
    const ng = {}; DIMS.forEach((d) => (ng[d] = 'ng'));
    return { screen, dims: ng, verdict: 'FAIL', votes: 0 };
  }
  const dims = {};
  for (const d of DIMS) {
    const ngCount = valid.filter((v) => v.dims && v.dims[d] === 'ng').length;
    dims[d] = ngCount * 2 > valid.length ? 'ng' : 'ok'; // 과반 ng → ng
  }
  // 차원별 과반 ng가 없어도, 검증자 과반이 verdict=FAIL이면 FAIL.
  // (회의론자들이 *서로 다른* 차원을 지적하면 어느 차원도 과반에 못 걸려 PASS로 새는 구멍을 막는다.)
  const failVotes = valid.filter((v) => v.verdict === 'FAIL').length;
  const verdict = (DIMS.some((d) => dims[d] === 'ng') || failVotes * 2 > valid.length) ? 'FAIL' : 'PASS';
  return { screen, dims, verdict, votes: valid.length, failVotes };
}

// ── 프롬프트 빌더 ───────────────────────────────────────────────────────────
const buildPrompt = (s, dir, mode, trend) => {
  if (mode === 'redesign') {
    return `프로젝트 ${project} 화면 ${s.name} 을 발산적으로 리디자인한다(트렌드 점수 미달 → 다른 아트디렉션).
- 만들 파일: projects/${project}/${dir}/${s.name}  (원본 ${screensDir}/ 를 덮지 말 것)
- 불변 계약(지킴): 화면 목록·흐름·기능 책임·상태 — ${flow}
- 발산 대상(깨도 됨): 구도·레이아웃·밀도·타이포 인격·색·모션 — "다른 시각"
- 트렌드 전문가 지적 반영: ${(trend && (trend.recommendations || trend.critique)) || ''}
- 토큰: ${tokensCss} (변형 필요하면 projects/${project}/foundation/tokens-${dir}.css, semantic 역할명 유지)
경로 + 한 줄 요약만 반환.`;
  }
  return `프로젝트 ${project} 의 하이파이 화면 1개를 만든다.
- 만들 파일: ${dir}/${s.name}
- 화면 스펙: ${s.spec || '(00-flow §화면별 구성요소·상태·책임 동작 참조)'}
- 공유 토큰: ${tokensCss} (semantic 토큰만 사용, import)
- 와이어 참고: ${wireDir}/${s.name} (링크 구조·href·상태 동작 그대로 유지)
- 대상 뷰포트: ${viewport}
- 계약: ${flow}
경로 + 한 줄 요약만 반환.`;
};
const verifyPrompt = (s, dir, build, k) =>
  `프로젝트 ${project}, 화면 projects/${project}/${dir}/${s.name} 을 적대적으로 검증한다(회의론자 ${k + 1}/${V}).
- 계약: ${flow} / 토큰: ${tokensCss}
- render-check 6항목(thin/bad/variantsIdentical/offBrief/deadControl/stateInert)을 각각 ok/ng로 판정. 한 항목이라도 ng면 verdict=FAIL.
- 파일은 쓰지 말고 structured verdict만 반환(workflow 모드).
의심스러우면 후하게 보지 말고 ng. 빌더 요약("${(build && build.summary) || ''}")을 곧이곧대로 믿지 말고 직접 파일을 읽어라.`;
const trendPrompt = (dir) =>
  `프로젝트 ${project} 의 하이파이를 brief가 택한 방향 안에서 현행 기준과 대조해 0~100으로 감정한다.
- 대상 폴더: projects/${project}/${dir}/  (화면: ${screens.map((s) => s.name).join(', ')})
- 방향 문서: ${flow}, ${prd} §8 / 토큰: ${tokensCss}
- WebSearch로 이 방향의 현행 UX·비주얼 기준을 근거화(출처 URL 남김). ⚠ off-brief 금지 — 방향 교체 권고 금지, "방향 안에서의 완성도"만.
structured: score, perScreen, critique, sources, recommendations 반환.`;

// 한 화면: 빌드 → N명 적대적 검증(다수결). pipeline 스테이지로 묶어 배리어 없이 흐른다.
const buildStage = (dir, mode, trend) => (s) =>
  agent(buildPrompt(s, dir, mode, trend), { agentType: 'screen-builder', schema: BUILD_SCHEMA, label: `${mode || 'build'}:${s.name}`, phase: mode === 'redesign' ? 'Redesign' : 'Build' });
const verifyStage = (dir) => (build, s) =>
  parallel(Array.from({ length: V }, (_, k) => () =>
    agent(verifyPrompt(s, dir, build, k), { agentType: 'design-verifier', schema: VERDICT_SCHEMA, label: `verify:${s.name}#${k + 1}`, phase: dir === VARIANT ? 'Redesign' : 'Verify' })
  )).then((votes) => ({ ...aggregate(s.name, votes), build }));

// ── 1) 원본: 빌드 + 적대적 검증 ──────────────────────────────────────────────
phase('Build');
log(`하이파이 ${screens.length}화면 빌드 → 화면당 ${V}명 적대적 검증(다수결).`);
const verified = (await pipeline(screens, buildStage(screensDir, 'build'), verifyStage('screens'))).filter(Boolean);
const origPass = verified.every((v) => v.verdict === 'PASS');
log(`원본 검증: ${verified.filter((v) => v.verdict === 'PASS').length}/${verified.length} PASS.`);

// ── 2) 트렌드 감정 (전 화면 필요 → 배리어) ───────────────────────────────────
phase('Trend');
const trend = await agent(trendPrompt('screens'), { agentType: 'design-trend-expert', schema: TREND_SCHEMA, label: 'trend:screens', phase: 'Trend' });
log(`트렌드 점수(원본): ${trend.score} / 임계값 ${threshold}.`);

// ── 3) 미달이면 리디자인 1회 + 재검증·재감정 ─────────────────────────────────
let chosen = 'screens';
let chosenVerified = verified;
let finalScore = trend.score;
let trend2 = null;
if (trend.score < threshold) {
  phase('Redesign');
  log(`임계값 미달 → 발산 리디자인 1회 (${VARIANT}).`);
  const reVerified = (await pipeline(screens, buildStage(VARIANT, 'redesign', trend), verifyStage(VARIANT))).filter(Boolean);
  trend2 = await agent(trendPrompt(VARIANT), { agentType: 'design-trend-expert', schema: TREND_SCHEMA, label: `trend:${VARIANT}`, phase: 'Redesign' });
  log(`트렌드 점수(${VARIANT}): ${trend2.score}.`);
  if (trend2.score > trend.score) { chosen = VARIANT; chosenVerified = reVerified; finalScore = trend2.score; }
  log(`chosen = ${chosen} (원본 ${trend.score} vs ${VARIANT} ${trend2.score}).`);
}

// ── 4) 기록: design-verify.md · design-critique.md · STATUS chosen (에이전트가 파일 작성) ──
phase('Record');
const recordPrompt = `forge-design 결과를 atelier 산출물로 기록한다. 아래 데이터로 파일 3개를 정확한 스키마로 쓰고, HTML은 수정하지 마라.

[1] projects/${project}/design-verify.md — chosen(${chosen})의 독립 검증 결과. scripts/lint-verify.js 가 검사하니 형식을 정확히:
  - 머리: "검증자: design-verifier (독립 서브에이전트, N=${V} 다수결) — 빌더·메인과 다른 컨텍스트"
  - "대상: ${chosen}/"
  - 화면별 표 헤더: | 화면 | thin | bad | variantsIdentical | off-brief | deadControl | stateInert | 판정 |
  - 각 화면 행을 아래 JSON의 dims(ok/ng)·verdict로 채운다.
  - 끝에 "RESULT: PASS|FAIL" (한 화면이라도 FAIL이면 FAIL).
  검증 JSON: ${JSON.stringify(chosenVerified.map((v) => ({ screen: v.screen, dims: v.dims, verdict: v.verdict, voters: v.votes })))}

[2] projects/${project}/design-critique.md — 트렌드 감정 기록. 원본 점수 ${trend.score}${trend2 ? `, ${VARIANT} 점수 ${trend2.score}` : ''}, chosen=${chosen}, 임계값 ${threshold}. 화면별 점수·지적·출처 URL·리디자인 여부·종합 점수.
  트렌드 JSON: ${JSON.stringify({ original: trend, variant: trend2 })}

[3] projects/${project}/STATUS.md — "후보 / chosen final" 항목에 chosen 폴더(${chosen})를 "(chosen)"으로 표시한다(lint-verify·lint-handoff 가 STATUS의 "(chosen)" 마커로 대상 폴더를 찾는다). 5단계(하이파이) 메모를 "독립 검증(N=${V} 다수결) + 트렌드 ${finalScore} 통과"로 갱신.

design-verify.md 스키마와 (chosen) 마커를 어기면 게이트가 깨진다 — 정확히 지켜라.`;
await agent(recordPrompt, { label: 'record', phase: 'Record' });

// ── 반환 (forge 메인이 받아 후속 게이트를 돌린다) ─────────────────────────────
return {
  project,
  chosen,
  screens: screens.map((s) => s.name),
  originalTrendScore: trend.score,
  finalTrendScore: finalScore,
  redesigned: !!trend2,
  originalVerifyPass: origPass,
  chosenVerifyResult: chosenVerified.every((v) => v.verdict === 'PASS') ? 'PASS' : 'FAIL',
  nextGates: [
    `node scripts/lint-verify.js ${project}`,
    `node scripts/test-project.js ${project} <axe/2층 회귀 spec>`,
    `node scripts/lint-handoff.js ${project} (handoff 후)`,
  ],
};
