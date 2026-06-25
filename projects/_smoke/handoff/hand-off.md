# _smoke 디자인 인계 — target-app 에 구현

## 목표
아래 디자인 산출물을 target-app 의 컨벤션으로 구현한다. 디자인은 참고, 흐름·기능은 계약(필수).

## 먼저 읽을 것
- `target-app/CLAUDE.md` — 너의 코드 컨벤션. 여기 맞춰 짠다.
- 제품 요구사항: `atelier/projects/_smoke/PRD.md` — 배경·목표·기능·데이터 모델·범위 외.
- 디자인 패키지:
  - chosen final 화면 `atelier/projects/_smoke/screens/` — 최종 비주얼
  - `atelier/projects/_smoke/handoff/index.html` — 스크린샷 + 흐름맵 + 화면별 스펙
  - `atelier/projects/_smoke/handoff/token-mapping.md` — semantic 토큰 매핑
  - `atelier/projects/_smoke/handoff/component-inventory.md` — 컴포넌트 인벤토리
  - `atelier/projects/_smoke/00-flow.md` — 흐름·기능 계약

## 지킬 것 (계약)
- 화면 목록·내비게이션·기능 동작은 디자인대로.
- 토큰은 매핑표대로 대상 시스템 토큰에 매핑(통째 복붙 금지).

## 만들 순서 (제안)
1. 토큰 매핑 반영 → 2. 공통 컴포넌트 → 3. 화면 조립 → 4. 흐름·상태 연결

## 검수
- 흐름·기능이 00-flow.md 계약대로 동작하는지 확인.
