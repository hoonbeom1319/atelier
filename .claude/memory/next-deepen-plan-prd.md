---
name: next-deepen-plan-prd
description: [완료] plan(PRD) 공정 강화 끝 — 다음은 E2E 테스트
metadata:
  type: project
---

2026-06-26. 사용자가 "디자인에 쏠려 있다, PRD도 탄탄해야 한다"며 plan 강화를 요청 → **완료됨.** design과 대칭으로 `prd-critic` 에이전트 + `lint-prd-review` 게이트 + `forge-plan` workflow 도입. 상세는 [[harness-agent-workflow-status]].

**핵심 결론(왜 중요했나):** `lint-prd`는 PRD *형식(11섹션 존재)* 만 봤고 *실질*(측정가능 지표·기능 정당화·데이터-기능 정합·내부 일관성·가정 노출)은 아무도 강제 안 함. 특히 무인 forge는 PM 자문자답이라 사람 반박이 없어 제일 약했음. → 형식(lint-prd) + 실질(prd-critic/lint-prd-review) 2단 게이트로 닫음.

**다음 목표:** 더미 프로젝트로 **엔드투엔드 테스트** — forge-plan → forge-design 한 바퀴 돌려 실제로 ① market-researcher가 plan-decisions.md 쓰고 ② prd-critic이 prd-review.md 쓰고 ③ 게이트가 통과/반려하는지, ④ design 쪽도 같이. 사용자가 "커밋·plan 다음에 E2E" 순서로 지시함.
