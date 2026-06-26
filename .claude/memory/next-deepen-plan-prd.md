---
name: next-deepen-plan-prd
description: [로드맵] plan 강화✓ + 소형 E2E✓ → 다음=협업 칸반 보드로 대형 E2E(결정됨)
metadata:
  type: project
---

2026-06-26. atelier 하네스 검증 로드맵.

**완료 1 — plan(PRD) 공정 강화:** design과 대칭으로 `prd-critic` + `lint-prd-review` + `forge-plan` workflow 도입. (lint-prd는 형식만, 실질은 prd-critic이 본다.) 상세 [[harness-agent-workflow-status]].

**완료 2 — 소형 E2E:** quick-todo(Todo 앱)로 forge-plan→forge-design 한 바퀴 완주, 6게이트 green. 결과·함정 [[forge-e2e-findings]]. 결론: *파이프라인 연결성은 확인, 난이도 거름망은 미검증.*

**다음 목표 — 대형 다화면 테스트.** 소형은 fan-out·묶음(청크)·리디자인·비평 NG 루프가 거의 안 돌았다. 화면 5~8개 + 분기·상태 얽힌 앱으로 다음을 실제로 발동시킨다:
- design **묶음(청크) 진행**(①단계 세로 자르기 ②묶음별 게이트, tokens 1회) — 화면 多일 때만 발동.
- **트렌드 임계값 미달 → 발산 리디자인 1회**(screens-bold) 경로.
- **prd-critic NG → 개정 1회** 루프(소형은 1차 PASS라 안 돌았음).
- screen-builder **병렬 fan-out** 다수 화면.

**결정(2026-06-26): 협업 칸반 보드.** 다음 세션은 이걸로 `/forge` 대형 E2E를 돈다. 특히 볼 것:
- **드래그 인터랙션 모델** — 카드 이동(컬럼 간)이 *구조*(인터랙션 모델)다. 와이어에서 상태 변화로 모델링하되, Playwright 죽은-컨트롤/기능 assert로 드래그를 어떻게 검증할지가 관건(HTML5 DnD는 file://·Playwright에서 까다로움 → 클릭 기반 "이동" 액션 폴백 고려).
- **다화면 청크** — 보드 · 카드 상세 · 멤버/초대 · (프로젝트 목록) 등 → design 묶음 진행(세로 자르기 + 묶음별 게이트, tokens 1회) 첫 실발동.
- 협업이므로 단일사용자 가정 깨짐 — 멤버·권한·실시간 갱신 상태가 PRD/데이터모델에 들어옴(prd-critic의 dataCoherent가 시험대).
- 소형서 본 함정 재적용: 영속 vs 죽은-컨트롤 프로버, 화면당 index 처리. 상세 [[forge-e2e-findings]].
