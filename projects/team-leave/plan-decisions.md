# team-leave — 시장조사 근거 원장 (plan-decisions)

> forge §B(무인 기획): market-researcher 에이전트가 축을 나눠 병렬 웹검색으로 plan 질문을 근거화한 기록.
> 각 행: **질문 → 근거(출처 URL) → 답/권고 → 신뢰도(grounded/guess)**.
> 맨 끝 "§11 가정 교차참조"에서, 근거 확보 항목이 PRD 본문에서 **"가정" → "근거 있는 결정"으로 승격**된 지점을 표시한다.

조사 축 3개:
- 축1 — 휴가관리 SaaS 핵심 기능·승인 워크플로우 관례
- 축2 — 연차/휴가 데이터 모델·잔여 연차 계산·휴가 종류 표준
- 축3 — 내부툴 UX·승인 큐·팀 캘린더 패턴 및 목표 지표 수준

---

## 축1 — 휴가관리 SaaS 핵심 기능·승인 워크플로우 관례

요약: 사용자 MVP 5종(신청·승인/반려·잔여조회·팀캘린더·알림)은 업계 표준 코어와 정확히 일치하며 빠진 핵심 없음. 보강 권고: ①반려 사유 필수 ②반차/반반차 0.5/0.25일 ③pending/remaining 차감 타이밍 분리 ④엣지케이스 명시 ⑤신청 이력/감사 뷰.

| 질문 | 근거(출처) | 답/권고 | 신뢰도 |
|---|---|---|---|
| MVP 5종이 적절한가? 표준 코어 구성은? | rippling.com/blog/leave-management · vacationtracker.io/blog/7-best-pto-tracking-software-2025 · teambridge.com/blog/leave-management-system | 표준 코어=①셀프 신청 ②잔여 자동 추적 ③승인 워크플로우 ④공유 캘린더 ⑤알림 — 사용자 MVP와 정확히 일치, 빠진 핵심 없음. 다단계 승인·위임·정책 커스터마이징은 표준이나 MVP 범위 밖 타당. 권고: 단일 승인자 1단계로 시작하되 승인 단계를 별도 엔티티로 설계(확장 대비). | grounded |
| 승인 워크플로우 필수 요소·반려 처리는? | cflowapps.com/leave-request-approval-workflow-best-practices · shoplworks.com/blog-insight/annual-leave-approval-system... · paychex.com/articles/human-resources/managing-employee-pto | (1) 표준 요청 단순 승인, 규칙 초과만 에스컬레이션. (2) 승인자 부재 시 backup approver/위임(국내 샤플·다우오피스도 표준). (3) **반려 시 구체 사유 입력 필수**가 강한 관례. 권고: MVP 반려 사유 필수 필드. 다단계·SLA·자동 에스컬레이션은 향후 확장. 알림은 실발송 없이 UI 상태(읽음/뱃지·목록)로만. | grounded |
| 휴가 종류(leave_type) 모델 관례·한국 맥락은? | apps365.com/employee-leave-management-software · impactflow.kr/post/half-half-leave-management-software-comparison · guide.flex.team/ko/articles/10288153 | 보통 5~15종(적격성·기간·증빙·누적·이월 규칙). 한국 핵심=연차·반차(0.5)·반반차(0.25). 권고: MVP는 연차·반차·병가·경조사로 단순화, 단위=일+반차(0.5). leave_type은 enum이 아닌 설정 가능 마스터 데이터로 → HR 관리 화면과 연결. 신청 폼 코어=종류·기간·사유. | grounded |
| 잔여(balance)·누적·이월 모델, 차감 타이밍은? | apps365.com/employee-leave-management-software · help.planday.com/.../30554 · shoplworks.com/blog-insight/annual-leave-management-automation | 잔액은 승인/취소/수정 시 자동 갱신·셀프 실시간 확인. **차감 타이밍이 핵심**: 신청 시 pending 가차감 미리보기 → 승인 시 확정 차감. 한국 관례: 신청 시 가용 잔여 초과 불가(신청 단계 차단). 권고: 누적·이월 자동계산은 범위 밖(시드 고정값). **balance를 total/used/pending/remaining 4필드**로 모델링해 대기분 분리. | grounded |
| PRD가 반드시 다룰 엣지케이스는? | aaronhall.com/handling-overlapping-leave-requests · help.planday.com/.../30554 · day-off.app/how-to-avoid-overlapping-leave-requests | 표준: (1)기간 겹침 (2)잔액 초과 (3)승인 후 취소/수정 (4)반차/반반차 부분 차감 (5)승인자 부재 (6)과거/당일·0일/역순 검증. 권고 MVP 최소: ①본인 겹침 차단 ②잔액 초과 차단 ③승인 후 취소(잔액 복원) ④기간 유효성 ⑤반차 0.5일. 팀 단위 겹침은 캘린더 가시화만(자동차단 X). | grounded |
| 기록/감사(audit)·문서화 관례는? | cflowapps.com/leave-request-approval-workflow-best-practices · paychex.com/articles/human-resources/managing-employee-pto | "누가/무엇을/누가 승인/언제/어떤 종류로"를 수기 재구성 없이 추적. 취소·반려 건도 잔존시켜 이력 보존. 장기 휴가엔 인수인계 메모 관례. 권고: 신청별 상태 이력(신청→승인/반려→취소)+타임스탬프·처리자를 담는 상세/이력 뷰. 인수인계 메모는 범위 밖(사유 필드로 일부 대체). | grounded |
| 목표 지표의 현실 수준은? | rippling.com/blog/leave-management · shoplworks.com/blog-insight/annual-leave-management-automation | **직접 수치 못 찾음(추측).** 가치 제안=승인 누락 방지·추적 일원화·관리 부담 감소로 일관. 권고 지표: 승인 리드타임 단축·추적 일원화율·셀프조회율·미처리 건수. 내부툴이므로 성장지표 아닌 업무 대체율·처리 시간·정확성. 구체 수치는 조직별 기준 없어 추측. | guess |
| 사용자 답(A-2)과 조사의 충돌 여부? | rippling.com/blog/leave-management · cflowapps.com/leave-request-approval-workflow-best-practices | **충돌 없음.** 역할(직원/팀장/HR)·MVP 5종·데스크톱 우선·알림 개념화·실인증/실시간/결제 범위 밖이 모두 표준 코어와 정합. 조사는 경계를 대체하지 않고 디테일 보강(반려 사유·반차 0.5·pending 분리·엣지 5종·이력 뷰). | grounded |

## 축2 — 연차/휴가 데이터 모델·잔여 계산·휴가 종류 표준 (한국 근로기준법 맥락)

요약: 휴가 종류 6~7종 enum, leave_request + leave_balance(직원×종류×연도) + 승인 이력(원장) 3분할, 상태머신 pending→approved/rejected+cancelled, 자동 산정 엔진은 법적 복잡 → MVP는 HR 수동 시드, 표시 규칙만 구현.

| 질문 | 근거(출처) | 답/권고 | 신뢰도 |
|---|---|---|---|
| 휴가 종류 표준 분류는? | rule.kopo.ac.kr/.../lawFullScreenContent · namu.wiki/w/휴가 · bizforms.co.kr/magazine/view.asp?number=62794 · ggmj.kr/shiftee | 국내 표준=연차·반차·병가·공가·특별휴가(경조사). MVP enum 권고: 연차(차감)·반차(0.5, 오전/오후)·병가·공가(무차감)·경조사·무급. 반반차(0.25)는 법정 아님→선택. leave_type에 "잔여 차감 여부" 플래그가 관례. | grounded |
| 잔여 부여·계산의 법정 기준은? | shoplworks.com/blog-insight/annual-leave-korean-labor-law · labor.moel.go.kr/cmmt/calAnnlVctn.do · babywhale.io/blog/annual-leave-guide | 근로기준법: 1년 미만 월 개근 1일(최대 11), 1년·80%↑ 출근 15일, 3년↑ 2년마다 +1(최대 25). 부여일수 직원마다 11~25 범위. 미사용 소멸. 잔여=부여−사용−예약(승인 미래분). | grounded |
| 산정 기준(입사일 vs 회계연도)을 MVP에 넣나? | zuzu.network/.../annual-leave-calculation-method · shiftee.io/ko/blog/article/calculateAnnualLeave · shoplworks.com/.../fiscal-year-change... · help.wantedspace.ai/.../14162667323673 | 입사일·회계연도 혼용. 중도입사자 비례(15×재직일/365), 퇴직 시 입사일 기준 재계산 — 자동 엔진은 법적 복잡·검증 부담 큼. 권고: 자동 발생/소멸 엔진 범위 밖, HR이 부여일수·기준일 수동 입력/시드. 화면은 "잔여/부여/사용 + 기준 배지"만 표시. | grounded |
| 신청/승인 데이터 모델(엔티티) 관례는? | gist.github.com/0xTanvir/93f05c1b... · surfsidemedia.in/post/database-schema-for-employee-leave-management-system · medium.com/@rihab.beji099/...leave-management-system | LMS 스키마: employee/role/team/leave_type/leave_request/leave_balance/approval(이력). 핵심: 잔여를 days(소수, 반차 0.5)로. **신청과 잔여를 분리**해야 감사가능성·추적이 산다. 본 프로젝트는 "잔여 추적 불가"가 핵심 문제이므로 balance 분리 필수. | grounded |
| 승인 상태(status) 머신은? | guide.flex.team/8c5f6f72... · updatenotes.flex.team/ko/articles/10304037 · wehagohelp.zendesk.com/.../900006652206 · shoplworks.wixanswers.com/.../휴가-신청-승인하기 | 국내 HR SaaS: pending→approved/rejected + 신청자 cancelled. 다단계(최대 3) 지원하나 MVP 1~2단계 충분. 반려 시 즉시 종료, 승인 후 취소는 별도 흐름(잔여 복원). 권고 집합: pending/approved/rejected/cancelled(+선택 cancel_requested). **상태 전이 시 balance 동기화(승인=차감, 반려/취소=복원)가 핵심 불변식.** | grounded |
| 흔한 엣지케이스는? | shoplworks.com/.../annual-leave-korean-labor-law · bizforms.co.kr/.../62794 · shiftee.io/ko/blog/article/calculateAnnualLeave | ①잔여 부족(음수 방지) ②반차 0.5 차감(오전/오후) ③영업일 vs 달력일(한국은 영업일 일반) ④기간 중복 ⑤중도입사 비례 ⑥미사용 소멸 ⑦소급 신청 허용 여부 ⑧자기승인 방지 ⑨빈 상태(신청 0·큐 0·잔여 0). 모델이 음수 차단·중복 검사·0.5 단위 지원하게. | grounded |
| 잔여/대시보드 핵심 표시 지표는? | guide.flex.team/en/articles/10288450-annual-paid-leave-key-concepts · zuzu.network/.../annual-leave-calculation-method | 표준 표시: 총 부여·사용·잔여 + (선택)소멸 예정·D-day·사용률(%). 종류별 분해 관례. 팀 캘린더 핵심 위젯=오늘/이번주 부재 인원·대기 승인 건수. 구체 KPI 수치는 개념 단계라 정량 벤치마크 근거 없음(추측). | guess |

## 축3 — 내부툴 UX·승인 큐·팀 캘린더 패턴 및 목표 지표 수준

요약: 표준 IA는 사용자 default-IN과 일치(듀얼 대시보드+신청+승인 큐+팀 캘린더+잔여+설정/멤버). 승인 큐는 "내 액션 필요" 상단 고정·상태 태그·반려 사유 필수·캘린더 capacity 연동. 잔액은 거래 원장 방식이 정석. 목표는 활성률보다 행동지표가 현실적.

| 질문 | 근거(출처) | 답/권고 | 신뢰도 |
|---|---|---|---|
| 아키타입 표준 IA가 default-IN 골격과 맞나? | cflowapps.com/leave-management-process · uibakery.io/templates/employee-portal-dashboard · appsmith.com/use-case/leave-management-dashboard · help.sap.com/.../team-absence-calendar-ui | 사용자 답(로그인·홈/대시보드·신청·승인큐·팀캘린더·설정/프로필·멤버/팀)과 정확히 일치. 공통: 듀얼 대시보드(직원 self-service / 관리자 RBAC), 셀프서비스 진입, 공유 캘린더, audit trail. 권고: 홈은 role-aware 단일 라우트(역할별 위젯). **빈/첫실행(잔여 0·신청 0·큐 0)도 표준 골격에 포함** — 표면 빈약 방지. | grounded |
| 승인 큐(관리자) 표준 패턴은? | help.workforce.com/.../6953905 · cflowapps.com/leave-request-approval-workflow-best-practices · vacationtracker.com/blog/approving-or-rejecting-pto... · formaloo.com/blog/pto-approval-workflow | ①"내 액션 필요" 상단 고정 + 대기 상태 태그 ②행=신청자·종류·기간·신청일·사유·상태 ③인라인 승인/반려 + **반려 사유 필수** ④캘린더/capacity 연동으로 승인 전 충돌 사전 표면화. 권고 MVP: 필터 테이블(대기/처리됨 탭)+행별 승인/반려(사유 모달)+기간 팀 캘린더 미리보기. 자동승인·SLA·대리는 개념 라벨만. | grounded |
| 팀 캘린더/현황 UI 표준은? | team-absence.com/en/blog/leave-calendar-in-microsoft-teams · desktime.com/features/absence-calendar · leaveboard.com/vacation-calendar · apps365.com/.../absence-calendar-view | ①가용성 한눈 그리드 ②다중 뷰(월+연 평면) ③종류별 색 구분 ④겹침·피크·커버리지 스캔 ⑤팀 필터. 권고(데스크톱 1280px+): 월 그리드 기본(행=멤버 또는 셀=날짜에 색 바)+팀 필터+같은 날 N명 카운트. 연 평면 뷰는 2순위. 실시간은 개념(승인 시 정적 즉시 반영). | grounded |
| 데이터 모델 관례(잔액 추적·부분일)는? | gist.github.com/0xTanvir/93f05c1b... · learn.microsoft.com/.../hr-leave-and-absence-types · surfsidemedia.in/post/database-schema... · shiftee.io/en/blog | 정석: employees/leave_types(accrues·allows_partial_days 플래그)/leave_requests/leave_approvals/leave_balance_transactions(원장)+audit. **잔액=거래 원장(ledger) 방식**(amount +/−·source=accrual/request/adjustment, 현재 잔액은 합산 도출 — 감사·되돌리기 우월). 단위는 시작 시점 day vs hour 결정 후 일관. 한국 단위 1/0.5/0.25일. 권고(개념 MVP): 시드 데이터로 시연(실 백엔드 범위 밖). | grounded |
| 한국 관행 현실적 시드값은? | shoplworks.com/.../annual-leave-korean-labor-law · metapay.co.kr/blog/labor-issueletter-7th · zuzu.network/.../annual-leave-calculation-method | 데모 시드 현실값: 15일(1년·80%↑), 1년 미만 월 1일(최대 11), 3년↑ 2년마다 +1(최대 25). 단위 1/0.5/0.25일. 권고: "부여 15/사용 X/잔여 Y"+데모 직원에 11~25일 시드. 연차촉진/소멸은 개념 라벨(자동 알림은 범위 밖). | grounded |
| 흔한 엣지/예외 상태는? | aaronhall.com/handling-overlapping-leave-requests · help.crazehq.com/.../insufficient-leave-balance... · cflowapps.com/leave-request-approval-workflow-best-practices · kb.7shifts.com/.../34088242810643 | 도메인 표준 4종: ①기간 중복(제출 timestamp tiebreaker+경고) ②잔액 부족(차단/경고) ③팀 커버리지 미달(capacity<70% 플래그) ④승인자 부재(대리 라우팅, MVP 개념). +UI 상태: 취소/수정, 반려 후 재신청, 빈 큐, 잔여 0, 과거 날짜 차단. 권고: ①②는 MVP 실구현(가치 핵심), ③④는 시각 경고/개념 라벨. | grounded |
| MVP 경계·기능 우선순위 근거는? | cflowapps.com/leave-request-approval-workflow-best-practices · cflowapps.com/leave-management-process · slack.com/templates/time-off-request-process | 사용자 5개 MVP가 essentials와 정확히 일치. ①신청+②승인=핵심 가치 루프 P0, ③잔여 조회=self-service P0, ④팀 캘린더=충돌 판단 P0~P1, ⑤알림=상태 가시성 P1(인앱 개념). 범위 밖(실인증·실시간·결제·모바일1급·다국어)도 내부툴 MVP 관례와 부합. **충돌 없음.** | grounded |
| 목표 지표 현실 수준은? | payrun.app/blog/hr-software-rollout · peoplespheres.com/9-software-adoption-statistics... · biposervice.com/news/hr-app-adoption-rates... | 첫 분기 활성 70~80%가 롤아웃 벤치마크지만 **HRIS 평균 실사용은 32%(Gartner)** — 70~80%는 야심적 상한이지 default 아님. 자동화로 작업시간 최대 40%↓(McKinsey). 권고: 활성률 대신 행동지표 — (a)신청 소요시간 (b)승인 리드타임 (c)셀프 조회율 (d)시스템 경유율. 실측은 출시 후 — PRD엔 "목표"로만. | grounded |
| 내부툴 UX 톤(Linear/Notion류)이 적절한가? | medium.com/@CarlosSmith24/admin-dashboard-ui-ux-best-practices-for-2025 · medium.com/design-bootcamp/improving-the-approval-request-process... · cflowapps.com/leave-management-process | 사용자 톤(미니멀·전문·Linear/Notion·라이트·1280px+)이 admin/대시보드 관례와 부합. 권고 요소: ①RBAC 역할별 뷰 ②검색 가능 audit trail ③정보 밀도·스캔성 균형(테이블·상태 태그·카운트 뱃지) ④상태는 색+텍스트(색만 의존 금지·a11y). 데스크톱이라 테이블·다열·사이드 내비가 적합. (일부 일반 admin 베스트프랙티스 추론 — 추측 성격 일부.) | grounded |

---

## §11 가정 교차참조 — "가정" → "근거 있는 결정" 승격

> market-researcher 근거가 PRD §11의 어떤 가정을 본문 결정으로 끌어올렸는지(또는 여전히 추측인지) 매핑.

| §11 항목 | 상태 | 근거 출처(축) | PRD 반영 위치 |
|---|---|---|---|
| A5. 반려 사유 필수 · 잔액 4분할(total/used/pending/remaining) · 본인 겹침/잔액 초과 차단 | **가정 → 근거 있는 결정으로 승격** | 축1(승인 워크플로우·차감 타이밍·엣지) · 축2(상태머신 불변식) · 축3(승인 큐) | §1 설계 전제 · §4 F1/F2/F3 · §5 LeaveBalance·상태머신 |
| A4. 단일 승인자 1단계(다단계·위임 P1, 모델은 확장 대비) | **근거로 보강(타당 경계 확인)** | 축1·축2(다단계 표준이나 MVP 미루기 타당, 승인 단계 별도 엔티티 권고) | §4-1 F2 범위 · §4-2 · §5 Approval(step) |
| 휴가 종류 모델 = 설정 가능 마스터(LeaveType) + 차감 플래그 | **근거 있는 결정** | 축1·축2(enum 아닌 마스터 데이터 관례) | §5 LeaveType · §4-1 F1 |
| 잔여 산정 = HR 수동 시드(자동 누적/이월/소멸 엔진 범위 밖) | **근거 있는 결정(법적 복잡도)** | 축2(입사일 vs 회계연도 비례·소멸 복잡) | §4-1 F3 · §5 부여 산정 · §10 |
| 신청·잔여 분리(balance 분리) | **근거 있는 결정(필수)** | 축2·축3(감사가능성·추적) | §5 핵심 설계 결정 |
| 엣지케이스 5종(겹침·초과·취소 복원·기간 유효·반차 0.5) | **근거 있는 결정** | 축1·축2·축3(도메인 표준) | §4-1 F1 엣지 · §5 상태머신 |
| 빈/첫 실행 상태 표준 골격 포함 | **근거 있는 결정** | 축3(IA 표준에 빈 상태 포함) | §7 SC2/SC4/SC6/SC9 · S9 |
| B1. 운영 목표 수치(O1~O4) · 활성률 70~80% | **여전히 추측(guess) — 본문 단정 안 함** | 축1·축3(직접 수치 못 찾음, HRIS 32% Gartner로 활성률 강등) | §2 ⚠ 주석 · §11 B1 |
| B8. 휴가 종류 기본 세트(연차·반차·병가·경조사) | **추측(guess) — 조직별 가변(마스터로 흡수)** | 축1·축2(한국 표준 기반 권고) | §4-2 · §11 B8 |
| 잔액 모델 4필드 vs 트랜잭션 원장 | **결정 보류(원장이 우월하나 MVP는 4필드)** | 축3(ledger 방식 정석) | §5 주석 · §11 B4 |
