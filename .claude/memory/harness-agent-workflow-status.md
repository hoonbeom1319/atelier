---
name: harness-agent-workflow-status
description: atelier 하네스에 실제 에이전트(.claude/agents)+forge-design Workflow를 도입한 현황과 설계 원칙
metadata:
  type: project
---

2026-06-26 작업. atelier 하네스에 "에이전트"를 *이름뿐 산문*에서 *실제 구현*으로 끌어올림.

**도입한 것 (design):**
- `.claude/agents/`: `design-verifier`(독립 render-check **7항목** — thin/bad/variantsIdentical/off-brief/deadControl/stateInert/**wireframey**, **렌더 PNG 기반**), `screen-builder`(화면 1개 빌더 + **anti-wireframe 바**), `design-trend-expert`(두 모드: 빌드 전 **레퍼런스 브리프** + 빌드 후 **렌더 기반** 트렌드 감정 0~100), `screen-shooter`(**Bash+Playwright 렌더러** → `scripts/shoot.js`로 PNG, 픽셀맹 해소 D1).
- `.claude/workflows/forge-design.js`: 무인 디자인 핵심을 코드로 — **(빌드 전)비주얼 레퍼런스 브리프** → 빌드 fan-out(anti-wireframe·브리프 입력) → **렌더 스크린샷(screen-shooter→PNG, scripts/shoot.js)** → **화면당 N명(기본3) 적대적 검증(렌더 기반·다수결, render-check 7항목 wireframey 포함)** → 트렌드 점수(렌더 기반) → 임계값(80) 미달 시 리디자인 1회 → design-verify.md·design-critique.md·STATUS chosen 기록. **D1 픽셀맹 해소**: 검증·트렌드가 소스 아니라 PNG를 본다.
- `scripts/lint-verify.js`: 독립 검증 산출물(`design-verify.md`) 게이트. `_smoke/design-verify.md`가 good 회귀 픽스처.

**도입한 것 (plan — design과 대칭):**
- `.claude/agents/`: `prd-critic`(PRD 8차원 실질 비평 — measurable/justified/prioritized/dataCoherent/consistent/assumptionsSurfaced/scoped/**surfaceComplete**; scoped=범위 부풀림·surfaceComplete=표준 화면 골격 빈약, 양방향), `market-researcher`(웹검색 plan 질문 근거화 — IA/표준 화면 구성 축 포함).
- `.claude/workflows/forge-plan.js`: 무인 기획을 코드로 — 시장조사(축 분할 병렬) → PRD 초안(PM 페르소나) → **N명 prd-critic 다측면 비평 다수결** → 미달 시 개정 1회 → PRD.md·plan-decisions.md·prd-review.md·STATUS 기록.
- `scripts/lint-prd-review.js`: PRD 실질 비평 산출물(`prd-review.md`) 게이트. lint-prd(형식)와 2단 게이트. `_smoke/prd-review.md`가 good 픽스처.
- 핵심 통찰: lint-prd는 *형식(섹션 존재)* 만 봄 → prd-critic이 *실질* 을 봄. design의 honor-system 구멍과 정확히 대칭.

**핵심 설계 원칙 (어기지 말 것):**
- **에이전트는 생산, 스크립트가 심판.** 에이전트로 게이트를 대체하지 말고, honor-system 구멍을 메우되 *대응 lint 게이트*를 같이 둔다. 이 하네스 정체성=결정론적 스크립트 바닥.
- **agents(정의/부품) ≠ workflow(오케스트레이션). 합쳐 쓴다.** workflow가 agentType으로 부품 호출.
- **수동 `/design`=인라인 단일 검증자(대화형·사람 OK), 무인 `/forge`=forge-design workflow(코드 강제).** 같은 부품 공유.
- 남은 한계: lint은 산출물 존재·PASS만 보장, "정말 별도 컨텍스트가 썼나"는 workflow 경로에서만 구조적으로 보장됨.

**검증:** `_smoke` 4게이트(lint-prd/lint-prd-review/lint-verify/lint-handoff) 전부 green, forge-design.js·forge-plan.js 런타임 래핑 기준 구문 OK. **아직 실제 엔드투엔드 실행(실 프로젝트로 workflow run, 또는 /plan·/design 인라인 비평/검증)은 안 해봄** — 다음 작업이 바로 이 E2E 테스트(더미 프로젝트로 forge-plan→forge-design 한 바퀴). plan 강화는 design과 대칭으로 완료됨([[next-deepen-plan-prd]] 달성).
