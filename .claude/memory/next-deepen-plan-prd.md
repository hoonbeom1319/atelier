---
name: next-deepen-plan-prd
description: 다음 작업 — design/forge 강화 후 plan(PRD) 공정도 같은 깊이로 다질 차례
metadata:
  type: project
---

2026-06-26, 사용자가 명시: 지금까지 작업이 **디자인 쪽에 쏠려** 있었다(에이전트 도입 + forge-design workflow). 디자인이 탄탄해지려면 그 위의 **PRD가 탄탄해야** 하고, PRD가 좋아야 개발·운영까지 탄탄해진다. **그래서 design/forge 강화가 일단락되면 `/plan`(PRD 공정)도 같은 수준으로 강화하자**는 게 다음 목표.

**Why:** 파이프라인은 plan(PRD) → design → handoff. 하류(디자인)만 강화하면 상류(기획)의 약점이 그대로 전파된다. 단일 출처는 `.claude/skills/plan/SKILL.md`(7단계·PRD 11섹션)와 `scripts/lint-prd.js`(게이트).

**How to apply:** plan 차례가 오면 — ① `plan/SKILL.md` 절차와 `lint-prd.js` 게이트의 빈틈을 먼저 검토(현재 lint-prd는 11섹션 존재+깊이 경고 위주). ② 디자인에서 한 것과 대칭으로 볼 것: 기획에도 *적대적 검증*(PRD 가정·우선순위·데이터 모델을 별도 컨텍스트가 따져보는 에이전트)이나 시장조사 근거화(`plan-decisions.md`)를 게이트로 승격할 여지. ③ forge의 §B(무인 기획)도 같이 본다. 관련: [[harness-agent-workflow-status]].
