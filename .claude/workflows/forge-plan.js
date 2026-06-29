export const meta = {
  name: 'forge-plan',
  description: 'forge 무인 기획을 결정론적으로 오케스트레이션 — 시장조사(축 분할 병렬 근거화) → PRD 초안 작성 → N명 prd-critic 다측면 적대적 비평(다수결) → 미달 시 개정 1회 → PRD.md·plan-decisions.md·prd-review.md 기록. honor-system 구멍(추측 PRD·셀프검증·비평 누락)을 코드로 강제한다.',
  whenToUse: 'forge(무인)의 §B 기획 구간. PRD를 추측이 아니라 시장 근거 위에서 쓰고, 작성자가 아닌 별도 컨텍스트가 적대적으로 비평하도록 코드로 엮는다. lint-prd·lint-prd-review 게이트는 메인이 인라인으로 돌린다.',
  phases: [
    { title: 'Research', detail: '시장조사 에이전트 축 분할 병렬(근거+출처)' },
    { title: 'Draft', detail: 'PM 페르소나가 11섹션 PRD 초안 작성' },
    { title: 'Critique', detail: 'prd-critic N명 다측면 적대적 비평(다수결)' },
    { title: 'Revise', detail: '미달 차원 있으면 개정 1회 + 재비평' },
    { title: 'Record', detail: 'PRD.md·plan-decisions.md·prd-review.md·STATUS 기록' },
  ],
}

// ── 입력 (forge가 args로 넘긴다) ────────────────────────────────────────────
// 런타임에 따라 args가 객체가 아니라 JSON 문자열로 도착할 수 있다(직렬화). 방어적으로 파싱한다.
const A = typeof args === 'string' ? (() => { try { return JSON.parse(args); } catch { return {}; } })() : (args || {});
const project = A && A.project;
if (!project) throw new Error('forge-plan: args.project 가 필요합니다.');
const idea = (A && A.idea) || '(아이디어 미기재)';
const intake = (A && A.intake) || '(시작 인테이크 답 없음 — 가정으로 채움)';
const axes = (A && A.researchAxes) || [
  '경쟁/유사 제품·핵심기능·차별점',
  '실사용자 불만·리뷰·니즈',
  '도메인 관행·표준·규제·데이터 모델 관례',
  '제품 아키타입의 표준 화면 구성·정보구조(IA)·진입/온보딩 관례 (이 유형이 당연히 갖는 화면 — 인증·홈/대시보드·설정·멤버 등)',
];
const N = (A && A.critics) || 3; // PRD 비평가 수
const p = (A && A.paths) || {};
const prdPath = p.prd || `projects/${project}/PRD.md`;
const statusPath = p.status || `projects/${project}/STATUS.md`;

// ── 스키마 ────────────────────────────────────────────────────────────────
const confidence = { type: 'string', enum: ['grounded', 'guess'] };
const RESEARCH_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    axis: { type: 'string' },
    findings: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        properties: { question: { type: 'string' }, answer: { type: 'string' }, sources: { type: 'array', items: { type: 'string' } }, confidence },
        required: ['question', 'answer', 'confidence'],
      },
    },
    summary: { type: 'string' },
  },
  required: ['axis', 'findings'],
};
const DRAFT_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: { path: { type: 'string' }, summary: { type: 'string' }, assumptions: { type: 'array', items: { type: 'string' } } },
  required: ['path'],
};
const enumOkNg = { type: 'string', enum: ['ok', 'ng'] };
const DIMS = ['measurable', 'justified', 'prioritized', 'dataCoherent', 'consistent', 'assumptionsSurfaced', 'scoped', 'surfaceComplete'];
const CRITIQUE_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    dims: {
      type: 'object', additionalProperties: false,
      properties: { measurable: enumOkNg, justified: enumOkNg, prioritized: enumOkNg, dataCoherent: enumOkNg, consistent: enumOkNg, assumptionsSurfaced: enumOkNg, scoped: enumOkNg, surfaceComplete: enumOkNg },
      required: DIMS,
    },
    verdict: { type: 'string', enum: ['PASS', 'FAIL'] },
    notes: { type: 'string' },
  },
  required: ['dims', 'verdict'],
};

// ── 다수결 집계(plain JS) ───────────────────────────────────────────────────
function aggregate(votes) {
  const valid = votes.filter(Boolean);
  if (!valid.length) { const ng = {}; DIMS.forEach((d) => (ng[d] = 'ng')); return { dims: ng, verdict: 'FAIL', voters: 0 }; }
  const dims = {};
  for (const d of DIMS) {
    const ngCount = valid.filter((v) => v.dims && v.dims[d] === 'ng').length;
    dims[d] = ngCount * 2 > valid.length ? 'ng' : 'ok';
  }
  // 차원별 과반 ng가 없어도, 비평가 과반이 verdict=FAIL이면 FAIL.
  // (비평가들이 *서로 다른* 차원을 지적하면 어느 차원도 과반에 못 걸려 PASS로 새는 구멍을 막는다.)
  const failVotes = valid.filter((v) => v.verdict === 'FAIL').length;
  const verdict = (DIMS.some((d) => dims[d] === 'ng') || failVotes * 2 > valid.length) ? 'FAIL' : 'PASS';
  return { dims, verdict, voters: valid.length, failVotes, notes: valid.map((v) => v.notes).filter(Boolean) };
}

// ── 프롬프트 ────────────────────────────────────────────────────────────────
const researchPrompt = (axis) =>
  `프로젝트 아이디어: ${idea}
시작 인테이크(사용자 답, 최우선): ${intake}
내 조사 축: ${axis}
이 축을 WebSearch/WebFetch로 조사해 plan 질문(목표 지표의 현실적 수준·MVP 경계·우선순위 근거·데이터 모델 관례·흔한 엣지케이스)에 출처와 함께 근거 있는 답을 낸다. 사용자 답과 충돌하면 사용자 답 우선 + 충돌 명시. 근거 없으면 confidence=guess.
structured(axis, findings[{question,answer,sources,confidence}], summary) 반환.`;
const draftPrompt = (research, reviseNotes) =>
  `너는 25년 경력 시니어 PM이다. 프로젝트 ${project}의 정식 PRD를 ${prdPath} 에 쓴다(개발자가 추가 질문 없이 착수할 깊이).
아이디어: ${idea}
시작 인테이크(최우선 전제): ${intake}
시장조사 근거(JSON): ${JSON.stringify(research)}
${reviseNotes ? `\n[개정 모드] 직전 비평의 미달 지적을 반영해 고쳐 쓴다:\n${reviseNotes}\n` : ''}
11개 섹션을 모두 쓴다: 1 배경·문제정의 / 2 목표·성공지표(측정가능 — 정량·기간·기준) / 3 타깃·시나리오 / 4 기능요구(MVP·다음·나중 우선순위+근거, "사용자가 X→시스템 Y"+엣지케이스) / 5 데이터모델(엔터티·관계 1:1·1:N·N:M, "물리 스키마는 범위 밖" 명시) / 6 사용자흐름 / 7 화면목록·요구 / 8 디자인방향(톤·레퍼런스·뷰포트·다크모드) / 9 비기능 / 10 범위외 / 11 미해결이슈와 가정.
★ 표준 화면 골격(필수): 먼저 이 제품의 **아키타입**(SaaS 웹앱·모바일 소비자앱·내부툴·대시보드·마켓플레이스·콘텐츠사이트 등)을 정하고, 그 유형이 *당연히 갖는* table-stakes 화면(인증/온보딩·홈/대시보드·핵심툴·설정/프로필·멤버/팀·빈/첫실행 상태)을 §7에 **default-IN으로 깐다.** 빼는 화면은 §10 범위 외에 *의도적 제외*로 명시한다(조용히 누락 금지). "백엔드(인증/실시간)가 범위 밖"인 것과 "그 화면 UI를 안 그린다"는 다르다 — 디자인 산출물이므로 로그인·진입 UI는 그린다(백엔드만 범위 밖).
규율: "다 중요" 금지(MVP 경계 직접 긋기) / 각 기능 정당화 / **부풀림 거절 ≠ 기본 골격 누락 허용 — 둘 다 실패다** / 미검증은 본문에 단정 말고 §11 가정으로. 시장조사로 근거 확보된 항목은 "가정"에서 "근거 있는 결정"으로.
경로 + 한 줄 요약 + 가정 목록 반환.`;
const critiquePrompt = (k) =>
  `프로젝트 ${project}, ${prdPath} 를 적대적으로 비평한다(비평가 ${k + 1}/${N}). lint-prd가 못 보는 *실질*을 본다.
8차원을 각각 ok/ng로 판정: measurable(지표 측정가능?), justified(기능 정당화?), prioritized(전부 MVP면 ng), dataCoherent(데이터모델이 기능 다 덮나), consistent(지표→기능→흐름→화면 추적), assumptionsSurfaced(미검증이 §11에 올라왔나 vs 본문 단정), scoped(범위 *부풀었나* — 위쪽 과잉), surfaceComplete(범위 *빈약한가* — 아래쪽 누락: 제품 아키타입의 table-stakes 화면[인증·홈/대시보드·설정·멤버 등]이 §7에 있거나 §10에 의도적 제외로 명시됐나. 조용히 누락이면 ng. scoped와 대칭). 한 차원이라도 ng면 verdict=FAIL.
파일은 쓰지 말고 structured verdict만 반환(workflow 모드). 애매하면 후하지 말고 ng + 구체 지시.`;

// 조용한 저하 누적기(F-S2) — 무인이라 사람이 로그를 안 보므로 return·§D로 표면화한다.
const degraded = [];

// ── 1) 시장조사 (축 분할 병렬 — 배리어: PRD 초안이 전부 필요) ──────────────────
phase('Research');
log(`시장조사 ${axes.length}축 병렬(근거+출처).`);
const research = (await parallel(axes.map((ax) => () =>
  agent(researchPrompt(ax), { agentType: 'market-researcher', schema: RESEARCH_SCHEMA, label: `research:${ax.slice(0, 12)}`, phase: 'Research' })
))).filter(Boolean);
if (!research.length) degraded.push('시장조사 전멸 — PRD가 시장 근거 없이 작성됨(추측 PRD 위험, §11 가정 비중↑)');
else if (research.length < axes.length) degraded.push(`시장조사 일부 실패 (${research.length}/${axes.length}축만 근거화)`);

// ── 2) PRD 초안 ─────────────────────────────────────────────────────────────
phase('Draft');
const draft = await agent(draftPrompt(research, null), { label: 'draft', phase: 'Draft', schema: DRAFT_SCHEMA });
log(`PRD 초안 작성: ${draft && draft.path}`);
if (!draft || !draft.path) degraded.push('PRD 초안 작성 실패 — PRD.md 누락 가능(lint-prd가 막음, 사람/재실행 필요)');

// ── 3) N명 적대적 비평 (다수결) ──────────────────────────────────────────────
phase('Critique');
let agg = aggregate((await parallel(Array.from({ length: N }, (_, k) => () =>
  agent(critiquePrompt(k), { agentType: 'prd-critic', schema: CRITIQUE_SCHEMA, label: `critique#${k + 1}`, phase: 'Critique' })
))));
log(`초안 비평: ${agg.verdict} (${agg.voters}명 다수결). ng 차원: ${DIMS.filter((d) => agg.dims[d] === 'ng').join(', ') || '없음'}.`);

// ── 4) 미달이면 개정 1회 + 재비평 ────────────────────────────────────────────
let revised = false;
if (agg.verdict === 'FAIL') {
  phase('Revise');
  const ngNotes = `미달 차원: ${DIMS.filter((d) => agg.dims[d] === 'ng').join(', ')}\n지적: ${JSON.stringify(agg.notes)}`;
  await agent(draftPrompt(research, ngNotes), { label: 'revise', phase: 'Revise', schema: DRAFT_SCHEMA });
  agg = aggregate((await parallel(Array.from({ length: N }, (_, k) => () =>
    agent(critiquePrompt(k), { agentType: 'prd-critic', schema: CRITIQUE_SCHEMA, label: `re-critique#${k + 1}`, phase: 'Revise' })
  ))));
  revised = true;
  log(`개정 후 재비평: ${agg.verdict}. ng 차원: ${DIMS.filter((d) => agg.dims[d] === 'ng').join(', ') || '없음'}.`);
}
if (!agg.voters) degraded.push('PRD 비평 전멸(0표) — 자동 FAIL 처리(검증 신뢰도 낮음)');
else if (agg.voters < N) degraded.push(`PRD 비평자 일부 사망 (${agg.voters}/${N}명으로 판정)`);
if (agg.verdict === 'FAIL') degraded.push(`PRD 비평 ${revised ? '개정 1회 후에도 ' : ''}FAIL (ng: ${DIMS.filter((d) => agg.dims[d] === 'ng').join(', ')}) — lint-prd-review가 막음(사람/재실행 필요)`);

// ── 5) 기록: prd-review.md · plan-decisions.md · STATUS (에이전트가 파일 작성) ──
phase('Record');
const recordPrompt = `forge-plan 결과를 atelier 산출물로 기록한다. 아래 데이터로 파일을 쓰고, PRD.md 본문은 이미 작성됐으니 손대지 마라(가정 노출 문제만 있으면 §11만 보정 허용).

[1] projects/${project}/prd-review.md — PRD 독립 비평 결과. scripts/lint-prd-review.js 가 검사하니 형식을 정확히:
  - 머리: "비평가: prd-critic (독립 서브에이전트, N=${N} 다수결) — 작성자·메인과 다른 컨텍스트"
  - "대상: projects/${project}/PRD.md"
  - 차원별 표: | 차원 | 판정 | 근거/지적 |  (8행: ${DIMS.join(', ')})
  - 끝에 "RESULT: PASS|FAIL"
  비평 JSON(다수결 집계): ${JSON.stringify(agg)}

[2] projects/${project}/plan-decisions.md — 시장조사가 plan 질문에 어떻게·무슨 근거로 답했나. 행마다: 질문 → 근거(출처 URL) → 답/권고 → 신뢰도(grounded/guess). §11 가정과 교차참조용(근거 확보 항목은 "가정"→"근거 있는 결정"으로 승격 표시).
  조사 JSON: ${JSON.stringify(research)}

[3] projects/${project}/STATUS.md — "0. 기획" 하위 1~7·"→ PRD.md 작성 완료"를 체크하고, "현재 단계: 1-인테이크 (/design 대기)"로 갱신. 메모에 "무인 기획: 시장조사 ${research.length}축 + prd-critic N=${N} 다수결 비평(${agg.verdict})${revised ? ', 개정 1회' : ''}" 추가. ${degraded.length ? `그리고 메모에 "⚠ 자동 저하: ${degraded.join('; ')}" 한 줄 추가.` : '자동 저하 없음.'}

prd-review.md 스키마(비평가 라인·8차원·RESULT)를 어기면 lint-prd-review 가 깨진다 — 정확히 지켜라.`;
await agent(recordPrompt, { label: 'record', phase: 'Record' });

// ── 반환 (forge 메인이 받아 후속 게이트를 돌린다) ─────────────────────────────
return {
  project,
  researchAxes: research.map((r) => r.axis),
  prd: prdPath,
  critiqueResult: agg.verdict,
  ngDims: DIMS.filter((d) => agg.dims[d] === 'ng'),
  revised,
  degraded,                   // ⚠ 조용한 저하 목록(F-S2) — 메인이 §D "자동 저하 항목"에 그대로 노출
  nextGates: [
    `node scripts/lint-prd.js ${project}`,
    `node scripts/lint-prd-review.js ${project}`,
  ],
};
