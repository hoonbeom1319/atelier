export const meta = {
  name: 'forge-design',
  description: 'forge 디자인 핵심을 결정론적으로 오케스트레이션 — (빌드 전)비주얼 레퍼런스 브리프 → 하이파이 빌드 fan-out → 렌더 스크린샷(픽셀) → 화면당 N명 적대적 검증(렌더 기반·다수결) → 트렌드 점수(렌더 기반) → 미달 시 리디자인 1회 → design-verify.md·design-critique.md 기록. honor-system·픽셀맹 구멍을 코드로 강제한다.',
  whenToUse: 'forge(무인)의 C-5 하이파이 ~ C-6 트렌드 구간. 토큰(C-4)·와이어(C-2)·Playwright/axe/lint 게이트는 메인이 인라인으로 처리하고, 비주얼 브리프+생성+렌더+적대적 검증+점수+리디자인만 이 workflow가 코드로 돌린다.',
  phases: [
    { title: 'Reference', detail: '빌드 전 비주얼 레퍼런스 조사(현행 기준 근거화 → 빌더 입력)' },
    { title: 'Build', detail: '화면당 screen-builder 1개 fan-out(브리프·anti-wireframe 바)' },
    { title: 'Shoot', detail: 'screen-shooter가 헤드리스 렌더 → PNG(검증·트렌드가 픽셀을 봄)' },
    { title: 'Verify', detail: '화면당 design-verifier N명 적대적 검증(렌더 기반·다수결)' },
    { title: 'Trend', detail: 'design-trend-expert가 brief 방향 안에서 0~100 감정(렌더 기반)' },
    { title: 'Redesign', detail: '점수 미달 시 발산 리디자인 1회 + 재렌더·재검증·재감정' },
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
const wireDir = p.wireDir || `projects/${project}/wireframe`;
const viewport = (A && A.viewport) || '(00-flow의 대상 뷰포트)';
const ORIG = 'screens';
const VARIANT = 'screens-bold';
const dirPath = (rel) => `projects/${project}/${rel}`;

// ── 스키마 ────────────────────────────────────────────────────────────────
const enumOkNg = { type: 'string', enum: ['ok', 'ng'] };
// render-check 7항목 — wireframey = "hi-fi인데 와이어 수준(thin/bad가 못 잡는 밋밋함)". 렌더(픽셀)로 본다.
const DIMS = ['thin', 'bad', 'variantsIdentical', 'offBrief', 'deadControl', 'stateInert', 'wireframey'];
const BRIEF_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    brief: { type: 'string' },
    patterns: { type: 'array', items: { type: 'string' } },
    references: { type: 'array', items: { type: 'string' } },
    antiPatterns: { type: 'array', items: { type: 'string' } },
    sources: { type: 'array', items: { type: 'string' } },
  },
  required: ['brief'],
};
const BUILD_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: { screen: { type: 'string' }, path: { type: 'string' }, summary: { type: 'string' } },
  required: ['screen', 'path'],
};
const SHOOT_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: { shots: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { screen: { type: 'string' }, png: { type: 'string' } }, required: ['screen', 'png'] } } },
  required: ['shots'],
};
const VERDICT_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    screen: { type: 'string' },
    dims: {
      type: 'object', additionalProperties: false,
      properties: { thin: enumOkNg, bad: enumOkNg, variantsIdentical: enumOkNg, offBrief: enumOkNg, deadControl: enumOkNg, stateInert: enumOkNg, wireframey: enumOkNg },
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

// ── 프롬프트 ───────────────────────────────────────────────────────────────
const referencePrompt = () =>
  `프로젝트 ${project} 의 하이파이를 *짓기 전에*, brief가 택한 방향의 현행 비주얼·UX 기준을 WebSearch/WebFetch로 근거화해 **빌더에게 줄 비주얼 브리프**를 만든다(이건 점수가 아니라 빌드 입력이다).
- 방향 문서: ${flow}, ${prd} §8 / 토큰: ${tokensCss}
- 조사: 이 방향(예: "미니멀 협업툴 대시보드 UI 2025/2026 best practice")의 *구체적* 비주얼 패턴 — 위계·여백 밀도·타이포 스케일·elevation/깊이·색 운용·상태/마이크로 인터랙션 표현. 출처 URL 남김.
- ⚠ off-brief 금지: brief의 의도(예: 의도적 미니멀)를 트렌드 추종으로 배신하지 마라. **방향 안에서 어떻게 하면 와이어가 아니라 진짜 hi-fi가 되나**를 모은다.
structured: brief(요약 지시), patterns(구체 패턴 목록), references(닮을 만한 실제 제품·사례), antiPatterns(피할 것 — 특히 "와이어에 색칠"류), sources 반환.`;

const briefDigest = (b) => {
  if (!b) return '';
  const parts = [];
  if (b.brief) parts.push(`방향: ${b.brief}`);
  if (b.patterns && b.patterns.length) parts.push(`적용 패턴: ${b.patterns.join(' / ')}`);
  if (b.references && b.references.length) parts.push(`레퍼런스: ${b.references.join(', ')}`);
  if (b.antiPatterns && b.antiPatterns.length) parts.push(`피할 것: ${b.antiPatterns.join(' / ')}`);
  return parts.join('\n');
};

const buildPrompt = (s, rel, mode, trend, brief) => {
  if (mode === 'redesign') {
    return `프로젝트 ${project} 화면 ${s.name} 을 발산적으로 리디자인한다(트렌드 점수 미달 → 다른 아트디렉션).
- 만들 파일: ${dirPath(rel)}/${s.name}  (원본 ${dirPath(ORIG)}/ 를 덮지 말 것)
- 불변 계약(지킴): 화면 목록·흐름·기능 책임·상태 — ${flow}
- 발산 대상(깨도 됨): 구도·레이아웃·밀도·타이포 인격·색·모션 — "다른 시각"
- 트렌드 전문가 지적 반영: ${(trend && (trend.recommendations || trend.critique)) || ''}
- 비주얼 브리프(현행 기준):\n${briefDigest(brief)}
- 토큰: ${tokensCss} (변형 필요하면 ${dirPath('foundation')}/tokens-${rel}.css, semantic 역할명 유지)
- ★ anti-wireframe: "와이어 + 색"이면 실패다. elevation/깊이·여백 리듬·타이포 스케일 대비·실제 콘텐츠(lorem 금지)·마이크로 인터랙션으로 진짜 hi-fi를 만든다.
경로 + 한 줄 요약만 반환.`;
  }
  return `프로젝트 ${project} 의 하이파이 화면 1개를 만든다.
- 만들 파일: ${dirPath(rel)}/${s.name}
- 화면 스펙: ${s.spec || '(00-flow §화면별 구성요소·상태·책임 동작 참조)'}
- 공유 토큰: ${tokensCss} (semantic 토큰만 사용, import)
- 와이어 참고: ${wireDir}/${s.name} (링크 구조·href·상태 동작 그대로 유지)
- 대상 뷰포트: ${viewport}
- 계약: ${flow}
- 비주얼 브리프(현행 기준 — 이 위에서 짓는다):\n${briefDigest(brief)}
- ★ anti-wireframe(가장 중요): "와이어 + 색"이면 실패다. 와이어는 골격이고, 여기선 *진짜 hi-fi*를 만든다 — elevation/깊이(그림자·레이어)·여백 리듬·타이포 스케일 대비(제목↔본문↔캡션)·실제 콘텐츠(lorem·빈 껍데기 금지)·상태/마이크로 인터랙션. 밋밋한 박스 나열로 끝내지 마라.
경로 + 한 줄 요약만 반환.`;
};

const shootPrompt = (rel) =>
  `프로젝트 ${project} 의 ${rel}/ 폴더 하이파이를 *실제로 렌더*해 PNG 스크린샷을 떨군다(검증·트렌드가 소스가 아니라 픽셀을 보게).
- 프로젝트: ${project} / 폴더: ${rel} / 뷰포트: ${viewport}
- Bash로 node scripts/shoot.js ${project} ${rel} <WxH> 를 실행하고, 출력된 PNG 경로를 화면별로 정리.
structured: shots[{screen('${rel}'의 .html 파일명), png(repo-상대 경로)}] 반환.`;

const verifyPrompt = (s, rel, png, k) =>
  `프로젝트 ${project}, 화면 ${dirPath(rel)}/${s.name} 을 적대적으로 검증한다(회의론자 ${k + 1}/${V}).
- ★ 렌더 스크린샷(픽셀): ${png || '(렌더 실패 — 소스로 판정하되 wireframey 의심)'} — **이 PNG를 Read로 열어 *실제 렌더된 화면*을 보고 판정한다.** 소스만 읽지 마라(픽셀맹 금지).
- 계약: ${flow} / 토큰: ${tokensCss}
- render-check 7항목(thin/bad/variantsIdentical/offBrief/deadControl/stateInert/**wireframey**)을 각각 ok/ng로 판정. 한 항목이라도 ng면 verdict=FAIL.
  · wireframey = 렌더가 "와이어 + 색" 수준인가(깨지지도 빈약하지도 않은데 hi-fi가 아닌 밋밋함 — 깊이·여백 리듬·타이포 위계·마이크로 인터랙션 부재). thin/bad와 다른 *비주얼 충실도* 항목이다.
- 파일은 쓰지 말고 structured verdict만 반환(workflow 모드).
의심스러우면 후하게 보지 말고 ng.`;

const trendPrompt = (rel, shotMap) => {
  const pngs = screens.map((s) => shotMap[s.name]).filter(Boolean);
  return `프로젝트 ${project} 의 하이파이를 brief가 택한 방향 안에서 현행 기준과 대조해 0~100으로 감정한다.
- 대상 폴더: ${dirPath(rel)}/  (화면: ${screens.map((s) => s.name).join(', ')})
- ★ 렌더 스크린샷(픽셀, Read로 열어볼 것): ${pngs.join(', ') || '(렌더 실패)'} — **소스가 아니라 이 PNG들의 실제 렌더를 보고 점수를 매긴다.**
- 방향 문서: ${flow}, ${prd} §8 / 토큰: ${tokensCss}
- WebSearch로 이 방향의 현행 UX·비주얼 기준을 근거화(출처 URL 남김). ⚠ off-brief 금지 — 방향 교체 권고 금지, "방향 안에서의 완성도"만. "와이어 + 색" 수준이면 낮게 준다.
structured: score, perScreen, critique, sources, recommendations 반환.`;
};

// ── 한 폴더: 빌드 → 렌더 → 적대적 검증 → 트렌드 감정 (안정성: 저하 추적) ───────
async function buildVerifyScore(rel, mode, trendInput, phases) {
  const dgr = []; // 이 폴더에서 발생한 조용한 품질 저하(F-S2)
  // 빌드(배리어 — 렌더는 전 화면이 있어야). 인덱스로 성공/실패를 가른다(F-S5).
  const builds = await parallel(screens.map((s) => () =>
    agent(buildPrompt(s, rel, mode, trendInput, BRIEF), { agentType: 'screen-builder', schema: BUILD_SCHEMA, label: `${mode || 'build'}:${s.name}`, phase: phases.build })
  ));
  const built = screens.filter((s, i) => builds[i] && builds[i].path); // 빌드 성공 화면만
  const failed = screens.filter((s, i) => !(builds[i] && builds[i].path)).map((s) => s.name);
  if (failed.length) dgr.push(`빌드 실패(검증 제외): ${rel}/ ${failed.join(', ')}`);
  if (!built.length) { // 전멸 — 더 진행 못 함
    dgr.push(`${rel}/ 빌드 전멸 — 검증·트렌드 불가`);
    return { builds, built, verified: [], trend: { score: 0, critique: '빌드 전멸' }, shotMap: {}, pixelChecked: false, degraded: dgr };
  }
  // 렌더(배리어 — 검증·트렌드가 픽셀을 봄). 실패해도 멈추지 않고 소스 폴백 + 저하 기록(F-S4).
  const shot = await agent(shootPrompt(rel), { agentType: 'screen-shooter', schema: SHOOT_SCHEMA, label: `shoot:${rel}`, phase: phases.shoot });
  const shotMap = {};
  ((shot && shot.shots) || []).forEach((x) => { shotMap[x.screen] = x.png; shotMap[String(x.screen).replace(/\.html$/i, '')] = x.png; });
  const noPng = built.filter((s) => !shotMap[s.name]).map((s) => s.name);
  const pixelChecked = noPng.length === 0;
  if (!pixelChecked) dgr.push(`렌더 실패 → 픽셀맹 폴백(소스로만 판정 — wireframey 놓칠 수 있음): ${rel}/ ${noPng.join(', ') || '(전체)'}`);
  log(`렌더(${rel}): ${pixelChecked ? built.length + '장 — 픽셀 검증' : '일부/전체 실패 → 소스 폴백'}.`);
  // 화면당 N명 적대적 검증(렌더 기반·다수결) — 빌드 성공분만(F-S5)
  const verified = await parallel(built.map((s) => () =>
    parallel(Array.from({ length: V }, (_, k) => () =>
      agent(verifyPrompt(s, rel, shotMap[s.name], k), { agentType: 'design-verifier', schema: VERDICT_SCHEMA, label: `verify:${s.name}#${k + 1}`, phase: phases.verify })
    )).then((votes) => aggregate(s.name, votes))
  ));
  const lowVoters = verified.filter((v) => v.votes < V).map((v) => `${v.screen}(${v.votes}/${V})`);
  if (lowVoters.length) dgr.push(`검증자 일부 사망(적은 표로 판정): ${rel}/ ${lowVoters.join(', ')}`);
  // 트렌드 감정(전 화면 렌더 필요 → 이미 배리어)
  const trend = await agent(trendPrompt(rel, shotMap), { agentType: 'design-trend-expert', schema: TREND_SCHEMA, label: `trend:${rel}`, phase: phases.trend });
  if (!trend) dgr.push(`트렌드 감정 실패: ${rel}/`);
  return { builds, built, verified, trend: trend || { score: 0, critique: '감정 실패' }, shotMap, pixelChecked, degraded: dgr };
}

// 조용한 저하 누적기(F-S2) — 무인이라 사람이 로그를 안 보므로 return·§D로 표면화한다.
const degraded = [];

// ── 0) 빌드 전 비주얼 레퍼런스 브리프 (plan의 market-researcher 대칭) ──────────
phase('Reference');
log('빌드 전 비주얼 레퍼런스 조사(현행 기준 근거화 → 빌더 입력).');
const BRIEF = await agent(referencePrompt(), { agentType: 'design-trend-expert', schema: BRIEF_SCHEMA, label: 'reference', phase: 'Reference' });
if (!BRIEF || !BRIEF.brief) degraded.push('비주얼 레퍼런스 브리프 실패 — 빌더가 현행 기준 근거 없이 빌드(와이어풍 위험↑)');

// ── 1) 원본: 빌드 → 렌더 → 적대적 검증 → 트렌드 ──────────────────────────────
phase('Build');
log(`하이파이 ${screens.length}화면 빌드 → 렌더 → 화면당 ${V}명 적대적 검증(렌더 기반·다수결) → 트렌드 감정.`);
const r1 = await buildVerifyScore(ORIG, 'build', null, { build: 'Build', shoot: 'Shoot', verify: 'Verify', trend: 'Trend' });
const verified = r1.verified;
const trend = r1.trend;
const origPass = verified.length > 0 && verified.every((v) => v.verdict === 'PASS');
log(`원본 검증: ${verified.filter((v) => v.verdict === 'PASS').length}/${verified.length} PASS. 트렌드: ${trend.score}/${threshold}.`);

// ── 2) 미달이면 리디자인 1회 + 재렌더·재검증·재감정 ───────────────────────────
let chosen = ORIG;
let chosenRun = r1;
let finalScore = trend.score;
let trend2 = null;
if (trend.score < threshold) {
  phase('Redesign');
  log(`임계값 미달 → 발산 리디자인 1회 (${VARIANT}).`);
  const r2 = await buildVerifyScore(VARIANT, 'redesign', trend, { build: 'Redesign', shoot: 'Redesign', verify: 'Redesign', trend: 'Redesign' });
  trend2 = r2.trend;
  log(`트렌드 점수(${VARIANT}): ${trend2.score}.`);
  if (trend2.score > trend.score) { chosen = VARIANT; chosenRun = r2; finalScore = trend2.score; }
  log(`chosen = ${chosen} (원본 ${trend.score} vs ${VARIANT} ${trend2.score}).`);
}
const chosenVerified = chosenRun.verified;
// chosen 폴더에서 발생한 저하만 채택 + 가로지르는 신호(임계값 미달·검증 실패)
degraded.push(...chosenRun.degraded);
const belowThreshold = finalScore < threshold;
if (belowThreshold) degraded.push(`트렌드 ${finalScore} < 임계값 ${threshold} (리디자인 1회로도 미달 — 비주얼 미흡, 사람 검수 권장)`);
const chosenVerifyResult = chosenVerified.length > 0 && chosenVerified.every((v) => v.verdict === 'PASS') ? 'PASS' : 'FAIL';
if (chosenVerifyResult === 'FAIL') degraded.push(`chosen(${chosen}) 독립 검증 FAIL/미완 — lint-verify가 막는다(사람/재실행 필요)`);

// ── 3) 기록: design-verify.md · design-critique.md · STATUS chosen (에이전트가 파일 작성) ──
phase('Record');
const recordPrompt = `forge-design 결과를 atelier 산출물로 기록한다. 아래 데이터로 파일 3개를 정확한 스키마로 쓰고, HTML은 수정하지 마라.

[1] projects/${project}/design-verify.md — chosen(${chosen})의 독립 검증 결과. scripts/lint-verify.js 가 검사하니 형식을 정확히:
  - 머리: "검증자: design-verifier (독립 서브에이전트, N=${V} 다수결, 렌더 스크린샷 기반) — 빌더·메인과 다른 컨텍스트"
  - "대상: ${chosen}/"
  - 화면별 표 헤더: | 화면 | thin | bad | variantsIdentical | off-brief | deadControl | stateInert | wireframey | 판정 |
  - 각 화면 행을 아래 JSON의 dims(ok/ng)·verdict로 채운다(offBrief→off-brief 열).
  - 끝에 "RESULT: PASS|FAIL" (한 화면이라도 FAIL이면 FAIL).
  검증 JSON: ${JSON.stringify(chosenVerified.map((v) => ({ screen: v.screen, dims: v.dims, verdict: v.verdict, voters: v.votes })))}

[2] projects/${project}/design-critique.md — 비주얼 브리프 + 트렌드 감정 기록. 원본 점수 ${trend.score}${trend2 ? `, ${VARIANT} 점수 ${trend2.score}` : ''}, chosen=${chosen}, 임계값 ${threshold}. 빌드 전 비주얼 브리프(현행 기준·레퍼런스·출처), 화면별 점수·지적·출처 URL·리디자인 여부·종합 점수. **그리고 "## ⚠ 자동 저하(degraded)" 섹션에 아래 목록을 그대로 적는다(비었으면 "없음").**
  비주얼 브리프 JSON: ${JSON.stringify(BRIEF)}
  트렌드 JSON: ${JSON.stringify({ original: trend, variant: trend2 })}
  자동 저하(degraded): ${JSON.stringify(degraded)}

[3] projects/${project}/STATUS.md — "후보 / chosen final" 항목에 chosen 폴더(${chosen})를 "(chosen)"으로 표시한다(lint-verify·lint-handoff 가 STATUS의 "(chosen)" 마커로 대상 폴더를 찾는다). 5단계(하이파이) 메모를 "독립 검증(N=${V} 다수결, 렌더 기반) + 트렌드 ${finalScore} 통과"로 갱신.

design-verify.md 스키마(7항목 + wireframey 열)와 (chosen) 마커를 어기면 게이트가 깨진다 — 정확히 지켜라.`;
await agent(recordPrompt, { label: 'record', phase: 'Record' });

// ── 반환 (forge 메인이 받아 후속 게이트를 돌린다) ─────────────────────────────
return {
  project,
  chosen,
  screens: screens.map((s) => s.name),
  builtScreens: chosenRun.built.map((s) => s.name),
  referenceBrief: BRIEF && BRIEF.brief,
  originalTrendScore: trend.score,
  finalTrendScore: finalScore,
  belowThreshold,              // 임계값 미달인데 진행됨(F-S3) — 메인이 §D에 명시
  pixelChecked: chosenRun.pixelChecked, // 렌더 PNG로 검증됐나(F-S4) — false면 픽셀맹 폴백
  redesigned: !!trend2,
  originalVerifyPass: origPass,
  chosenVerifyResult,
  degraded,                   // ⚠ 조용한 저하 목록(F-S2) — 메인이 §D "자동 저하 항목"에 그대로 노출
  nextGates: [
    `node scripts/lint-verify.js ${project}`,
    `node scripts/test-project.js ${project} <axe/2층 회귀 spec>`,
    `node scripts/lint-handoff.js ${project} (handoff 후)`,
  ],
};
