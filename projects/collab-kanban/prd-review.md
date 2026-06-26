# collab-kanban — PRD 독립 비평 (prd-review)

비평가: prd-critic (독립 서브에이전트, N=3 다수결) — 작성자·메인과 다른 컨텍스트
대상: projects/collab-kanban/PRD.md

> 모드: /forge(무인) §B. 작성자(PRD 초안)와 분리된 컨텍스트의 prd-critic 3명이 PRD.md를 적대적으로 7차원 감정했다. 차원별 판정은 다수결 집계다(voters=3, failVotes=1 → 종합 PASS). 아래 표는 다수결 결과이며, 그 아래에 비평가별 근거 요지와 워치(개정 반영) 노트를 둔다.

## 차원별 판정 (N=3 다수결)

| 차원 | 판정 | 근거/지적 |
|---|---|---|
| measurable | ok | §2 G1~G6이 전부 정량값·통과 기준·측정 시점을 보유한다. 죽은컨트롤 0(G1), 7개 필수 상태 100%(G3), WCAG AA 4.5:1/3:1 양모드(G4), 1280/1440px 가로스크롤 0(G5). 전부 검증 하니스(Playwright 1·2층, a11y)에 실제로 걸리는 지표다. 행동형 KPI(DAU·리텐션)는 측정 인프라 부재를 근거로 명시 배제하고 그 판단을 D2에 guess로 정직히 노출. G6(멀티유저 가시성)이 가장 정성적이나 아바타 스택·담당자 필터·활동 로그라는 검증 가능 산출물 + 측정 시점(6단계)에 묶여 통과. |
| justified | ok | F1~F9 각각 "근거" 라인이 인테이크/시장조사로 추적되고, 엣지케이스가 "없으면 무엇이 깨지나"에 답한다. F8(Viewer 읽기전용)·F9(테마)도 "없으면 협업 가시성/톤이 미완결"이라는 논리로 정당화됨. |
| prioritized | ok | P0(F1~F9) / P1(멀티보드·WIP·다중담당자·undo/아카이브·우선순위·알림센터·댓글 resolve) / §10 범위 밖이 실질적으로 분리됨. "전부 MVP" 아님 — 실제 컷이 존재하고 뺀 것마다 사유가 붙는다. |
| dataCoherent | ok | F1~F9가 쓰는 데이터를 §5 엔터티가 전부 덮는다(F1→columnId/position, F2→Card N:M Member, F4→Comment·Activity, F6→Label+dueDate/dueComplete, F8→Member.role). 필터=파생 뷰(데이터 추가 없음), 멘션=body 파싱(별도 관계 없음) 명시. 고아 엔터티/누락 데이터 없음. Comment.resolved 부재가 F4·§6·§4-2 전반에서 일관되게 P1 이관으로 처리됨. |
| consistent | ok | 지표→기능→흐름(§6)→화면(§7) 추적이 성립한다. G2→F1→드래그 상태→SC1.4, G3 7상태→SC3 7항목 일치, G4→F9→테마 흐름→SC1 헤더 토글. 화면 없는 기능/기능 없는 화면/안 받쳐지는 지표 없음. |
| assumptionsSurfaced | ok | §11이 A(사용자 전제)/B(근거 승격)/C(디자인 검수 보류)/D(guess)로 구조화됐다. 보드 규모(D1)·행동 KPI 거부(D2)·D-카운트다운(D3)을 fact가 아닌 guess로 라벨하고, 댓글 resolve를 본문 단정 대신 P1로 이관. 본문 "근거 있는 결정" 표현은 grounded인 곳에만. (워치 → 아래 노트: 1/3 비평가가 plan-decisions.md 부재로 B1~B7 추적성을 지적 → 개정에서 plan-decisions.md 생성으로 해소.) |
| scoped | ok | §10 Out of Scope가 광범위·명시적(실시간·멀티보드·WIP·체크리스트·간트·AI·첨부·모바일·다국어·분석). 작성자가 우선순위 마커·WIP·스윔레인·체크리스트를 정보밀도 이유로 능동 컷. F8/F9는 사용자 요청(A1)·완결성 근거의 단일 variant 범위 내로 부풀림 아님. |

## 비평가별 요지

- **비평가 1/3 — PASS.** 7차원 전부 ok. 적대적으로 봤으나 지표가 전부 검증 하니스에 걸리고(G1 죽은컨트롤0·G3 7상태·G4 WCAG·G5 px), 행동형 KPI는 측정 인프라 부재로 명시 배제됨을 확인. dataCoherent에서 필터=파생뷰·멘션=body 파싱이 데이터 추가 없음으로 명시돼 빈틈 없음. 워치(ng 아님): G6 멀티유저 가시성이 가장 정성적이나 구체 컴포넌트(아바타스택·담당자필터·활동로그)+측정 시점(6단계)으로 검증 가능 수준 → 그대로 PASS 권고.

- **비평가 2/3 — PASS.** 7차원 전부 ok. F1~F9가 §5 모델로 전부 받쳐지고(드래그=columnId/position, 담당자=N:M, 댓글/활동=Comment·Activity, 뷰어=Member.role), Comment.resolved 부재가 일관되게 P1 이관. 적대적 관찰(차원을 ng로 떨구진 않음): PRD가 §1·§4에서 "시장조사 근거/grounded"를 반복 인용하나 plan-decisions.md가 실재하지 않음(추적성 약점) → forge 인라인 생성 근거라면 plan-decisions.md로 기록 권장. B1~B7이 confidence 라벨로 정직히 표기되고 약한 것은 guess로 분류돼 assumptionsSurfaced를 ng로 떨구진 않음.

- **비평가 3/3 — FAIL (assumptionsSurfaced 1개 ng).** 나머지 6차원 ok. §11의 A/B/C/D 분류 자체는 모범적이나, 본문 §1·§4·§5·§8·§11-B가 "시장조사 결과 1:1 일치", "명시적 충돌 없음", "모든 경쟁 도구 관례", "confidence grounded"를 확정 사실처럼 반복 단정하는데 그 근거를 담을 `plan-decisions.md`가 프로젝트 폴더에 부재 → B1~B7의 "grounded" 신뢰도가 뒷받침 아티팩트 없는 미검증 단정("본문에 숨은 미검증 단정")이라고 지적. 개정 지시: (1) plan-decisions.md를 실제 생성해 출처와 함께 기록하거나 본문 "grounded"를 가정으로 강등; (2) "1:1 일치/충돌 없음"은 출처 박거나 표현 약화; (3) 00-flow.md 부재 시 §8의 1280px+ 명시를 design 전제로 표기.

## 개정 반영 (revision applied)

- 종합 다수결은 **PASS**(2 PASS / 1 FAIL)이나, 소수 의견(비평가 3)과 비평가 2의 워치가 같은 약점(plan-decisions.md 부재 → B1~B7 추적성)을 지목했으므로 개정에서 해소했다.
- **plan-decisions.md를 실제로 생성**했다(시장조사 3축 × 질문별 출처 URL·답·confidence). §11-B의 "1:1 일치/충돌 없음/모든 경쟁 도구 관례"가 이제 plan-decisions.md의 출처(Trello REST 객체 정의·Linear 보드/개념 모델 문서·Atlassian·Wrike·LogRocket UX 등)로 추적된다 → B1~B7의 "grounded"가 뒷받침 아티팩트를 얻어 미검증 단정이 아니게 됨.
- 00-flow.md(§8 1280px+ 명시)는 design 단계 산출물이므로 PRD §8·§11에서 이미 "/design 인테이크에서 명시"로 design 전제임을 표기 → 합의본 부재가 단정이 아닌 전제로 닫힘.

RESULT: PASS
