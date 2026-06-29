# team-leave — 비주얼 브리프 + 트렌드 감정

chosen: screens (원본) · 임계값 80 · 종합 점수 84 → 통과

---

## 1. 비주얼 레퍼런스 브리프 (빌드 전 · 점수 아님 · 빌드 입력)

team-leave 빌더용 비주얼 브리프 (점수 아님 · 빌드 입력). 방향 = 의도적 미니멀·전문 내부툴(Linear/Notion류), 라이트 모드 단일, 데스크톱 1280px+, 좌측 사이드 내비 + 다열 본문(테이블·캘린더·폼), 한국어 UI. 핵심 명령: "장식을 더하지 말고 위계·여백 리듬·타이포 스케일·깊이·마이크로 인터랙션으로 충실도를 올려라." 미니멀은 빈약함이 아니다 — 이미 만들어진 tokens.css(2단 primitive→semantic, gray 50~900 램프·indigo 액센트·상태색·shadow-xs~lg·sp 스케일·fs 스케일)를 *전부 실제로 써서* 표면에 리듬을 만든다. wireframey(렌더가 "와이어+색칠")를 피하는 게 1번 목표다.

[전역 셸 — Linear 2025 리디자인 근거]
- 크롬(사이드바+상단바)은 "조용하게", 본문은 "또렷하게": 사이드 내비 배경은 --color-surface-alt/--gray-50, 텍스트는 --color-text-muted, 활성 항목만 --color-text + --color-primary-soft 배경 pill. 본문 영역은 흰 --color-surface + --color-text(가장 진함). 즉 chrome을 한두 단계 디밍해 콘텐츠가 우선되게(Linear가 사이드바를 "a few notches dimmer"로 낮춘 그 원리).
- 사이드 내비 폭 ~240px 고정, 항목 높이 ~34~36px, 아이콘 16~18px + 라벨 --fs-sm(13px) --fw-medium, 아이콘과 라벨 수직·수평 정렬을 칼같이(Linear가 가장 공들인 부분). 섹션 그룹 라벨은 --fs-xs(12px) --color-text-subtle uppercase-ish caption.
- 상단바: 페이지 타이틀(--fs-h1 22px 또는 h2 18px) + 우측에 역할 전환 셀렉터·알림 뱃지·프로필. 헤더 액션 위치를 화면마다 일관되게(Linear가 고친 "예측 가능한 위치").

[밀도·여백 리듬 — wireframey 탈출의 핵심]
- 4/8 기반 sp 스케일(이미 토큰에 있음)을 위계적으로: 카드 내부 padding --sp-5/--sp-6(20~24px), 카드 간 gap --sp-4/--sp-5, 섹션 간 --sp-8(32px). 균일 16px 패딩만 깔면 와이어처럼 보인다 — 밀도를 *다르게* 줘서 그룹이 보이게.
- 본문 최대폭을 두되(예: 대시보드 1120~1200px 컨테이너) 넓은 폭에서 다열 그리드(2~3열 위젯)로 채운다. 빈 우측 여백 방치 금지(1280px+ 무파손, G4).
- 정보 밀도와 스캔성 균형: "5초 안에 핵심 파악"되게 1차 정보(카운트·상태·CTA)를 시각 위계 최상단에.

[타이포 위계 — 스케일을 실제로 쓰기]
- fs 스케일 6단(28/22/18/15/14/13/12)을 화면당 최소 3~4단 사용. 숫자 메트릭(잔여 일수·대기 카운트)은 --fs-display(28px) --fw-bold로 크게 — 대시보드의 "주연". 라벨은 --fs-xs/sm --color-text-muted. 본문 테이블은 --fs-body(14px) --lh-body. 위계 없이 다 14px면 와이어.
- --fw 4단(400/500/600/700) 적극: 헤더 600~700, 강조 메트릭 700, 라벨 500, 본문 400. 색이 아니라 weight+size로 위계.

[Elevation·깊이 — "flat + border" 미니멀 원칙]
- 미니멀은 그림자 남발이 아니다. 카드/패널은 기본 1px --color-border + --shadow-xs(거의 안 보이는). 떠야 하는 것만 위로: 드롭다운/팝오버 --shadow-md, 모달 --shadow-lg + 오버레이. elevation 레벨 0(본문)→1(카드)→2(팝오버)→3(모달) 4단으로 제한.
- "두 레이어가 의미가 다르면 다르게 보이게" — soft shadow만으로 구분하지 말고 배경색(surface vs surface-alt)·border·여백을 같이 써라. 떠 있는 느낌 내려면 다중 그림자(이미 shadow-sm/md가 2겹) 활용.
- 글래스모피즘·강한 그라데이션·네온 글로우 금지(off-brief). 깊이는 "절제된 그림자 + 경계 + 표면 톤차"로만.

[색 운용 — 거의 모노크롬 + 단일 액센트]
- 차분한 회색 위계가 일을 다 한다 + indigo 액센트 1개 + 상태색은 "의미가 있을 때만". CTA·활성·링크에만 --color-primary. 장식적 색칠 금지.
- 상태/종류는 색만이 아니라 색+텍스트(+아이콘/점)로(G3, WCAG AA). 상태 태그(대기/승인/반려/취소)는 옅은 배경(--color-*-bg) + 진한 텍스트(--color-*) pill, 작은 점/아이콘 병기. 캘린더 종류 색 바도 라벨 병기 + 범례.

[데이터 테이블 — 승인 큐·내 신청·멤버(근거: 엔터프라이즈 테이블 가이드)]
- 행 높이 밀도: regular ~48px(condensed 40 / relaxed 56). 셀 수직 패딩으로 호흡. 헤더 행은 --color-surface-alt 배경 + --fs-sm --fw-semibold --color-text-muted, sticky.
- 행 구분은 1px 옅은 border(--color-border)가 "배경에 녹아드는" 방식 — zebra 줄무늬 금지(hover/selected/disabled 상태와 충돌해 회색 3겹 혼란).
- 정렬: 텍스트 좌측, 숫자(일수·잔여) 우측(가능하면 tabular-nums). 헤더 정렬 = 셀 정렬 일치.
- 행 hover에 --color-surface-alt 미묘한 배경 변화(넓은 행 시선 추적). 행 액션([상세]/[승인]/[반려])은 hover 시 표면화하거나 항상 보이되 저채도. 선택 체크박스는 hover 힌트.
- 빈 큐/빈 목록은 placeholder가 아니라 다음 행동 CTA가 있는 인터랙티브 빈 상태.

[폼·마이크로 인터랙션 — 신청 폼·모달(근거: 폼 마이크로인터랙션 2025)]
- 인라인 검증은 blur 시점("reward early, punish late"): 성공/계산 피드백은 입력 즉시, 에러는 필드 떠난 뒤. 잔액 미리보기 패널은 입력에 실시간 반응(일수·대기·예상잔여 갱신) — 이 라이브 계산이 hi-fi 느낌의 핵심.
- 상태 변화에 짧은 트랜지션(--dur 200ms --ease, 이미 토큰): 토글(반차 오전/오후)·탭 전환·승인 시 행 상태 변화·뱃지 카운트 감소에 미세 모션. 체크마크/상태 전환 애니메이션이 만족도↑.
- 포커스 링·hover·active·disabled 상태를 *전부* 디자인(죽은 듯 보이는 정적 컨트롤 금지). 버튼 hover는 --color-primary-hover, 포커스는 또렷한 ring.
- 에러 메시지는 구체적·해결 안내형(잔액 초과·기간 역순·겹침). 빈 사유 시 반려 제출 비활성(시각적으로 명확).

[캘린더 — SC5(근거: Timetastic 색코딩 월 그리드)]
- 월 그리드, 셀=날짜 안에 종류별 색 바+라벨(B7 채택). 색 범례 항상. 같은날 부재 N명 카운트·대기 건 위젯. 셀 클릭→상세. 오늘 셀 강조, 주말 톤 다운. 부재 0인 달도 깔끔한 빈 그리드.

### 채용 패턴 (build-in)
- 전역 셸: 사이드 내비를 디밍(--gray-50 배경·muted 텍스트), 본문은 흰 surface·가장 진한 텍스트 — chrome을 한두 단계 낮춰 콘텐츠 우선 (Linear 2025)
- 사이드 내비 ~240px 고정, 항목 34~36px, 아이콘 16~18px+라벨 13px/medium, 활성만 --color-primary-soft pill + --color-primary 텍스트, 정렬 픽셀 단위로 맞춤
- sp 스케일을 위계적으로: 카드 내부 20~24px, 카드 간 16~20px, 섹션 간 32px — 균일 패딩 금지(밀도 차이가 그룹을 만든다)
- 타이포 화면당 3~4단 사용: 핵심 메트릭 --fs-display 28px/bold, 페이지 타이틀 22px, 섹션 18px, 본문/테이블 14px, 라벨 12~13px/muted
- fw 4단 위계: 헤더 600~700, 메트릭 700, 라벨 500, 본문 400 — 색이 아니라 weight+size로 위계
- elevation 4단 제한: 본문 flat → 카드 1px border + shadow-xs → 팝오버 shadow-md → 모달 shadow-lg+오버레이 ('flat+border' 미니멀)
- 레이어 구분은 그림자만으로 X — 배경 톤(surface vs surface-alt)·border·여백을 함께(의미 다르면 다르게 보이게)
- 거의 모노크롬 회색 위계 + indigo 액센트 1개; primary 색은 CTA·활성·링크에만, 상태색은 의미 있을 때만
- 상태 태그(대기/승인/반려/취소)=옅은 배경 pill + 진한 텍스트 + 점/아이콘 병기(색만 의존 금지, WCAG AA)
- 테이블 행 높이 regular 48px, 헤더 행 surface-alt 배경 + sticky + 13px/semibold/muted
- 행 구분은 1px 옅은 border가 배경에 녹아드는 방식 — zebra 줄무늬 금지(hover/selected와 충돌)
- 정렬: 텍스트 좌측 / 숫자(일수·잔여) 우측(tabular-nums), 헤더 정렬=셀 정렬 일치
- 행 hover에 surface-alt 미묘 배경 변화 + 행 액션 hover 표면화/저채도, 선택 체크박스 hover 힌트
- 잔액 미리보기 패널이 입력에 실시간 반응(일수·대기·예상잔여 라이브 계산) — hi-fi 느낌의 핵심 인터랙션
- 인라인 검증 'reward early, punish late': 계산/성공은 즉시, 에러는 blur 후; 반려 사유 빈칸 시 제출 비활성
- 상태 변화에 200ms ease 트랜지션: 반차 토글·탭·승인 행 변화·뱃지 카운트 감소·체크마크에 미세 모션
- 모든 컨트롤의 hover/active/focus/disabled 상태 디자인(또렷한 포커스 ring) — 정적 컨트롤 금지
- 캘린더: 셀=날짜 안 종류별 색 바+라벨, 범례 상시, 같은날 부재 N명·대기 위젯, 오늘 강조·주말 톤다운, 부재 0 달도 깔끔한 빈 그리드
- 빈 상태는 placeholder가 아니라 다음 행동 CTA가 있는 인터랙티브 모먼트(신청 0·큐 0·잔여 0·알림 0)
- 대시보드 위젯은 넓은 폭을 2~3열 그리드로 채움(우측 빈 여백 방치 금지, 1280px+ G4 무파손)

### 레퍼런스
- Linear (2025 리디자인) — 디밍된 사이드바 vs 또렷한 콘텐츠, 워머 그레이·LCH 색, 압축된 헤더/탭, 정렬 정밀도, elevation 단계
- Notion — 차분·정돈된 정보 우선 표면, 절제된 색·명료한 1차 액션(인테이크 레퍼런스)
- Timetastic — 색코딩 월 그리드 'wall chart' 팀 부재 한눈에, 미니멀 단순함(팀 캘린더 SC5 직접 레퍼런스)
- Vacation Tracker — 인터랙티브 leave 캘린더·종류별(연차/병가/경조사) 색 구분·승인 워크플로우(휴가툴 IA 레퍼런스)
- Atlassian Design / 일반 디자인 시스템 elevation — 0~5 제한된 레벨, flat content는 0, 카드 1, 팝오버 2 (절제된 깊이)
- 엔터프라이즈 데이터 테이블 UX(Pencil & Paper) — condensed 40/regular 48/relaxed 56 행 높이, 숫자 우측·monospace, 행 hover, 선택 시 액션 표면화

### 안티패턴 (피할 것)
- 와이어에 색칠(wireframey) — 균일 16px 패딩·전부 14px·border만 있고 위계/여백 리듬/타이포 스케일/깊이 없는 평평한 표면. 가장 피해야 할 1번
- 트렌드 추종으로 미니멀 의도 배신: 글래스모피즘·강한 그라데이션·네온 글로우·과한 그림자·일러스트 — off-brief
- 그림자 남발 / 모든 카드가 떠 보임 — 미니멀은 'flat + 옅은 border', 떠야 하는 것만 위로
- zebra 줄무늬 테이블 — hover/selected/disabled 상태와 충돌해 회색 3겹 혼란
- 색만으로 상태/종류 구분(텍스트·아이콘·범례 없이) — WCAG AA·색맹 위반(G3)
- 정적인 죽은 컨트롤: hover/focus/active 상태 없음, 라이브 계산 없는 잔액 미리보기, 모션 0
- 균일·단조 타이포(전부 같은 size/weight) — 핵심 메트릭과 라벨이 시각적으로 안 갈림
- 1280px+ 넓은 폭에 1열만 깔고 우측 거대한 빈 여백 방치(밀도 빈약·G4 위반)
- 정보 과밀의 반대 함정도 금지: 빈약한 표면(위젯 1개·테이블 2행)으로 thin하게 — 시드 데이터로 현실적 밀도 채우기
- 에러를 입력 중 즉시 때리기(punish early) — blur 후로; 반대로 성공/계산 피드백을 지연시키지 말 것
- 브랜드 단어 토큰명·primitive 직접 참조 — 컴포넌트는 semantic 토큰만 사용(이미 tokens.css 규약)

### 브리프 출처
- https://linear.app/now/how-we-redesigned-the-linear-ui
- https://blog.logrocket.com/ux-design/linear-design/
- https://linear.app/now/behind-the-latest-design-refresh
- https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables
- https://www.setproduct.com/blog/data-table-ui-design
- https://blog.logrocket.com/ux-design/data-table-design-best-practices/
- https://designsystems.surf/articles/depth-with-purpose-how-elevation-adds-realism-and-hierarchy
- https://atlassian.design/foundations/elevation
- https://blog.logrocket.com/ux-design/shadows-ui-design-tips-best-practices/
- https://www.uxpin.com/studio/blog/ultimate-guide-to-microinteractions-in-forms/
- https://jansensan.net/blog/forms-should-validate-according-user-action
- https://www.eleken.co/blog-posts/empty-state-ux
- https://timetasticapp.com/
- https://vacationtracker.io/
- https://medium.com/@allclonescript/20-best-dashboard-ui-ux-design-principles-you-need-in-2025-30b661f2f795
- https://5of10.com/articles/dashboard-design-best-practices/

---

## 2. 트렌드 감정 (빌드 후 · 렌더 스크린샷 기반 0~100)

대상: screens (원본) · 종합 점수 **84** / 임계값 80 → **통과** (리디자인 불필요)

### 화면별 점수·지적

| 화면 | 점수 | 리디자인 | 지적 |
| --- | --- | --- | --- |
| login.html | 88 | 불필요 | 분할 레이아웃이 제대로 산다 — 좌측 가치제안 패널(체크 3종)+하단 통계(128/24/3), 우측 로그인 폼+역할 시연 세그먼트 컨트롤+데모 입장. '실 인증 없음' 고지까지. 실제 제품 진입 화면의 깊이. 와이어+색 아님. |
| home.html | 87 | 불필요 | role-aware 대시보드. 4개 KPI 카드(내 잔여=미니 프로그레스바, 신청상태=상태태그, 다가오는 휴가, 팀 부재=아바타) + 하단 2열(내 신청 내역 테이블/팀 부재 미리보기 아바타 리스트). 정보 밀도·위계 양호. 약간 빽빽하나 내부툴로 적정. |
| request.html | 88 | 불필요 | 번호 매긴 스텝 섹션(종류·기간·사유), 종류 카드 선택상태 표현, 날짜 피커, 우측 실시간 잔액 미리보기 패널(프로그레스바+제출후 잔여), 검증 성공 배너, 알아두기 패널. 폼 충실도 높음. |
| approvals.html | 72 | 권고(미실행) | 가장 약함. 진짜 audit 테이블이지만 셀이 비좁아 줄바꿈이 지저분 — '신청자'(아바타+이름+팀 어색하게 스택), '기간'(7/21~ 월~ 세로로 깨짐), '사유' 잘림. 행 높이 불균일(48~56px 클린 밀도 위반). 액션 버튼(상세/승인/반려) 흐리고 작음. 테이블 폭이 우측 위젯 대비 좁아 압축됨. 우측 '이번 주 승인 현황' 위젯은 좋음. |
| calendar.html | 85 | 불필요 | 진짜 월 그리드 — 셀 내 종류별 색 바+이름/아바타, 월 이동·필터, 우측 위젯 4종(같은날 부재·내 승인 대기·다가오는 부재·범례). 색맹 안전(범례+라벨 병기) 준수. 셀이 다소 성기나 정당한 캘린더. |
| balance.html | 86 | 불필요 | 종류별 카드에 프로그레스바·사용률%·소멸 D-day 배지·소진완료(100%) 등 상태 충실. 상단 요약 행(총 부여/사용/대기/잔여)+'승인 대기 포함 확정 전' 경고. 읽기 중심인데도 밀도·상태 표현 풍부. |
| requests.html | 88 | 불필요 | 상단 KPI 요약 카드(색 좌측 보더), 신청 테이블+상태 태그, 우측 상세 패널에 상태 이력 타임라인(색 점 타임라인: 제출→대기→완료, 타임스탬프·처리자), 취소 액션. 매우 완결적. |
| notifications.html | 86 | 불필요 | 시간 그룹(오늘/이번 주), 색 좌측 보더 카드, 종류 태그(승인됨/요청/리마인더/반려), 안읽음 점·카운트, 인라인 액션(읽음/이동), 타임스탬프. 일관 체계. |
| members.html | 84 | 불필요 | KPI 카드 3종, 직원 테이블(아바타·팀·역할 배지·입사일·부여기준·현재잔여), '부여 미설정' 경고 플래그·잔여 0일 빨강, 행 액션, 하단 링크 카드 2종. 다만 액션 열(부여 시드 편집/팀/승인자)이 비좁아 압축됨. |
| settings.html | 85 | 불필요 | 프로필 카드+RBAC 주석 단 정보 행, 세션 카드(상태 점·접속 시각·로그아웃), 환경설정 토글에 [범위 밖] 라벨 일관 표기(의도적 읽기 전용 셸 정직하게 표현), 멤버 관리 이동 안내. 셸로서 충실. |

### 종합 비평

방향(미니멀·전문 내부툴 / Linear·Notion / 데스크톱 1280px+ / 라이트 / 정보밀도·상태태그·RBAC) 안에서의 완성도는 높다. 10개 화면 전부 렌더가 '와이어+색' 단계를 명확히 넘어선 하이파이다 — 깊이(그림자·표면 분리), 여백 리듬, 타이포 위계(display→h1→body→caption), 마이크로 디테일(프로그레스 바, 색 점 audit 타임라인, 아바타 색 코딩, 상태 태그 색+텍스트 병기=색맹 안전)이 실제로 픽셀에 살아있다. 공통 셸(좌측 섹션 내비 + 역할 전환 셀렉터·알림 뱃지·아바타 상단바)이 전 화면 일관되고, 토큰 규율(인디고 액센트·중립 램프·시맨틱 상태색)이 렌더에 그대로 반영된다. 빈/검증/에러 상태(소진 완료·부여 미설정·검증 성공 배너·[범위 밖] 라벨)도 회피 없이 그려져 honor-system 구멍이 적다.

결정적 약점은 단 하나로 집중된다: 승인 큐(approvals) 테이블의 셀 밀도. 업계 표준(표준 행 48~56px, 컴팩트 40~44px의 클린 단일 높이)과 달리 '신청자'(아바타+이름+팀)와 '기간'(7/21~ / 월~ 세로 분해)이 셀 안에서 줄바꿈되며 행 높이가 들쭉날쭉하고 사유가 잘린다. 테이블 폭이 우측 위젯에 눌려 좁아진 게 원인으로 보인다 — 가장 핵심 업무 화면(팀장 승인 루프)이 시각적으로 가장 거칠다. members 액션 열, 일부 카드의 과한 색 좌측보더 남용도 미세하게 Linear류의 절제에서 벗어난다(장식 최소 원칙 대비 약간 화려). 그 외엔 방향 정합·완성도 모두 양호.

off-brief 항목 없음 — 방향 교체는 권고하지 않으며, 위 점수는 전부 '이 방향 안에서의 마감 품질'만 본 것이다.

### 권고 (리디자인 시 우선순위)

1. (최우선) approvals 테이블 행 밀도 정상화 — 셀 내 세로 줄바꿈 제거. 단일 고정 행높이(48~56px) 적용, '기간'은 한 줄(7/21(월)~7/23(수)) 또는 2줄 고정 포맷으로 통일, '신청자'는 아바타+이름 한 줄/팀은 보조텍스트 한 줄로 고정. 테이블 폭 확보(우측 위젯을 접거나 테이블을 풀폭으로) 후 사유 말줄임(…)+툴팁.
2. approvals 행 액션(상세/승인/반려) 대비·크기 강화 — 현재 흐려서 핵심 액션이 약함. hover 시 노출 또는 명확한 버튼 위계(승인=primary, 반려=danger 아웃라인).
3. members 액션 열(부여 시드 편집/팀/승인자) 압축 해소 — 케밥 메뉴 또는 hover 액션으로 정리.
4. 카드 좌측 색 보더의 빈도 절제 — Linear/Notion 절제 톤에 맞춰 KPI/알림 카드 중 일부는 중립 보더로, 색 강조는 상태가 본질인 곳에만.
5. calendar 셀 색 바 처리 일관화(이름 말줄임·바 높이 통일)로 그리드 리듬 강화. 이 5건(특히 1~2)만 잡으면 평균 88~90 수준.

### 감정 출처
- https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables
- https://stephaniewalter.design/blog/essential-resources-design-complex-data-tables/
- https://medium.com/@calee607/data-table-design-guidelines-for-enterprise-applications-40f7ef0e0186
- https://www.eleken.co/blog-posts/table-design-ux
- https://medium.com/@CarlosSmith24/admin-dashboard-ui-ux-best-practices-for-2025-8bdc6090c57d
- https://www.rippling.com/blog/leave-management
- https://www.leapsome.com/blog/leave-management

---

## ⚠ 자동 저하(degraded)

- chosen(screens) 독립 검증 FAIL/미완 — lint-verify가 막는다(사람/재실행 필요)
