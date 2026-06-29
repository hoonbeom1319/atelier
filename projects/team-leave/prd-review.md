# team-leave — PRD 독립 비평 (prd-review)

비평가: prd-critic (독립 서브에이전트, N=3 다수결) — 작성자·메인과 다른 컨텍스트
대상: projects/team-leave/PRD.md
집계: **개정 재비평 — 비평가 3명 / PASS 3명(만장일치) → 종합 PASS.** 직전 라운드에서 소수의견으로 ng였던 두 load-bearing 차원(dataCoherent / consistent)을 개정 후 3명 모두 "결함 닫힘"으로 검증. 전 8차원 ok.

> 이력: 1차 비평은 차원별 다수결은 전 차원 ok였으나 비평가 2명이 각각 서로 다른 load-bearing 차원(dataCoherent / consistent)을 ng로 지적해 개정 게이트에 걸림. forge-design workflow의 자동 개정 1회 후에도 FAIL이 남아, §0 안정성 계약에 따라 메인이 지적 2건을 해당 섹션만 외과적으로 보정(§5 BalanceAdjustment 엔터티 추가 / SC2 HR 뷰 + ←F# backing) → 별도 컨텍스트 prd-critic 3명 재비평 → 만장일치 PASS.

---

## 차원별 판정 (8차원, 다수결 — 재비평)

| 차원 | 판정 | 근거 |
|---|---|---|
| measurable | ok | O1~O4 정량 임계값·분모정의·기준선(도입 전 4주)·측정주기. 디자인 단계 합격선은 G1~G5로 분리. 미실측 운영수치는 §11 B1 guess로 강등. |
| justified | ok | F1~F8 각자 사용자 MVP 항목 또는 표준 골격 prerequisite로 정당화. F8은 "없으면 핵심 루프가 시드 없이 빈다"로 load-bearing P0 논증. F5는 인앱 개념으로 축소. |
| prioritized | ok | P0(F1~F8)/P1(§4-2: 다단계승인·누적엔진·공휴일·연뷰·실알림 등)/범위밖(§10) 경계가 실제로 그어짐. "다 MVP" 없음. |
| dataCoherent | **ok (개정으로 닫힘)** | 직전 공백(HR 부여 시드 변경 이력을 담을 엔터티 부재)이 **BalanceAdjustment**(targetUserId·leaveTypeId·year·field[total/balanceBasis]·old/newValue·actorId·actedAt·reason) 추가로 닫힘. F8(b) 시드 설정·엣지④ 변경 이력·F8(d) 전사 감사를 커버. 관계(User 1:N BalanceAdjustment)·불변식(→LeaveBalance/User, used+pending 미침범·소급 무훼손) 명시. 8엔터티가 F1~F8 전부 덮고 고아 없음. (3명 모두 닫힘 확인. 비-load-bearing nit: F8(c) 팀/승인자 재배정은 원장에 안 담기나 §9가 그 감사를 요구한 적 없음 — 결함 아님. balanceBasis 필드 위치 슬립은 불변식 명확화로 보정 완료.) |
| consistent | **ok (개정으로 닫힘)** | 직전 공백(SC2가 직원/관리자 2뷰만 명세 → HR 홈 누락, role-routing의 §4 backing 부재)이 **SC2에 HR(R3) 뷰 + 위젯별 (←F#) backing 주석** 추가로 닫힘. §2 지표→§4 기능→§6 흐름→§7 화면 추적이 양방향 성립. F1~F8 전부 화면에 매핑, 화면 없는 기능·기능 없는 화면 없음. SC2(compose-shell)·SC10(read/session shell)은 의도적 셸로 명시. (3명 모두 닫힘 확인.) |
| assumptionsSurfaced | ok | §11 A1~A7 가정 / B1~B8 추측이 본문 단정과 분리. 운영수치·종류세트 등 미검증분이 본문에서 사실로 단정되지 않음(§2 ⚠ 주석으로 보정 명시). |
| scoped | ok | 부풀림 없음. §10 의도적 제외 12+항목. 사용자 미요청 기능 임의 확장 없음(BalanceAdjustment도 F8 엣지④ 감사 지원이지 신규 표면 아님). |
| surfaceComplete | ok | 아키타입=내부 SaaS admin. 진입(SC1)·role-aware 홈(SC2)·핵심툴(SC3~SC8)·설정 셸(SC10)·멤버 관리(SC9)·빈/첫 실행 전부 §7 default-IN. 로그인 UI는 그리고 백엔드만 §10 의도적 제외로 구분. 조용한 누락 없음. |

> 참고(ng 아님): plan-decisions.md의 시장조사 grounded 근거(반려 사유 필수·잔액 4분할·엣지케이스 5종 등)가 본문 "근거 있는 결정"과 일치함을 3명 모두 교차 확인. 운영 목표 수치(O1~O4)는 §11 B1에서 도입 후 4주 베이스라인 보정 대상으로 표면화됨.

---

RESULT: PASS
