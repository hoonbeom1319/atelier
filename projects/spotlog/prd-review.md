# spotlog — PRD 독립 비평 (prd-review)

비평가: prd-critic (독립 서브에이전트 3명, N=3 다수결 — 작성자·메인과 다른 컨텍스트) · 2라운드(초안 1회 → 개정 후 재비평 1회)
대상: projects/spotlog/PRD.md

> 별도 컨텍스트의 prd-critic 3명이 PRD.md를 적대적으로 정독해 7차원을 각자 판정하고, 차원별·종합 모두 다수결로 집계했다.
> **1라운드(초안):** voters=3, failVotes=2 → 과반 FAIL. 차원별 다수결은 7개 모두 ok였으나, 2명이 *서로 다른* 단일 차원(consistent: F5 지표 단절 / dataCoherent: 게시시점 필드 누락)으로 종합 FAIL을 던져 RESULT=FAIL.
> **개정:** §2 N3(소셜 활성화 최소 신호) 신설 + 비목표 정합화 / §5 PlaceCard에 createdAt·postedAt 추가 + N2 분모 정의 + R1·E2 측정 키를 postedAt으로 명시 / §7 좌표만 카드 렌더 echo.
> **2라운드(개정본 재비평):** voters=3, failVotes=1 → **과반 PASS**. 두 1라운드 지적은 전원 해소 확인. 비평가 2가 *새로* consistent ng(§5 라이프사이클 모호: "제안카드=영속 PlaceCard"와 "업로드 세션=영속 아님"이 충돌 → N1 집계 모집단 모호)를 1표 제기 — 과반 미달이나 정당한 지적이라 **추가 개정으로 해소**(§5 라이프사이클 일원화 + N1 모집단 명시 + N3 telemetry 출처 명시 + §11 B3에 N3 추가).

## 차원별 판정 (2라운드 다수결 집계, voters=3)

| 차원 | 판정 | 근거/지적 |
|---|---|---|
| measurable (측정 가능) | 통과 (3/3 ok) | N1~N3·R1·E1·E2 모두 정량값+기간+측정키 보유. N2 분모(직접촬영 EXIF GPS 보존 1장↑ 게시카드, exifStatus=geotagged로 결정적 산정) 정의. R1 코호트키=postedAt, E2 기준선=베타4주. G1~G5는 디자인 단계 실측 합격선. |
| justified (정당화) | 통과 (3/3 ok) | F1~F7 각 항목이 사용자 문제+시장조사 근거로 정당화. F5는 N3 추가로 P0 정당성 보강. (관찰: F6 메모/태그가 최약 정당화 — 사용자 인테이크 요청이라 P0 유지, NG 아님.) |
| prioritized (우선순위) | 통과 (3/3 ok) | P0(F1~F7)/P1(§4-2)/범위밖(§10) 분리 명확. P0 내부도 위계 존재("전부 MVP" 아님). |
| dataCoherent (데이터 정합) | 통과 (3/3 ok) | 1라운드 FAIL(postedAt 부재) 해소 — createdAt/postedAt 추가, §2 R1·E2 측정키 postedAt 명시, N2 분모 정의. §5가 F1~F7 데이터 전부 덮음, 고아 엔터티 없음. |
| consistent (일관성) | 통과 (2/3 ok, 1 ng → 추가 개정으로 해소) | 1라운드 FAIL(F5 지표 단절) 해소 — N3로 §2→F5→흐름C→SC8/SC9 추적 복구 + 비목표 충돌 제거. 2라운드 비평가 2의 신규 ng(§5 제안카드 라이프사이클이 "영속 PlaceCard"와 "영속 아님" 사이 모호 → N1 모집단 흔듦)는 **추가 개정으로 일원화**: 제안카드=PlaceCard(confirmed=false), '영속 아님'은 세션 임시 귀속·드래프트 저장 여부로 한정, N1 집계 모집단=createdAt 기준 명시. |
| assumptionsSurfaced (가정 노출) | 통과 (3/3 ok) | §11 A1~A6·B1~B7로 가정·추측 폭넓게 노출, 본문 단정 회피. 보완(반영됨): §11 B3에 N3 추가, N3 '열람' 측정의 telemetry 의존을 §2에 명시. |
| scoped (범위) | 통과 (3/3 ok) | §10 범위밖 명시적, F7 최소 유지. 사용자 인테이크 MVP ①~⑤ 외 추가는 F7(프라이버시, 시장조사 근거+§11 A5 검수)뿐. N3는 기존 F5(P0) 범위 내 신호라 scope 증가 아님. |

## 종합

- **강점:** §2 정량·기간·기준선·측정키 충실, §4 기능마다 사용자문제+시장조사 근거, P0/P1/범위밖 분리 명확, §5가 F1~F7 데이터 전부 덮고 좌표(불변)/장소명(가변)·createdAt/postedAt·제안→게시 라이프사이클이 정합, §11이 가정·추측을 폭넓게 노출. 유난히 충실한 PRD.
- **개정 이력:** 1라운드 과반 FAIL(consistent·dataCoherent) → 개정 → 2라운드 과반 PASS(잔여 1표 consistent ng도 §5 라이프사이클 일원화로 해소).
- **잔여(비차단):** 없음 — 비평가들이 든 보조 권고(N1 모집단·N3 telemetry 출처·§11 B3 N3)까지 모두 반영.

RESULT: PASS
