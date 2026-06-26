# quick-todo — 트렌드 감정 (forge §C-6, design-trend-expert)

- 임계값: 80
- 종합 점수: 87 (원본, chosen=screens) — 임계값 상회, 리디자인 불필요
- 리디자인 여부: 아니오

## 화면별 점수

| 화면 | 점수 | 판정 |
|---|---|---|
| screens/main.html | 87 | 통과 (≥80) |

## 화면별 지적

### screens/main.html (87)

On-brief Linear/Things calm-modern, information-dense execution. Hierarchy: clear (22px bold title, 14px base, 13px muted meta, bottom-border section dividers instead of heavy cards) — correct for the dense restrained tone. Whitespace: disciplined sp-scale rhythm (sp-3/4/5/6). Typography rhythm: 13/14/16/22 scale is tight and intentional; the one outlier is the 16px input (--fs-16) next to 14px controls — defensible (iOS no-zoom) but it is the single break in the otherwise 13/14 dense rhythm. Color: restrained indigo accent used only for primary/selection/focus, green only for completed check, red only for danger — exactly the 'minimal accent' standard. Component consistency: shared focus ring (0 0 0 3px primary-weak) across input/button/checkbox/tab/delete — strong consistency. State expression: completed (line-through + .65 opacity + muted), filter selected (weak-bg + bold + aria-current), theme toggle (aria-pressed + icon/label swap), three distinct empty states, row-in animation — all states covered and wired, zero dead controls, no scope creep. Viewport fit: 600px max container suits 1280px (PRD: don't over-widen) and min-width:0 + word-break protects 390px from horizontal scroll (G4). Theming: semantic-token light/dark split with DESATURATED indigo-400 and OFF-WHITE (#f6f7f9) dark text — matches 2025 dark-mode guidance (avoid pure-white glare, desaturate accents). Contrast spot-checks pass AA both modes (text ~15:1 light / ~16:1 dark; muted ~7.4:1 light / ~6.5:1 dark; selected-tab text ~6:1 / ~5.6:1). Nitpicks within direction: (1) 16px input breaks dense type rhythm; (2) list rows have 4px left pad (--sp-1) so they hang inset vs header/filter which align to container edge — minor alignment drift; (3) delete icon resting opacity .55 may dip below 3:1 UI contrast at rest (hover/focus fine); (4) role=tab used without a tabpanel — incomplete ARIA tab pattern (aria-current compensates, minor polish); (5) empty-state checkmark glyph is generic for the all-zero case. None warrant redesign.

## 종합 비평

quick-todo의 단일 화면 main.html은 brief가 택한 방향(00-flow·PRD §8: Linear/Things 류 차분한 모던, 정보밀도, 장식 최소, 명료한 위계, 라이트+다크 양 모드 WCAG AA, 한국어)에 충실하고 그 방향 안에서의 현행 기준을 잘 충족한다 — off-brief 아님, 리디자인 불필요(임계값 80 상회).

방향 부합: 무거운 카드 대신 1px 보더 구분, 13/14/16/22 타이트 타입 스케일, tabular-nums 카운터, 인디고 액센트를 primary/선택/포커스에만 절제 사용, 큰 일러스트 없는 미니 글리프 빈 상태 — 정보밀도·미니멀 톤의 교과서적 실행이다. 모든 컨트롤이 와이어드(죽은 컨트롤 0), 범위 밖 요소 없음(toggle-all/clear/편집 부재 — 00-flow 준수).

현행 기준 대조(2025): 다크 모드가 모범 사례와 일치 — 순백 대신 off-white(#f6f7f9) 텍스트로 눈부심 회피, 액센트를 indigo-600→indigo-400로 desaturate, 그림자가 아닌 surface 톤 단계(950/900/800)로 위계. semantic 토큰 2단 분기로 양 모드 AA 대비 충족(텍스트·muted·선택탭 모두 spot-check AA 통과). 일관된 3px 포커스 링이 WCAG 2.2 포커스 가시성 기준에도 부합.

방향 안에서의 미세 결함(완성도 차감, 방향 교체 아님): ①입력창 16px가 나머지 13/14 밀도 리듬의 유일한 이탈(iOS 줌 방지로 변명 가능하나 시각적 outlier). ②리스트 행 좌패딩 4px로 헤더/필터바(컨테이너 엣지 정렬) 대비 4px 안쪽으로 들어가 정렬이 미세하게 어긋남. ③삭제 ✕ 휴식 상태 opacity .55가 라이트 surface에서 UI 3:1 대비를 하회할 소지(hover/focus는 무방). ④role=tab을 쓰면서 tabpanel 연결이 없어 ARIA tab 패턴이 불완전(aria-current로 보완되나 폴리시 여지). ⑤전체 0개 빈 상태 글리프가 다소 일반적.

종합: 방향 정합·상태 망라·양 모드 AA·반응형 무파손이 견고해 87점. 위 5개는 리디자인 사유가 아니라 다음 폴리시 패스의 마감 항목이다.

## 권고 (리디자인 불필요 — 마감 폴리시, 선택 적용)

리디자인 불필요(80 상회). 방향 안에서의 마감 폴리시만 권고(선택 적용):
1) [screens/main.html] 리스트 행 좌패딩을 --sp-1(4px) → 0으로 맞춰 헤더 하단선·필터바와 좌측 정렬을 통일하라(li padding: var(--sp-3) 0; 체크박스-텍스트 간격은 gap이 이미 처리). 우측 삭제 버튼은 행 우측 엣지에 정렬 유지.
2) [screens/main.html] 삭제 ✕ 휴식 상태 opacity .55를 .7로 올리거나 색을 --color-text-muted 그대로 두되 opacity를 제거해 양 모드에서 UI 컴포넌트 3:1 대비를 확실히 확보하라(hover/focus 강조는 유지). 정보밀도 톤에서 '항상 노출 + 절제된 명도'는 .7이 더 안전.
3) [screens/main.html] 입력창 --fs-16과 주변 14px의 리듬 이탈을 인지하라 — iOS 줌 방지 의도면 그대로 두되, 데스크톱 1280px에서 입력창 높이가 추가 버튼보다 도드라지지 않도록 두 요소의 padding 수직값을 한 번 더 맞춰라.
4) [screens/main.html] role=tablist/tab을 쓰는 만큼 <ul id=list>에 role="tabpanel"과 aria-label을 부여하거나, 반대로 단순 세그먼트 버튼(aria-pressed)로 낮춰 ARIA 의미를 일관되게 하라. 현재 aria-current는 옳으나 tabpanel 부재로 패턴이 반쪽이다.
5) [screens/main.html] '전체 0개' 빈 상태 글리프(체크박스 in box)는 모든 빈 상태에 동일 — 최초 진입(할 일 없음)에는 글리프를 빼고 헤드라인만 두거나 더 중립적 글리프로 바꾸면 Linear 류 절제감이 더 산다(선택).
방향(미니멀·정보밀도) 자체는 유지 — 트렌드 추종으로 갈아치우지 말 것.

## 출처

- https://linear.app/now/how-we-redesigned-the-linear-ui
- https://linear.app/now/behind-the-latest-design-refresh
- https://blog.logrocket.com/ux-design/linear-design/
- https://paulwallas.medium.com/designing-for-data-density-what-most-ui-tutorials-wont-teach-you-091b3e9b51f4
- https://muz.li/blog/dark-mode-design-systems-a-complete-guide-to-patterns-tokens-and-hierarchy/
- https://medium.com/@mohitphogat/dark-mode-done-right-and-why-most-apps-get-it-wrong-a75f90aab30a
- https://www.allaccessible.org/blog/color-contrast-accessibility-wcag-guide-2025
- https://www.makethingsaccessible.com/guides/contrast-requirements-for-wcag-2-2-level-aa/
