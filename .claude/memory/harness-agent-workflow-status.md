---
name: harness-agent-workflow-status
description: atelier 하네스에 실제 에이전트(.claude/agents)+forge-design Workflow를 도입한 현황과 설계 원칙
metadata:
  type: project
---

2026-06-26 작업. atelier 하네스에 "에이전트"를 *이름뿐 산문*에서 *실제 구현*으로 끌어올림.

**도입한 것:**
- `.claude/agents/`: `design-verifier`(독립 render-check), `screen-builder`(화면 1개 빌더), `design-trend-expert`(웹검색 트렌드 감정 0~100).
- `.claude/workflows/forge-design.js`: 무인 디자인 핵심을 코드로 — 빌드 fan-out → **화면당 N명(기본3) 적대적 검증 다수결** → 트렌드 점수 → 임계값(80) 미달 시 리디자인 1회 → design-verify.md·design-critique.md·STATUS chosen 기록.
- `scripts/lint-verify.js`: 독립 검증 산출물(`design-verify.md`) 게이트. `_smoke/design-verify.md`가 good 회귀 픽스처.

**핵심 설계 원칙 (어기지 말 것):**
- **에이전트는 생산, 스크립트가 심판.** 에이전트로 게이트를 대체하지 말고, honor-system 구멍을 메우되 *대응 lint 게이트*를 같이 둔다. 이 하네스 정체성=결정론적 스크립트 바닥.
- **agents(정의/부품) ≠ workflow(오케스트레이션). 합쳐 쓴다.** workflow가 agentType으로 부품 호출.
- **수동 `/design`=인라인 단일 검증자(대화형·사람 OK), 무인 `/forge`=forge-design workflow(코드 강제).** 같은 부품 공유.
- 남은 한계: lint은 산출물 존재·PASS만 보장, "정말 별도 컨텍스트가 썼나"는 workflow 경로에서만 구조적으로 보장됨.

**검증:** `_smoke` 3게이트(lint-prd/lint-verify/lint-handoff) green, forge-design.js 런타임 래핑 기준 구문 OK. **아직 실제 엔드투엔드 실행(실 프로젝트로 /design 5단계 또는 forge-design workflow run)은 안 해봄** — 다음에 더미 프로젝트로 확인 권장. 아직 커밋 안 함. 다음 목표: [[next-deepen-plan-prd]].
