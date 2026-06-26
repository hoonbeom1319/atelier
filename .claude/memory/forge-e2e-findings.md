---
name: forge-e2e-findings
description: forge 무인 E2E 첫 실행(quick-todo) 결과 — 작동 확인 + 비자명한 함정 3가지
metadata:
  type: project
---

2026-06-26. `/forge` 무인 파이프라인을 더미 프로젝트 **quick-todo**(소형 Todo 앱)로 아이디어→handoff까지 한 바퀴 완주. forge-plan·forge-design Workflow가 실제로 돌아 plan-decisions.md·prd-review.md·design-verify.md·design-critique.md를 썼고, 6개 게이트(lint-prd/lint-prd-review/Playwright 1·2층/a11y/lint-verify/lint-handoff) 전부 green. PRD 1차 PASS(NG 0), 트렌드 87→리디자인 없음.

**작동 확인:** 셀프검증 불가(작성자≠비평가 3명, 빌더≠검증자 3명)가 코드로 강제되는 구조가 의도대로 작동. 무인 완주 약속 지켜짐.

**하네스가 실제로 잡은 결함 2건(게이트가 장식 아님을 입증):**
- spec 결함 — 필터 탭 셀렉터 `"완료"`가 strict-mode로 `"미완료"`와 충돌 → `exact:true`로 교정(산출물 아님).
- 산출물 결함 — 완료 항목 `opacity:.65`가 대비 2.99로 **WCAG AA 미달**. 토큰 *값* 게이트는 못 봤고 **렌더 axe가 잡음** → opacity 제거. 게이트 이중화(값+렌더)가 제값.

**비자명한 함정 3가지(다음에 또 만남 — 대응책 기억):**
1. **단일 화면 앱에서 게이트가 공허해질 수 있음.** lint-verify·lint-handoff의 `htmls()`가 `index.html`을 제외 → 진짜 단일화면이면 검증 대상 0개인데 게이트는 green(위양성). 대응: 진입 런처 `index.html` + 기능 화면 `main.html` 2파일로 모델링해 게이트가 물 대상을 만든다.
2. **영속(localStorage)이 죽은-컨트롤 프로버를 무력화.** `controls.js`는 "재로드=상태 초기화"를 전제하는데 영속 앱은 안 깨짐 → 필터·삭제 등은 false negative. 대응: 그 컨트롤은 `ignore`로 빼고 전용 기능 assert로 직접 검증(프로버는 구조 안 바꾸는 테마토글·체크박스만).
3. **소형 앱엔 비용 과다.** todo 하나에 에이전트 ~13개·서브토큰 ~38만·~13분. 하네스는 *중대형 디자인*에서 본전. "간단한 앱" 테스트는 파이프라인 연결성만 확인됨, 난이도 거름망은 미검증.

상세 설계는 [[harness-agent-workflow-status]]. 다음 테스트 계획은 [[next-deepen-plan-prd]].
