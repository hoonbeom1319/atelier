---
name: forge-collab-kanban-e2e
description: forge 대형 E2E(협업 칸반) 완주 결과 — 드래그모델·다크 a11y·워크플로 resume 함정
metadata:
  type: project
---

`/forge "협업 칸반 보드"` 무인 완주(2026-06-26). [[next-deepen-plan-prd]]의 "다음=대형 칸반" 항목 실행 완료. 산출: `projects/collab-kanban/` (PRD PASS, hi-fi screens/ chosen, 트렌드 86, 전 게이트 green). [[forge-e2e-findings]]의 소형(quick-todo) 대비 대형 검증.

**잘 된 것:** 단일 보드라 청크 분할은 불필요했고(컬럼이 세로 청크 역할), 와이어↔하이파이 포터블 셀렉터(role·aria·text)가 21/21 그대로 재실행됨 — 하이파이 빌더가 계약을 1:1 보존. forge-plan/forge-design 둘 다 코드가 다수결·기록을 강제.

**비자명한 함정(다음 대형 실행 시 주의):**
- **드래그&드롭 검증** = 네이티브 DnD 마우스 시뮬은 flaky. 카드 "⋮ 이동" **메뉴(키보드 경로 = a11y 요구)** 로 이동을 결정적 검증하고, 시각 상태(dragging·drop-target)는 dragstart/dragenter **dispatchEvent**로 클래스 토글만 확인. 메뉴 버튼은 `role=menuitem`이라 `getByRole('button')` 아님 — `getByRole('menuitem')`.
- **axe가 잡은 실결함 2종(토큰 게이트가 못 본 것):** ① 라벨칩(흰 텍스트 11px)·overdue 칩이 **다크 모드 대비 4.5 미달** — `--label-*`·다크 `--color-danger`를 흰 텍스트 기준 ≥4.5로 보정. tokens.spec의 DEFAULT_PAIRS는 라벨·danger를 안 봐서 axe(screens-a11y)에서만 발견 → **하이파이 axe 회귀 필수**. ② `<ul>` 안 `<li role=presentation>` 드롭존이 axe `list` 규칙 위반 → 드롭존을 ul **밖 div**로.
- **Workflow resume 함정:** trend 에이전트가 transient API(connection closed)로 null 반환 → `trend.score` throw. `resumeFromRunId`로 재개하면 build/verify는 캐시 적중하나 **args를 다시 넘겨야 함**(scriptPath만 주면 `args.project` 없음 에러). resume엔 scriptPath+resumeFromRunId+**원본 args** 셋 다 필요.

**R2 재빌드(사용자 피드백 "보드만 있고 서비스로 안 보인다"):** 앱 셸(사이드바+탑바)+홈 대시보드로 범위 확장 + 대담 비주얼. 무인 산출이 단일 화면에 머무는 건 PRD가 "단일보드 MVP"로 좁게 잠겨서 — **인테이크에서 '서비스 셸/진입점 포함?'을 물었어야** 했다(다음 forge 인테이크에 플랫폼 질문과 함께 "앱 셸/홈/랜딩 포함 여부" 추가 고려). 처리: 와이어에 셸을 retrofit(현재화면 네비=aria-current 비링크로 죽은링크 회피, [범위밖]은 data-scope=out로 죽은컨트롤 면제) → 같은 forge-design 워크플로로 리스킨. 함정: 셸 스텁/힌트 텍스트가 `--color-text-subtle`(의도적 저대비)라 axe 4.5 미달 → muted로 교체. 그라데이션 히어로는 흰 텍스트 전제로 토큰을 어두운 페어로 잡아야 axe 통과.

**남은 약점:** 사람 3층(미감·"옳은 흐름") 미검수는 무인 본질 한계 — 전달 시 명시함. /forge 인테이크가 "서비스 형태(셸/홈/랜딩)"를 안 물어 1차가 보드 단일로 나온 게 이번 최대 재작업 원인.
