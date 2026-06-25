# household-ledger — design-critique (트렌드 전문가 감정 원장)

> `/forge` C-6: 디자인 트렌드 전문가(독립 심사, 웹검색)가 hi-fi를 **brief 방향(미니멀 금융앱, 토스·뉴뱅크) 안에서** 현행 완성도와 대조해 점수화. 임계값 80. 미달 시 자동 리디자인 1회.
> **off-brief 금지 원칙:** 트렌드는 *방향 안에서의 디테일 기준*이지 방향 교체 사유가 아니다.

## 결과 요약
| 라운드 | 대상 | OVERALL | 판정 |
|---|---|---|---|
| 1차 감정 | `screens/` (원본 hi-fi) | **71** | REDESIGN (<80) |
| 자동 리디자인 1회 | `screens-refined/` | — | (5개 지적 반영) |
| 재감정 | `screens-refined/` | **86** | **PASS (≥80)** |

**→ chosen final = `screens-refined/`** (86 > 71). 6·7단계·전달은 이 chosen을 소비.

## 1차 지적 (71 → REDESIGN) 과 반영
| # | 지적 | 반영 |
|---|---|---|
| 1 | 멀티컬러 이모지(🍚☕🏠) 도배 → 신뢰형 금융앱 톤과 충돌 | 전 화면 **단색 라인 픽토그램**(_icons.md)으로 교체 |
| 2 | stats 도넛 6슬라이스가 전부 블루 명도 → 카테고리 구분 불가(데이터 표현 실패) | 도넛 **hue 분리**(블루·틸·앰버·바이올렛·회색) + 범례 색칩 1:1 매칭 |
| 3 | add 숫자패드 안 보임 + 저장이 폼 중간 → 입력 마찰 계약 위반 | **온스크린 키패드 상시 노출** + 저장 **하단 고정** + 비활성 헬퍼텍스트 |
| 4 | `[범위 밖]` 점선 플레이스홀더 노출 | index·recurring에서 **제거** |
| 5 | 카드 과분리(밀도) | index 최근거래를 **한 카드 내 행**으로, list 필터 한 줄, detail 행간 축소 |

## 화면별 재감정 점수 (86)
- index **88** — 잔액 위계·단색 픽토 정착. 잔존: 거래 행 픽토 배경이 모두 중립이라 스캔성 약간 손해.
- add **80** — 키패드+저장하단+헬퍼로 최대 개선. 잔존: 세로 과밀, 비활성 저장 CTA 존재감.
- list **89** — 날짜그룹·메타칩 정돈. 잔존: 필터칩 가로 스크롤 어포던스.
- detail **87** — 정의형 레이아웃 명료, 수정=primary/삭제=danger 위계. 잔존: −₩ 글리프 간격.
- stats **90** — 최고점. 도넛 색분리·범례 1:1·전월대비·멤버막대 핀테크 표준 충족.
- recurring **84** — 활성칩·발생일 강조 명확. 잔존: 카드당 아이콘 언어 통일.

## 남은 다듬기 (PASS — 사람 검수/후속에서, off-brief 아님)
1. add 세로 과밀 완화(빠른입력·반복·메모 접기), 비활성 저장 CTA 형태 존재감.
2. 카테고리 색 토큰을 list·index 픽토 배경에도 소량 반영(현재 stats만 컬러 → 시스템 두 갈래로 보임). semantic 1:1 유지·채도 절제.
3. list 필터칩 가로 스크롤 페이드/인디케이터.

## 출처(현행 기준 대조)
- https://blog.logrocket.com/ux-design/great-examples-fintech-ux/
- https://www.wavespace.agency/blog/banking-app-ux
- https://www.purrweb.com/blog/banking-app-design/
- https://www.designstudiouiux.com/blog/fintech-ux-design-trends/
- https://www.ramotion.com/expense-tracker-app-ui-ux-design-concept/

## 한계 (정직)
트렌드 전문가는 *brief 방향 안에서의 비주얼 완성도*를 자동 프록시로 봤을 뿐, **최종 미감·"이게 우리 가족에게 맞는 톤인가"는 사람만 안다.** 86/PASS는 "현행 미니멀 금융앱 기준에 부합"이지 사람 검수 완료가 아니다.
