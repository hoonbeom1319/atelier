# _smoke — PRD 독립 비평 (plan §C / prd-critic) — 도구 검증용 더미

비평가: prd-critic (독립 서브에이전트) — 작성자·메인과 다른 컨텍스트
대상: projects/_smoke/PRD.md

> **영구 회귀 픽스처** — `scripts/lint-prd-review.js`가 의도대로(채워진 비평 산출물 green)
> 동작하는지 지킨다. 차원 누락·RESULT FAIL·비평가 미기재를 일부러 만들면 red가 나야 한다.

## 차원별 판정

| 차원 | 판정 | 근거/지적 |
|---|---|---|
| measurable | ok | 더미 — 지표 정량화됨 |
| justified | ok | 더미 — 기능마다 사용자 문제 연결 |
| prioritized | ok | 더미 — MVP/나중 구분 |
| dataCoherent | ok | 더미 — 데이터 모델이 기능 덮음 |
| consistent | ok | 더미 — 지표→기능→흐름→화면 추적 |
| assumptionsSurfaced | ok | 더미 — 가정 §11에 노출 |
| scoped | ok | 더미 — Out of Scope 분명(범위 안 부풀음) |
| surfaceComplete | ok | 더미 — 아키타입 table-stakes 화면(인증·홈·설정 등) §7에 있거나 §10 의도적 제외 명시 |

## 개정 지시 (FAIL이면)

- (없음 — 전부 ok)

## 종합

RESULT: PASS
