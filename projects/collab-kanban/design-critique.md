# collab-kanban — 트렌드 감정 (forge §C-6, design-trend-expert)

- 임계값: 80
- 종합 점수: 85 (원본, chosen=screens) — 임계값 상회, 리디자인 불필요
- 리디자인 여부: 아니오

## 화면별 점수

| 화면 | 점수 | 판정 |
|---|---|---|
| index.html (홈 대시보드) | 82 | 통과 (≥80) |
| board.html (제품 보드) | 88 | 통과 (≥80) |

## 화면별 지적

### index.html (홈 대시보드) (82)

방향(홈=대담) 부합·한국어 카피·셸 일관성 양호. 흠: ①강조 남용 — gradient-hero+widget bold-shadow+board-card bold-shadow+gradient 아바타/마크/활동dot이 한 뷰포트에 6~7곳 → '뷰포트당 aurora 1회' 현행 기준 위반, 위계 평탄화. --shadow-bold를 hero에만 두고 위젯은 한 단계 낮춰라. ②타이포 32→13px 2단 점프(중간 위계 공백). ③1440에서 max-width 1180+좌측정렬로 우측 여백 과다. 상태(드롭다운 aria-expanded·테마 aria-pressed)는 와이어드 정상.

### board.html (제품 보드) (88)

방향(보드=절제) 매우 충실 — 그라데이션 사이드바 1곳, 카드/필터 그레이 절제, 라벨칩만 풀컬러(AA 보정). 5컬럼이 2026 칸반 표준과 일치. G2/G3 상태 variant 7종 전부 명시(dragging/drop-target/빈컬럼/overdue/미배정/+1/뷰어). 통합 타임라인·@멘션칩·역할토글·테마토글 완결. 흠: ①드래그 가능 시각 신호가 hover lift뿐(grab 핸들 약함). ②boardhead가 h1 한 줄로 밋밋 — 셸 그라데이션과 톤 점프, 미세 강조로 연결 여지. ③index와 타이포 스케일 불일치(h1 26 vs 32, h2 14 vs 13).

## 종합 비평

방향 판정(off-brief 점검 먼저): brief가 택한 방향은 "Linear류 미니멀·차분"(PRD §8) + 사용자 피드백으로 명시 확장된 "앱 셸·홈 대시보드는 더 화려·대담하게"(00-flow §확장, PRD AX1/AX2)다. 즉 보드는 절제, 셸/홈은 대담 — 이 이원 방향을 기준으로 감정한다. 두 화면 모두 이 방향 안에 있다. board.html은 그라데이션을 사이드바 1곳에만 쓰고 카드·필터는 그레이로 절제, 라벨칩만 풀컬러(보정값 AA) — 정확히 "보드 절제" 의도에 부합. index.html은 hero 그라데이션 1개 + 위젯 카드 — "홈 대담" 의도에 부합. 방향 교체가 필요한 산출물이 아니다(권고도 하지 않음).

현행 기준 대조: 1280/1440 데스크톱 우선, 백로그·할 일·진행 중·검토·완료 5컬럼은 2026 칸반 표준(shadcn-kanban 기본열)과 1:1 일치. 통합 타임라인·카드 표면 정보 절제(제목·아바타·라벨·마감·댓글수)·상세 패널 하단 타임라인은 모두 경쟁도구 관례에 부합. 라벨칩을 흰 텍스트+풀컬러로 두고 토큰에 대비비(5.06~6.52)를 주석으로 명시한 것은 모범적. 다크 별도 페어 스케일 + 4단 elevation도 §8 요구를 충실히 이행.

방향 안에서의 완성도 흠(점수를 80대 중반에 묶는 이유):
1) [index hero — 가장 큰 흠] 현행 그라데이션 기준은 "뷰포트당 aurora 1회, 대시보드엔 자제, 그라데이션이 위계에 복무하지 않으면 장식 코스프레"다. index는 hero(gradient-hero) + 위젯 3개(--shadow-bold) + 보드카드 2개(--shadow-bold) + 사이드바 마크(gradient-brand) + 아바타(gradient-brand) + 활동 dot(gradient-brand)까지 그라데이션·강한 lift가 화면에 6~7곳 산재. "대담하게"는 brief가 허락했지만, 강조가 도처에 퍼지면 위계가 평평해진다(모든 게 떠 있으면 아무것도 안 뜬다). --shadow-bold(0 10px 30px)를 위젯·보드카드·hero에 모두 적용한 건 과함 — hero만 bold, 위젯은 --shadow-card 급으로 한 단계 낮춰 위계를 살려야 "대담하되 차분"이 성립.
2) [board boardhead — 위계] 보드 화면엔 hero가 없고 h1(26px) 한 줄뿐이라 index의 화려함과 톤 점프가 크다. 의도된 이원화이긴 하나 board 진입 시 셸의 강한 그라데이션 사이드바와 밋밋한 메인의 대비가 다소 급격 — 보드헤더에 미세한 강조(예: 보드 스워치/멤버 아바타 스택 요약)로 셸-메인 톤 연결을 부드럽게 할 여지.
3) [타이포 리듬] index h1 32px → h2 13px(uppercase) 점프가 큼. 중간 위계(섹션 리드/위젯 제목 16~18px)가 비어 리듬이 2단으로 끊긴다. board는 h1 26 / h2 14로 더 촘촘해 양 화면 간 타이포 스케일이 불일치(컴포넌트 일관성 감점).
4) [상태 표현 — board의 강점이자 미세 흠] 드래그 상태(dragging opacity .55+dashed), drop-target(글로우+subtle 배경), 빈 컬럼 드롭존, overdue 풀컬러칩, 미배정 dashed placeholder, +1 오버플로, 뷰어 읽기전용 — G2/G3의 7개 필수 상태가 명시 variant로 전부 존재. 다만 카드 "드래그 가능 신호"가 hover lift뿐이고 명시적 grab 핸들/커서 외 시각 단서가 약함(F1 ①요구). hover 시 ⋮ 핸들 강조 등 보강 여지.
5) [여백] board 컬럼 패딩(cards 10px, 카드 11~12px)은 미니멀 톤에 적정. index content max-width 1180에 padding 24px는 1440에서 우측 여백이 다소 큼(중앙 정렬 아님) — 1440 무파손엔 문제없으나 시각 균형 미세 흠.

종합: 방향 충실(off-brief 아님)·기능 상태 완결·a11y 토큰 규율은 우수. 감점은 전적으로 "대담 방향의 강조 절제"(그라데이션/bold-shadow 남용으로 위계 평탄화)와 두 화면 타이포 스케일 불일치에 있다. 임계값 80은 통과. 리디자인이 필수는 아니나, index의 강조 다이어트와 타이포 스케일 통일을 적용하면 90+ 도달 가능.

## 권고 (리디자인 불필요 — within-brief 개선 지시, 선택 적용)

미달은 아니나(80 통과) 90+를 위한 within-brief 개선 지시:
1) [index — 최우선] 강조 다이어트: --shadow-bold는 hero 1곳에만. .widget·.bcard는 --shadow-card(또는 1px border + 미세 그림자)로 낮춰 위계 회복. gradient-brand 적용처를 마크+아바타로 제한하고 활동 .dot은 solid --color-primary로 — "대담하되 한 뷰포트 aurora 1회" 현행 기준 충족.
2) [양 화면 — 타이포 스케일 통일] 공유 타입 스케일 정의(예: display 28/h1 22/h2 16/body 14/meta 12)로 index h1과 board h1, 양 h2를 맞춰 컴포넌트 일관성 확보. index의 32→13 점프 사이에 16~18px 위젯 제목 위계 삽입.
3) [index — 1440 균형] .content를 max-width 1180 + margin:0 auto(중앙)로 두거나 1280/1440 양쪽에서 좌우 여백 균형 검증.
4) [board — 드래그 신호 보강] 카드 hover 시 ⋮ 이동 핸들 강조 또는 좌측 grip 도트 표시로 F1 ①'드래그 가능 신호' 명시화(현재 lift만으로는 약함).
5) [board — 셸·메인 톤 연결] boardhead에 보드 스워치 또는 멤버 아바타 스택 요약을 더해 강한 그라데이션 사이드바와 밋밋한 메인의 급격한 대비 완화.
주의: 위 어느 것도 방향을 바꾸지 않는다 — 미니멀·차분의 '절제'와 확장이 허락한 '대담'을 더 정교히 분배하는 보정일 뿐. 그라데이션을 더 늘리거나(트렌드 추종) 셸 화려함을 걷어내는(미니멀 회귀) 양극단 모두 off-brief.

## 출처

- https://www.eggradients.com/blog/gradient-ui-in-2026
- https://www.saasui.design/blog/7-saas-ui-design-trends-2026
- https://www.925studios.co/blog/saas-dashboard-design-examples-2026
- https://adminlte.io/blog/shadcn-ui-kanban-templates/
- https://blog.tubikstudio.com/ui-design-trends-2026/
- https://www.perfectafternoon.com/2025/hero-section-design/
