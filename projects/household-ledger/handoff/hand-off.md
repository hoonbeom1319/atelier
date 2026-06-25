# household-ledger 디자인 인계 — 대상 프로젝트에 구현

받는 쪽 Claude Code에 **그대로 붙여넣는 브리프**입니다. 아래 디자인 산출물을 **대상 프로젝트의 컨벤션**으로 구현하세요. 디자인은 *참고*, 흐름·기능은 *계약(필수)*입니다.

> 이 패키지는 atelier(로컬 기획·디자인 작업장)의 `/forge` 무인 파이프라인 산출물입니다. 산출물 루트는 atelier 저장소의 `projects/household-ledger/` 입니다. 아래 경로는 그 저장소 기준 상대경로이니, 대상 프로젝트에서 참조할 땐 atelier 저장소 위치를 앞에 붙이세요.

## 먼저 읽을 것
- 대상 프로젝트의 `CLAUDE.md` — 너의 코드 컨벤션(폴더구조·아키텍처·프레임워크·디자인 토큰 시스템). **여기 맞춰 짠다.**
- 제품 요구사항: `projects/household-ledger/PRD.md` — 배경·목표·기능 요구사항(동작·엣지케이스)·**데이터 모델**·범위 외 = **왜·무엇의 근거**. 흐름과 디자인이 *왜* 이렇게 됐는지 여기서 확인.
- 기획 결정 근거: `projects/household-ledger/plan-decisions.md` — 시장조사로 정한 결정(멤버 귀속 코어·공동/개인 토글·정산 로드맵 등)과 출처.
- 디자인 패키지 (atelier 산출물):
  - chosen final 화면 `projects/household-ledger/screens-refined/` — 최종 비주얼·상태·전환(독립 실행 HTML, 인라인 JS로 상태 동작).
  - `projects/household-ledger/handoff/index.html` — 스크린샷(임베드) + 흐름맵 + 화면별 스펙. 클릭으로 훑기.
  - `projects/household-ledger/handoff/token-mapping.md` — 우리 semantic 토큰 → 너의 토큰 매핑표.
  - `projects/household-ledger/handoff/component-inventory.md` — 컴포넌트 variant/state + 사용 화면.
  - `projects/household-ledger/00-flow.md` — 흐름(§2)·기능 책임(§3·§5) = **지킬 계약**.
  - 아이콘: `projects/household-ledger/_icons.md` — 단색 라인 픽토그램 세트(멀티컬러 이모지 금지).

## 지킬 것 (계약 — 임의 변경 금지)
- **화면 목록·내비게이션·기능 동작은 디자인대로.** 6화면: 홈(index) · 거래입력(add) · 거래내역(list) · 거래상세(detail) · 월간통계(stats) · 반복거래(recurring). 하단탭 4개(홈·내역·통계·반복), add·detail은 푸시 화면.
- **상태 변화·분기를 지킨다:** 입력 유효성(금액>0 & 카테고리 선택 시 저장 활성) · 단일선택(세그먼트·카테고리·멤버·공동개인) · 다중 필터 토글 · 월 페이저 · 반복 인라인 폼 · 삭제 확인 시트.
- **멤버 귀속은 코어** — 거래마다 작성자(멤버)를 표시·필터·통계에 반영(공유 가계부의 존재 이유). 데이터 모델은 PRD §5: Transaction.member_id 필수 FK, scope(shared|personal), RecurringRule 1-N Transaction.
- **접근성 WCAG AA** — 텍스트 대비 4.5(큰 글씨 3.0), 포커스 가시성, 역할·라벨. 토큰 매핑 시 대비를 깨지 말 것.
- **토큰은 매핑표대로** 대상 시스템 토큰에 **매핑**(통째 복붙 금지). 아이콘은 단색 라인.
- **대상 뷰포트 모바일 390px**, 라이트 모드 우선(다크모드는 범위 외 — 토큰 2단이라 추후 semantic 재매핑으로 추가 가능).

## 범위 밖 (이번 MVP 아님 — PRD §4/§10)
정산·더치페이(로드맵 1순위) / 실시간 푸시 알림 / 카테고리 예산·한도 / 멤버 초대·권한 / 카드·은행 연동 / 영수증 OCR / 이체(transfer) / 다국어. 화면에 진입점을 임의로 추가하지 말 것.

## 만들 순서 (제안)
1. 토큰 매핑 반영(token-mapping.md) → 2. 공통 컴포넌트(component-inventory.md: buttons·chips·cards·아이콘) → 3. 화면 조립(screens-refined 참고) → 4. 흐름·상태 연결(00-flow 계약).

## 검수
- 흐름·기능이 `00-flow.md` 계약대로 동작하는지 확인(내비게이션·상태 변화·분기).
- 입력 1건 핵심 경로가 3탭/5초 안에 끝나는지(입력 마찰이 1순위 이탈 요인).
- 멤버별·카테고리별 통계가 데이터 모델과 일치하는지.
- 접근성: 대비·포커스·역할·라벨(원본은 axe serious 0 통과).

> 참고: 이 디자인은 atelier가 직접 구현하지 않는다 — 너의 컨벤션으로 짠다. 디자인 패키지는 *참고*, 흐름·기능·데이터 모델·접근성은 *계약*이다.
