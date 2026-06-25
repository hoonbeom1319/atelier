# household-ledger — plan-decisions (기획 결정 원장)

> `/forge` 무인 파이프라인의 **시장조사 에이전트(웹검색)**가 `/plan`의 세세한 질문에 *어떻게·무슨 근거로* 답했는지의 기록.
> 각 행: **질문 → 조사 근거(출처) → 내가 내린 답/결정 → 신뢰도.** 이것이 PRD §11 가정 원장의 *증거판*이다.
> 조사일 2026-06-25. 3개 병렬 에이전트(경쟁제품 / 사용자 불만 / UX·데이터 관행).

---

## 신뢰도 범례
- **근거 강** — 복수 1차/2차 출처가 일치.
- **근거 중** — 단일·블로그성 출처 또는 부분 근거.
- **추측** — 직접 출처 없이 패턴에서 역추론(검수 필요).

---

## 1. 문제 정의 / 차별점

| 질문 | 조사 근거 (출처) | 결정 | 신뢰도 |
|---|---|---|---|
| 이 시장에 빈자리가 있나? | 뱅크샐러드가 2025.8 부부 '우리집 돈 관리' 종료 → 신뢰형 부부가계부 공백 ([전자신문](https://www.etnews.com/20250817000027)) | 진입 타이밍 유효. 단 "공유 자산관리는 리텐션 난제" 경고 동반 → 채택 동기를 *투명한 공동 지출 기록*으로 잡음 | 근거 강 |
| 공유 가계부의 핵심 가치는? | "누가 썼는지 자동 구분"이 1순위 불만, 안 되면 "쓰기 힘들다" ([Blind](https://www.teamblind.com/kr/post/부부-가계부-공유어플-뭐-써-z2Rearbf), [appbiabi](https://appbiabi.com/account-book-application/)) | 멤버 귀속 = 차별의 본질 → 코어로 격상(결정 1) | 근거 강 |

## 2. 목표·성공 지표

| 질문 | 조사 근거 | 결정 | 신뢰도 |
|---|---|---|---|
| 입력은 얼마나 빨라야 하나? | "한 건 로깅 5초·30초 넘으면 1주 내 이탈", 탭 수가 이탈 1차 변수 ([getfinny](https://getfinny.app/blog/best-simple-budget-apps-2026), [pocketclear](https://pocketclear.app/blog/manual-expense-tracking-benefits.html)) | 핵심경로 **3탭/5초**를 §2 지표로(기존 5탭/10초에서 강화) | 근거 중~강 |
| 어떤 통계를 실제로 보나? | 카테고리 비율 + 전월 대비 + (공유)멤버별, "3개면 충분" ([money.clubkorea](https://money.clubkorea.co.kr/가계부-분석-방법-정리)) | 통계 3종으로 제한, 세분화 차트 후순위 | 근거 중 |

## 3. 타깃 사용자

| 질문 | 조사 근거 | 결정 | 신뢰도 |
|---|---|---|---|
| 계정 공유 방식 선호? | ID/PW 공유는 거부감, "각자 계정 유지 + 거래 합산"을 원함 ([Blind](https://www.teamblind.com/kr/post/부부-가계부-공유어플-뭐-써-z2Rearbf), [카카오페이](https://www.etoday.co.kr/news/view/2343559)) | 멤버 = 각자 계정 연결 모델(디자인은 멤버 귀속·아바타까지, 초대/권한은 나중) | 근거 중~강 |

## 4. 핵심 기능·우선순위 (MVP 경계)

| 질문 | 조사 근거 | 결정 | 신뢰도 |
|---|---|---|---|
| 우리 MVP가 경쟁 대비 적절? | 경쟁(Shareroo·함쓰·BuBoo) 핵심 = 멤버 귀속·실시간·정산. 예산은 부차 | MVP 골격 유지, 멤버 귀속 격상, 정산은 로드맵 1순위 보류 | 근거 강 |
| 수동입력 MVP 타당? | 마이데이터는 뱅샐도 종료(규제·비용). 단 한국 사용자는 SMS 자동입력 기대 ([편한가계부](https://apps.apple.com/kr/app/%ED%8E%B8%ED%95%9C%EA%B0%80%EA%B3%84%EB%B6%80/id560481810)) | 수동 MVP 유지 + **빠른 재입력(최근·즐겨찾기)** 으로 SMS 부재 보완(결정 2) | 근거 강 |
| 공동/개인 구분 필요? | "공동비 vs 내 용돈" 분리 니즈, 함쓰가 별도 장부로 해결 ([함쓰](https://apps.apple.com/kr/app/%ED%95%A8%EC%93%A8/id1538510805)) | 거래당 공동/개인 토글 1개로 경량 MVP 포함(결정 3) | 근거 중 |
| 정산을 MVP에 넣나? | 분리재정 커플에 핵심이나 공동지갑형엔 부차 ([Shareroo](https://shareroo.net/en/), [토스](https://toss.im/tossfeed/article/toss-split-the-bill)) | MVP 보류, 로드맵 1순위(결정 5) | 근거 중~강 |
| 예산·한도 보류 적절? | 부부 채택 1차 동기는 기록이지 예산 아님 | 보류 적절(가정 F 유지) | 근거 중 |

### 4-1. 데이터 모델

| 질문 | 조사 근거 | 결정 | 신뢰도 |
|---|---|---|---|
| 4-엔터티 골격이 표준? | User/Account·Transaction·Category·Budget가 표준, 반복=subscription 1-N receipt ([GeeksforGeeks](https://www.geeksforgeeks.org/dbms/how-to-design-a-database-for-financial-applications/), [AWS](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/data-modeling-schema-recurring-payments.html)) | 골격 유지 확인 | 근거 강 |
| 빠진 관계는? | **Transaction↔Member(payer) 직접 FK 없으면 멤버별 비교 불가** ([Koody](https://koody.com/blog/shared-budgeting-app-for-couples), [TimelyBills](https://www.timelybills.app/family-budgeting)) | Transaction.member_id를 필수 FK로 명시(결정 1 데이터 근거) | 근거 강 |
| 반복 규칙 필드? | nextDate·frequency·endRule(N회/날짜/무한) 표준 | RecurringRule에 end_rule 추가 | 근거 강 |
| 이체(transfer)? | type income/expense/transfer가 표준 ([banksalad](https://help.banksalad.com/88)) | 계좌 엔터티 범위 밖이라 transfer 제외(결정 6) | 근거 중 |

## 5. 카테고리·UX 패턴 (→ 디자인 입력)

| 질문 | 조사 근거 | 결정 | 신뢰도 |
|---|---|---|---|
| 기본 카테고리 세트? | 한국 앱 분류(식비·주거·교통·통신·구독…) + "6~10 대분류, '기타' 필수" ([small.dalgu.app](https://small.dalgu.app/ko/money-keeper/guide/expense-categories), [jeb2](https://jeb2.search-knowledge.co.kr/121)) | 지출 13 + 수입 3 세트 확정(PRD §5) | 근거 강 |
| 입력 UX 정석? | 금액 숫자패드(blur 포맷)·수입지출 세그먼트·카테고리 아이콘 그리드·날짜 기본 오늘 ([uxpatterns.dev](https://uxpatterns.dev/patterns/forms/currency-input), [parthkabra](https://parthkabra.me/blog/expenses-app-ui/)) | add.html 입력 패턴으로 확정 | 근거 중~강 |
| 도넛 슬라이스 한도? | 도넛 2~5 권장, 소액은 '기타'로 묶기, 색만 구분 금지 ([fusioncharts](https://www.fusioncharts.com/resources/chart-primers/pie-and-doughnut-charts), [evalacademy](https://www.evalacademy.com/articles/common-pie-chart-misuses-and-how-to-fix-them)) | 통계 도넛 상위5+기타, 멤버별은 가로막대(결정 4) | 근거 강 |
| 반복 자동분 표시? | 자동 생성분 시각 구분이 통념이나 구체 뱃지 UI 단일 표준 없음 | "🔁 자동" 뱃지로 구분(채택, 추측 표기) | 추측 |

## 6~7. 제약 / 착수 체크

| 질문 | 조사 근거 | 결정 | 신뢰도 |
|---|---|---|---|
| 동기화 기대 수준? | "느리면 버린다"(클머니 다운·부부가계부 느림 불만) ([appbiabi](https://appbiabi.com/account-book-application/)) | 위생요인 — 디자인 범위 밖이나 §9 비기능에 명시 | 근거 중 |
| 알림 정책? | 실시간 푸시는 가치이나 "알림 끄고 싶다" 피로도 존재 | 푸시는 나중, 피로 제어 전제 | 근거 중 |

---

## 사용자 답과의 충돌 점검
- 충돌 없음. 사용자 인테이크 답(가족공유·수동·MVP4·미니멀)은 모두 조사와 정합.
- **조사가 *추가*한 것**(사용자가 명시 안 했으나 근거로 보강): 멤버 귀속 격상 / 3탭 목표 / 빠른 재입력 / 공동·개인 토글 / 정산 로드맵화. 모두 PRD §11 "근거 있는 결정"에 기록 — 사용자가 원치 않으면 해당 결정만 되돌리면 된다.

## 미해결(근거 부족 — 사람 확인 권장)
- 반복 자동분 뱃지의 구체 UI(추측).
- "안 보는 통계"의 직접 사용자 진술(역추론).
- 정산을 MVP에 당길지 여부는 타깃 세부(공동지갑형 vs 분리재정)에 따라 갈림 — 현 결정은 '공동지갑형 부부' 가정.
