# _smoke — 독립 검증 (design §C step 5 / 하이파이) — 도구 검증용 더미

검증자: design-verifier (독립 서브에이전트) — 빌더·메인과 다른 컨텍스트
대상: screens/

> **영구 회귀 픽스처** — `scripts/lint-verify.js`가 의도대로(채워진 검증 산출물 green)
> 동작하는지 지킨다. 항목 누락·RESULT FAIL·화면 누락을 일부러 만들면 red가 나야 한다.

## 화면별 render-check

| 화면 | thin | bad | variantsIdentical | off-brief | deadControl | stateInert | 판정 |
|---|---|---|---|---|---|---|---|
| main.html | ok | ok | ok | ok | ok | ok | PASS |

## 재작업 지시

- (없음 — 전부 PASS)

## 종합

RESULT: PASS
