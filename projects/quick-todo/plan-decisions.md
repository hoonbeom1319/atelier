# quick-todo — 기획 결정 근거 (plan-decisions)

> 무인 기획(/forge §B)에서 **시장조사 에이전트(market-researcher, 웹검색)** 가 plan 질문에 무슨 근거로 답했나.
> 행마다: 질문 → 근거(출처 URL) → 답/권고 → 신뢰도(grounded / guess).
> **§11 가정과 교차참조용** — 근거 확보 항목은 PRD에서 "가정" → "근거 있는 결정"으로 승격됐다.
> 조사 축: ① Todo 표준 핵심기능·MVP 경계·기능 과잉 함정(데이터 모델·엣지케이스·지표 포함) ② 데이터 모델 관례·상태 모델(완료/필터)·흔한 엣지케이스(빈 목록·중복·삭제 확인).

---

## 축 1 — Todo 표준 핵심기능 · MVP 경계 · 기능 과잉 함정

**요약.** 사용자가 명시한 4개 핵심 동작(추가·완료 토글·삭제·필터 전체/미완료/완료)은 업계 사실상 표준인 TodoMVC 스펙과 정확히 일치 — PRD 핵심 범위는 이대로 확정 가능. 데이터 모델 관례는 항목당 {id, title, completed} 3필드를 localStorage 배열로 JSON 직렬화하는 것이며, 필터는 데이터가 아닌 뷰/라우트 상태이고 새로고침 후 유지가 표준. 표준 스펙은 추가로 인라인 편집·toggle-all·clear-completed·미완료 카운터를 포함하나, 하네스 소형 앱·MVP 3~5기능 원칙상 카운터/편집 정도만 경계 후보로 두고 나머지(마감일·우선순위·정렬·검색·태그·서브태스크·알림·동기화)는 전부 Next/범위 밖 — 사용자 인테이크의 "부풀리지 말 것" 지시와 일치(충돌 없음). 흔한 엣지케이스는 빈/공백 입력 차단, 편집 후 빈 문자열=삭제, 빈 상태 안내, clear-completed 숨김, 긴 텍스트, 필터-카운터 동기화, 새로고침 상태 유지. 행동형 KPI(리텐션·DAU)는 로컬·단일 사용자·하네스 성격상 부적합(추측) — 대신 검증 게이트 통과(죽은 컨트롤 0·WCAG AA 대비·양 뷰포트 무파손·상태 영속)를 완성도 지표로 권고. 삭제 확인창은 표준엔 없음(즉시 삭제); 모던 톤이면 토스트+실행취소가 대안(권고).

### Q1. Todo 앱의 표준 핵심기능(MVP 경계)은 무엇인가? 사용자가 답한 추가/완료토글/삭제/필터가 업계 표준과 일치하는가?
- 근거: https://todomvc.com/ · https://github.com/tastejs/todomvc · https://github.com/tastejs/todomvc/blob/master/app-spec.md
- 답/권고: 일치한다. TodoMVC(프레임워크 비교용 사실상 업계 표준 스펙)의 핵심 행위가 정확히 add / toggle(완료) / delete / filter(All·Active·Completed). 사용자 답(추가·완료토글·삭제·상태별 필터 전체/미완료/완료)이 이 표준과 1:1. 표준엔 추가로 (a)인라인 편집(라벨 더블클릭→수정, blur/Enter 저장, Esc 취소), (b)toggle-all, (c)clear completed, (d)미완료 카운터('N items')가 포함. 권고: MVP 핵심=사용자 명시 4개. 인라인 편집은 '핵심에 가까운 후보'(CRUD의 U), toggle-all/clear-completed/카운터는 'Next'로 두되 데이터밀도 톤(Linear/Things)엔 카운터 정도가 자연스럽다. 하네스 소형 앱이므로 부풀리지 말 것.
- 신뢰도: grounded
- → PRD 교차참조: §1 "왜 이 범위인가"·§4 F1~F4(근거 있는 결정)로 승격. F5 카운터는 경계 항목으로 MVP 끌어올림.

### Q2. 데이터 모델 관례(스키마)는? 로컬 전용 Todo의 항목 객체는 어떤 필드를 가져야 하나?
- 근거: https://github.com/tastejs/todomvc/blob/master/app-spec.md · https://medium.com/@erp-enterprises/learn-how-to-use-localstorage-in-javascript-with-a-todo-app-b9530d4da813 · https://dev.to/hariramjp777/todo-app-using-html-css-and-js-local-storage-interactivity-javascript-3f3a
- 답/권고: TodoMVC 표준 영속 스키마는 항목당 { id, title, completed } 3필드, 배열을 JSON.stringify로 localStorage에 'todos-[앱이름]' 키로 저장하는 것이 관례(JSON.parse로 복원). 최소 모델 = id(고유키)+title(텍스트)+completed(불리언). 권고: 이 3필드를 MVP 모델로 채택. 한국어 UI라 title은 자유 텍스트(유니코드). id는 충돌 없는 값(crypto.randomUUID() 또는 timestamp). createdAt/order는 표준엔 없고 정렬·안정 순서 필요 시 createdAt 정도만(우선순위/마감일/태그/description은 범위 밖 — 기능 과잉 신호). 필터(All/Active/Completed)는 데이터 필드가 아니라 뷰 상태이며 표준은 라우트(#/, #/active, #/completed)로 관리·새로고침 후 유지.
- 신뢰도: grounded
- → PRD 교차참조: §5 Todo 3필드·ViewState 분리·영속(개념 수준)으로 승격. B4(영속 메커니즘)는 "관례 권고일 뿐 강제 아님"으로 보류 표기.

### Q3. 흔한 엣지케이스는? PRD에 무엇을 명시해야 하나?
- 근거: https://github.com/tastejs/todomvc/blob/master/app-spec.md · https://figr.design/blog/edge-case-examples-software · https://www.eleken.co/blog-posts/empty-state-ux
- 답/권고: 반복 등장 엣지케이스: (1)빈/공백-only 입력 — trim 후 빈 문자열이면 항목 미생성(공백 저장은 DB 오염 전형). (2)편집 결과 빈 문자열이면 항목 삭제(표준). (3)빈 상태 — 0개일 때 리스트/푸터를 의미 있는 안내로(데이터밀도 톤엔 절제). (4)완료 0개일 때 'clear completed' 숨김; toggle-all은 완료분 비운 뒤 리셋. (5)필터 상태 새로고침 후 유지. (6)아주 긴 텍스트 줄바꿈/말줄임. (7)완료 항목이 활성 필터에서 사라지는 필터-카운터 동기화. 삭제 확인 다이얼로그는 표준 TodoMVC엔 없음(즉시 삭제) — 소형 앱이면 생략이 관례, 데이터밀도/실수방지 톤이면 토스트+실행취소가 확인창보다 모던(권고).
- 신뢰도: grounded
- → PRD 교차참조: §4 F1~F6 엣지케이스·§6 흐름·§7 SC1-4/5로 승격.

### Q4. 흔한 기능 과잉(feature creep) 함정은? 무엇을 MVP에서 빼야 하나?
- 근거: https://www.geteppo.com/blog/feature-creep · https://www.shopify.com/partners/blog/feature-creep · https://www.minimum-code.com/blog/what-is-an-minimum-viable-product-mvp · https://lembergsolutions.com/blog/mvp-scope-how-define-your-minimum-viable-product-4-steps
- 답/권고: 성공적 MVP는 핵심 3~5개로 출시('30개가 아니라 3~5개'), '있으면 좋음'은 후속으로. 추가 기능은 '더하는 복잡도보다 10배 가치 있을 때만' 휴리스틱. Todo 전형 과잉 후보(=빼야 할 것): 마감일·우선순위·정렬·검색·태그/라벨·서브태스크·반복·알림·캘린더 연동·드래그 정렬·통계 대시보드. 기능 과잉은 사용성 저하·이탈·유지보수 폭증·일정 지연. 사용자도 인테이크에서 마감일/우선순위/정렬/검색/태그/서브태스크를 '신중히, 부풀리지 말 것 → 다음/나중/범위 밖'으로 명시 — 조사 권고와 일치. 라이트/다크·반응형은 기능이 아니라 표현 요건이므로 MVP 포함해도 과잉 아님.
- 신뢰도: grounded
- → PRD 교차참조: §10 범위 밖으로 승격. §11 A3 가정과 일치(충돌 없음).

### Q5. 우선순위 근거(어떤 기능이 핵심이고 어떤 게 후순위인가)는?
- 근거: https://github.com/tastejs/todomvc/blob/master/app-spec.md · https://todomvc.com/ · https://www.minimum-code.com/blog/what-is-an-minimum-viable-product-mvp
- 답/권고: [P0 핵심·MVP] 추가·완료 토글·삭제·필터(전체/미완료/완료) — 사용자 명시 + TodoMVC 표준 핵심. [P0~P1 경계] 인라인 편집(CRUD의 U, 표준 포함이나 소형 앱 선택), 미완료 카운터(데이터밀도 톤에 자연스럽고 구현 저렴). [P1 Next] toggle-all, clear completed(편의 일괄동작, 핵심 흐름 없이도 성립). [범위 밖] 마감일·우선순위·정렬·검색·태그·서브태스크·알림·동기화·계정(사용자가 단일사용자·로컬전용·외부연동 없음으로 닫음).
- 신뢰도: grounded
- → PRD 교차참조: §4-1/§4-2/§4-3 우선순위 분리로 승격.

### Q6. 목표 지표(KPI)의 현실적 수준은? 하네스 테스트용 소형 Todo에 적합한 지표는?
- 근거: https://www.atlassian.com/agile/product-management/minimum-viable-product · https://www.uxpin.com/studio/blog/mvp-software-development-how-to/
- 답/권고: 추측 표시. 일반 MVP 지표 가이드(활성화율·리텐션·기능 채택률)는 존재하나, 이 앱은 '하네스 테스트용 소형·단일사용자·로컬전용'이라 행동 KPI(DAU·리텐션·전환)는 부적합·측정 대상 없음(계정/서버/분석 없음). 권고하는 현실적 '완성도 지표'(제품 KPI 아닌 검증 게이트 통과 기준): (1)핵심 흐름 4종이 죽은 컨트롤 0으로 동작, (2)빈 상태·빈입력·긴텍스트 엣지케이스 처리, (3)라이트/다크 양 모드 토큰 대비비 WCAG AA, (4)390px·1280px 양 뷰포트 무파손, (5)새로고침 후 데이터·필터 상태 유지. 행동형 숫자 목표(예 'N% 리텐션')는 이 앱 성격상 설정 금지 — 설정하면 측정 불가 허수 지표.
- 신뢰도: guess
- → PRD 교차참조: §2 G1~G5 지표로 승격하되, §11 B1에서 confidence "guess"를 정직 표기(이 앱이 로컬·단일 사용자라는 사실에서 직접 따라옴 → 검증 게이트 지표로 대체).

---

## 축 2 — 데이터 모델 관례 · 상태 모델(완료/필터) · 흔한 엣지케이스(빈 목록·중복·삭제 확인)

**요약.** 업계 사실상 표준 TodoMVC 명세 근거: 데이터 모델 {id, title, completed:boolean} 3필드, 완료는 boolean 토글, 필터는 별도 "표시 필터" 상태(전체/미완료/완료)로 분리해 파생 계산. 사용자 답(추가/완료/삭제/필터, 로컬 전용, 소형 MVP)과 완전 일치 — 충돌 없음. MVP 핵심: 입력 trim+빈 문자열 차단, 빈 목록 빈상태 안내, 활성 항목 카운터, 필터 적용 중 상태 변경 시 즉시 반영. 삭제 확인은 NN/g 근거상 "쉽게 되돌릴 수 있으면 확인창보다 undo 토스트" — 단 하네스 소형 앱은 즉시 삭제(확인/undo 없음)도 정당. 중복 제목 허용(차단 안 함)이 TodoMVC 관례. 마감일·우선순위·정렬·검색·편집은 MVP 밖 권고(편집조차 TodoMVC는 포함하나 본 소형 스펙에선 선택).

### Q1. Todo 데이터 모델 관례 — 각 항목은 어떤 필드를 가져야 하나?
- 근거: https://github.com/tastejs/todomvc/blob/master/app-spec.md · https://todomvc.com/
- 답/권고: TodoMVC 명세는 항목당 정확히 3필드: id(고유 식별자, number 또는 UUID), title(할 일 텍스트), completed(boolean). 권고: 이 최소 3필드를 MVP 코어로. 로컬 전용이므로 localStorage에 JSON 배열로 저장(키 예: 'atelier-todos'), 빈 배열 fallback 초기화. createdAt 같은 메타필드는 정렬 미도입 한 불필요(소형 MVP는 삽입 순서 = 배열 순서로 충분).
- 신뢰도: grounded
- → PRD 교차참조: §5 Todo 엔터티·createdAt/order 생략 근거로 승격.

### Q2. 완료/필터 상태 모델 관례 — 완료와 필터를 어떻게 모델링하나?
- 근거: https://github.com/tastejs/todomvc/blob/master/app-spec.md · https://www.oreilly.com/library/view/developing-backbonejs-applications/9781449328535/ch04.html · https://egghead.io/lessons/react-redux-react-todo-list-example-filtering-todos
- 답/권고: 완료는 항목 completed boolean 토글이 표준(완료 시 부모에 .completed 스타일). 필터는 항목에 저장 말고 '표시 필터(visibility filter)' 별도 상태로 분리(기본 SHOW_ALL=전체). 렌더 시 파생: 전체=todos, 미완료=todos.filter(t=>!t.completed), 완료=todos.filter(t=>t.completed). 권고: 필터 = 단일 enum('all'|'active'|'completed') + 선택 탭 selected 강조. 사용자 답(3필터)과 정확히 일치.
- 신뢰도: grounded
- → PRD 교차참조: §5 ViewState.filter·§4 F4 모델링·§6 상태 전이로 승격.

### Q3. MVP 경계 — 무엇이 핵심이고 무엇을 빼야 하나? 목표 지표의 현실적 수준은?
- 근거: https://github.com/tastejs/todomvc/blob/master/app-spec.md · https://todomvc.com/
- 답/권고: MVP 코어(사용자 답 + TodoMVC): 추가(trim·빈값 차단·추가 후 입력 비우기)·완료 토글·삭제·3필터·활성 카운터·빈 목록 빈상태. 빼는 것(범위 밖/나중): 마감일·우선순위·태그·서브태스크·검색·정렬·드래그 재정렬 — '소형/부풀리지 말 것'에 부합. 경계선: (a)인라인 편집 — TodoMVC 포함이나 소형 스펙엔 '선택'. (b)'완료 모두 지우기'/'전체 완료 토글' — TodoMVC 포함이나 nice-to-have. 목표 지표: 하네스 소형 앱이라 성장/리텐션 KPI 부적합 — '6개 코어 동작이 죽은 컨트롤 0으로 동작하고 빈상태/카운터/필터 즉시반영이 정확한가'를 완결성 지표로(지표 부분 confidence 혼합, 코어 기능 정의는 grounded).
- 신뢰도: grounded
- → PRD 교차참조: §4 우선순위·§2 완성도 지표로 승격.

### Q4. 흔한 엣지케이스 (1) — 빈 입력·공백·중복 처리는?
- 근거: https://github.com/tastejs/todomvc/blob/master/app-spec.md · https://medium.com/@erp-enterprises/learn-how-to-use-localstorage-in-javascript-with-a-todo-app-b9530d4da813
- 답/권고: 입력 텍스트를 .trim() 정규화 후 빈 문자열이면 추가 안 함(공백만 차단). 추가 버튼/Enter 양쪽 동일 trim+검증. 중복 제목은 TodoMVC가 차단 안 함 — 복수 허용이 관례(차단 로직 불필요, 단순성). 입력 필드는 autofocus로 진입 시 바로 타이핑.
- 신뢰도: grounded
- → PRD 교차참조: §4 F1 엣지케이스①②·§7 SC1-2 자동 포커스로 승격.

### Q5. 흔한 엣지케이스 (2) — 빈 목록(empty state) 처리는?
- 근거: https://github.com/tastejs/todomvc/blob/master/app-spec.md · https://www.nngroup.com/articles/empty-state-interface-design/ · https://www.eleken.co/blog-posts/empty-state-ux
- 답/권고: 두 종류 구분: (a)0개일 때 — TodoMVC는 main/footer 숨김. 단 본 앱은 정보밀도·전문 톤(Linear/Things)이라 NN/g·UX 권고상 '막다른 길' 금지 → 헤드라인+짧은 설명+추가 유도(입력 필드 항상 노출). 'no data' 무미건조 카피 금지. (b)항목은 있으나 현재 필터 매칭 0개 — '완료된 할 일이 없습니다' 식 필터별 맥락 메시지. 다크/라이트 모두 빈상태 텍스트·아이콘 대비 확보.
- 신뢰도: grounded
- → PRD 교차참조: §4 F6·§7 SC1-5·§8 빈 상태로 승격.

### Q6. 흔한 엣지케이스 (3) — 삭제 확인(confirmation) vs undo, 우선순위 근거는?
- 근거: https://www.nngroup.com/articles/confirmation-dialog/ · https://blog.logrocket.com/ux-design/double-check-user-actions-confirmation-dialog/ · https://medium.com/design-bootcamp/a-ux-guide-to-destructive-actions-their-use-cases-and-best-practices-f1d8a9478d03
- 답/권고: NN/g·UX 근거: '쉽게 되돌릴 수 있는' 행동엔 확인 다이얼로그가 불필요한 마찰 — undo 토스트가 낫다. 확인 다이얼로그는 '되돌리기 어렵거나 심각한' 행동에만, 드물게. 본 앱은 소형·로컬·하네스용이고 삭제는 자주 일어나는 저위험 행동 → MVP는 즉시 삭제(확인창 없음)가 정당·단순. 안전망 필요하면 확인창보다 undo 토스트를 1순위(다만 undo는 추가 상태관리 비용 → 소형 MVP에선 '나중' 가능). 결론: 확인 다이얼로그 비권장, undo는 선택적 향상.
- 신뢰도: grounded
- → PRD 교차참조: §4 F3 즉시 삭제 결정 근거·§4-2 undo(P1)·§11 B2(삭제 안전망 보류)로 승격/표기.

### Q7. 필터 적용 중 항목 상태가 바뀔 때의 동작은?
- 근거: https://github.com/tastejs/todomvc/blob/master/app-spec.md · https://hackerati.gitbook.io/react-tutorial/todomvc_app/filter_by_completed
- 답/권고: 필터링은 모델/렌더 레벨에서 동적으로 — '미완료' 필터 중 항목을 완료 처리하면 즉시 목록에서 사라짐(필터 조건 재평가). 선택된 필터는 새로고침/재진입 후 유지(TodoMVC는 URL 라우트; 본 앱은 라우팅 없이 상태+localStorage로 지속 가능). 권고: 토글/삭제 후 항상 현재 필터 기준 재렌더, 카운터(활성 개수)도 갱신.
- 신뢰도: grounded
- → PRD 교차참조: §4 F2/F4 엣지케이스·§6 상태 전이 요약으로 승격.

### Q8. 카운터/표시 관례 — 활성 항목 개수 표기는?
- 근거: https://github.com/tastejs/todomvc/blob/master/app-spec.md
- 답/권고: TodoMVC 표준: 카운터는 '활성(미완료) 항목 수' 표시, 복수형 처리(영문 item/items). 권고: 한국어 UI이므로 '남은 할 일 N개' / 'N개 남음' 형태로 복수형 고민 불필요(한국어 단복수 불변 → 영문 명세 복잡성 제거). 숫자는 시각적 강조(전문·정보밀도 톤).
- 신뢰도: grounded
- → PRD 교차참조: §4 F5·§7 SC1-3·§8 카운터 카피로 승격.

---

## §11 가정 ↔ 근거 교차참조 (승격/보류 요약)

| §11 항목 | 상태 | 근거 |
|---|---|---|
| A1 단일 사용자·로컬 전용 | 사용자 가정(미답 닫음) — 근거가 보강 | 축1-Q4·Q5, 축2-Q3: 외부연동/계정은 기능 과잉으로 범위 밖. 사용자 인테이크와 일치. |
| A2 외부 연동 없음 | 사용자 가정 | 축1-Q4: 알림·캘린더 등 전형 과잉 후보. |
| A3 MVP는 작게('있으면 좋음' 미룸) | 사용자 가정 → 근거 있는 결정으로 보강 | 축1-Q4·Q5, 축2-Q3: MVP 3~5기능 원칙·TodoMVC 경계. grounded. |
| B1 성공 지표(행동형 KPI 부적합) | 추측 유지(confidence guess) | 축1-Q6, 축2-Q3: 일반 가이드는 있으나 로컬·단일사용자 성격상 검증 게이트 지표로 대체. guess. |
| B2 삭제 안전망(즉시 삭제 vs undo) | 결정 보류 | 축2-Q6: 즉시 삭제 정당, undo는 P1. grounded(권고). |
| B3 인라인 편집 | 결정 보류(P1) | 축1-Q1·Q5, 축2-Q3: TodoMVC 포함이나 소형 스펙 '선택'. grounded. |
| B4 영속 메커니즘 | 구현 자유(권고일 뿐 강제 아님) | 축1-Q2, 축2-Q1: localStorage JSON 배열이 관례. atelier는 구현 비종속. grounded(권고). |
| B5 긴 텍스트 처리(줄바꿈 vs 말줄임) | 디자인 단계 결정 | 축1-Q3: 레이아웃 무파손이 요구, 처리 방식은 /design 확정. |
