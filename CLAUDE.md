# Atelier — 로컬 기획·디자인 작업장 (메인: /forge 무인 · 수동: /plan · /design)

이 폴더(**아틀리에**)는 터미널에서 아이디어를 받아 **PRD → 디자인 산출물 → 인계 패키지**까지 짓는 작업장이다.
**메인 무대는 `/forge`(무인 오케스트레이터)** — 시작 1회 질문만 받고 전 공정을 사람 게이트 없이 자동으로 돌려 인계 패키지까지 낸다.
손으로 단계별로 몰고 싶으면, forge가 *내부에서 굴리는* **`/plan`(기획)·`/design`(디자인)** 을 직접 부른다(같은 폴더·STATUS·검증 공유 — 곁가지가 아니라 같은 공정의 수동 운전석).
완성본은 *인계 패키지*로 묶어 다른 Claude Code 프로젝트에 넘긴다.

> **이 폴더는 단일 프로젝트가 아니라 여러 프로젝트를 담는 "작업장"이다.**
> 실제 디자인 작업물은 전부 `projects/<프로젝트명>/` 안에서 일어난다.
> 여기서 만드는 건 "최종 앱 코드"가 아니라 **개발에 넘길 디자인 산출물**이다.

> **단일 출처(source of truth) — 어느 문서를 고칠지:**
> - **이 `CLAUDE.md`** = 작업장 *불변 규칙*(폴더 구조·산출물 형식·토큰 2단·품질 항목명). 형식 규칙의 원본.
> - **`.claude/skills/{plan,design}/SKILL.md`** = 각 harness *공정의 단계별 절차*의 원본(기획 7단계 / 디자인 7단계·검증 3층·묶음·에이전트 편성·Playwright). **공정을 바꾸면 SKILL을 고친다.** 아래 파이프라인 요약은 오리엔테이션일 뿐, 상세는 SKILL이 원본.
> - **`.claude/skills/forge/SKILL.md`** = 무인 오케스트레이터(`/forge`) — plan→design을 **사람 게이트 없이** 끝까지 돌려 **인계 패키지(hand-off)** 까지 전달하는 상류 공정. *"어디서 사람을 빼고 무엇으로 메우나(자동 게이트 유지·가정 원장)"* 의 원본. 단계별 절차는 위 두 SKILL을 가리킨다(베끼지 않음).
> - **`README.md`/`GETTING-STARTED.md`** = 사람용 소개·가이드(요약 미러).
> 같은 내용을 두 곳에 풀어쓰지 말 것 — 한 곳을 원본으로 두고 나머지는 가리킨다(드리프트 방지).

---

## 폴더 구조

```
atelier/                            # 아틀리에 루트 (로컬 폴더명은 달라도 무관)
├── CLAUDE.md                       # 이 파일 — 작업장 공통 규칙(형식·품질의 원본)
├── .claude/skills/{plan,design}/   # /plan·/design 스킬 (공정 절차의 원본)
│   └── forge/                       # /forge — 무인 오케스트레이터(plan→design→handoff 자동, 인계 패키지 전달)
├── .claude/agents/                 # 커스텀 서브에이전트 정의(부품)
│   ├── market-researcher.md        #   시장조사(웹검색, plan 질문 근거화) — forge §B / plan
│   ├── prd-critic.md               #   PRD 독립 비평가(7차원 실질 감정, prd-review.md 작성) — plan §C / forge §B
│   ├── design-verifier.md          #   하이파이 독립 검증자(render-check, design-verify.md 작성) — design §C step 5
│   ├── screen-builder.md           #   화면 1개 빌더(하이파이/리디자인) — 빌드 fan-out 단위
│   └── design-trend-expert.md      #   트렌드 감정(웹검색, 0~100 점수) — forge §C-6
├── .claude/workflows/              # 결정론적 오케스트레이션 스크립트(부품을 코드로 엮음)
│   ├── forge-plan.js               #   forge 무인: 시장조사→PRD 초안→prd-critic N명 비평(다수결)→개정 1회
│   └── forge-design.js             #   forge 무인: 빌드 fan-out→적대적 검증(N 다수결)→트렌드 점수→리디자인 1회
├── scripts/
│   ├── test-project.js             # 프로젝트별 Playwright 실행기(증빙 라우팅)
│   ├── lint-prd.js                 # PRD 형식 검사(plan→design 게이트: 11섹션·깊이)
│   ├── lint-prd-review.js          # PRD 실질 비평 게이트(prd-review.md: 별도 Agent가 7차원 비평했나)
│   ├── lint-verify.js              # 하이파이 독립 검증 게이트(design-verify.md: 별도 Agent가 render-check 했나)
│   ├── lint-handoff.js             # handoff 완결성 자동 검사(design→dev 게이트)
│   └── lib/                        # 재사용 검증 골격(매 프로젝트 재발명 금지)
│       ├── crawl.js                #   1층: 도달성·막다른 길·고아
│       ├── controls.js             #   2층: 죽은 컨트롤(클릭-디프)
│       ├── selectors.js            #   포터블 셀렉터(role·aria·text)
│       └── a11y.js                 #   자동 a11y: 토큰 대비비(WCAG)
└── projects/
    ├── my-first-app/
    │   ├── PRD.md                  # 입력 (/plan 산출물)
    │   ├── plan-decisions.md       # 시장조사 근거 기록 (forge §B — market-researcher)
    │   ├── prd-review.md           # PRD 독립 비평 (prd-critic 7차원 판정 — lint-prd-review가 검사)
    │   ├── STATUS.md               # ★ 이 프로젝트가 어느 단계인지 기록 (스킬이 갱신)
    │   ├── 00-flow.md              # 1단계 산출: 화면·플로우 합의본
    │   ├── *.spec.js               # 흐름·기능 검증 spec (lib 골격 require)
    │   ├── wireframe/*.html        # 클릭되는 lo-fi
    │   ├── foundation/             # tokens.css + colors/typography
    │   ├── components/*.html
    │   ├── screens/*.html          # 하이파이
    │   ├── design-verify.md        # 독립 검증 산출물 (별도 Agent의 render-check 판정 — lint-verify가 검사)
    │   └── handoff/                # 인계 패키지 (hand-off.md + 문서·매핑표·인벤토리)
    ├── my-second-app/
    └── my-third-app/
```

- **프로젝트는 서로 독립.** 토큰·산출물을 공유하지 않는다.
- **`STATUS.md`가 프로젝트의 "현재 위치"다.** 파일 존재 여부만으로는 알 수 없는 것(예: "흐름 테스트를 사용자가 통과시켰는가")을 여기에 기록한다. 작업장에 들어오면 이 STATUS.md들이 곧 프로젝트 목록(대시보드) 역할을 한다.

---

## 파이프라인 (오리엔테이션 — 상세는 SKILL이 원본)

> ⚠ 이 절은 **지도(orientation)** 다. 단계별 *절차*의 원본은 `.claude/skills/`의 `forge`(무인 오케스트레이터)·`design`(디자인)·`plan`(기획) SKILL이다. **공정을 바꾸면 SKILL만 고친다 — 여기 베껴 풀어쓰지 않는다.**

각 프로젝트는 `projects/<name>/` 안에서 PRD → handoff로 내려간다. **메인(`/forge`)은 이 전 흐름을 자동으로** 돌리고(사람은 시작 1회만), **수동 모드(`/plan`·`/design`)는 각 단계를 사용자 "OK" + `STATUS.md` 갱신**으로 넘어간다(한 번에 다 쏟지 않는다).

```
(/plan: 아이디어 → PRD.md → lint-prd)
  1 인테이크(00-flow) → 2 와이어(클릭+상태변화) → 3 흐름·기능 검증
    → 4 디자인 시스템(tokens) → 5 하이파이 → (5.5 리디자인·선택) → 6 인터랙션 검증 → 7 handoff(lint-handoff)
```

오리엔테이션용 핵심만(상세·예외·셀렉터·에이전트 편성은 SKILL):

- **메인 `/forge`(무인) — 위 흐름을 사람 OK 없이 끝까지 자동으로 돌려 인계 패키지까지 낸다.** *자동 게이트(`lint-prd`·Playwright 1·2층·a11y·`lint-handoff`)는 유지*하고, *사람 OK·3층 판단*은 **시작 1회 인테이크 + 가정 원장 + 전문가 에이전트(시장조사·트렌드, 웹검색)** 로 대체한다. 시장조사가 plan 답을 근거화(`plan-decisions.md`), 트렌드 전문가가 hi-fi를 감정해 미달 시 자동 리디자인 1회(`design-critique.md`). **수동(`/plan`·`/design`)은 같은 공정을 사람이 단계별로 운전** — 추가 발산·느낌검수가 거기서 살아난다. 절차 원본은 `forge/SKILL.md`.
- **검증은 3층이고, 자동이 2층까지 본다.** 내비게이션(자동)+기능 완결성(자동, 죽은 컨트롤 0)+느낌·판단(사람). PRD 실질 비평(`lint-prd-review` — 별도 Agent가 7차원 비평했나)·토큰 대비비(a11y)·하이파이 독립 검증(`lint-verify` — 별도 Agent가 render-check 했나)·handoff 완결성도 자동(스크립트)이 본다 — 사람은 비주얼·느낌·"옳은 흐름인가"만. 자동 게이트는 3·6단계(Playwright)와 5단계(`lint-verify`)·경계(`lint-prd`+`lint-prd-review`/`lint-handoff`)에 있다.
- **3단계는 동작이 *되나*, 6단계는 그게 *좋게 느껴지나*.** 같은 기능 spec(role·aria·text 셀렉터)을 양쪽에 돌린다.
- **큰 PRD는 묶음(청크)으로** — ① 단계(세로)로 자르고(한 묶음을 hi-fi까지 내리지 않는다, `tokens.css`는 전 묶음 확정 후 1회) ② 단계 *안에선* 묶음마다 게이트. 묶음 간 링크는 스텁/`[범위 밖]`으로 막다른 길을 막고 와이어 배리어에서 잇는다. (다이어그램·절차는 design SKILL "묶음 진행 순서".)
- **handoff는 코드 변환이 아니라 인계 프롬프트 전달** — 아래 §handoff 참조.

---

## 결과물 형식

- 화면·컴포넌트마다 **외부 의존성(외부 라이브러리) 없는 독립 실행 HTML 1개.** 브라우저로 바로 열려야 한다. (상태 변화용 **인라인 JS는 허용** — 금지는 외부 의존성이지 JS가 아니다.)
- 각 파일 첫 줄에 카드 마커: `<!-- @dsCard group="Wireframe|Foundation|Components|Screens" -->`
- 디자인 토큰은 그 프로젝트의 `foundation/tokens.css`에 CSS 변수로 모으고 전 화면이 공유. **표준 2단 구조**: ①primitive(`--coral-500`·`--gray-50..900`, 중립은 숫자 램프 필수) → ②semantic 역할명(`--color-primary`·`--color-text`·`--color-surface`…, 컴포넌트는 이것만 사용). **브랜드 단어로 토큰명 짓지 않기**(`--c-coral` X — 코랄은 값이지 이름이 아님). 제품 전용 토큰(`--map-*` 등)은 파운데이션이 아니라 해당 컴포넌트에.
- 하이파이는 **그 프로젝트의 대상 뷰포트**(00-flow에서 정함 — 모바일 390px·데스크톱·대시보드 등) 안에서. 모바일이 기본이 아니다.
- 각 화면 폴더에 `index.html`(진입점)을 둬서 거기서부터 클릭으로 흐름을 탈 수 있게.

---

## 품질 루프 (모든 산출물에 적용)

만들 때마다 스스로 점검하고, 걸리면 **통과할 때까지** 고친다:

1. **thin** — 내용이 빈약한가 2. **bad** — 레이아웃이 깨졌나
3. **variantsIdentical** — variant·화면이 사실상 똑같나 4. **off-brief** — `00-flow.md`/PRD에서 벗어났나
5. **deadControl** — 인터랙티브한데 와이어드 안 됨(범위 밖 라벨도 없음) 6. **stateInert** — 눌렀는데 상태가 안 변함

---

## handoff

- **handoff는 "코드 변환"이 아니라 "인계 프롬프트 전달"이다.** chosen final을 `handoff/` 패키지(비주얼 문서·토큰 매핑표·컴포넌트 인벤토리 + **PRD가 있으면 `PRD.md`도 참조로 포함** — `/plan` 산출물)로 묶고, **`hand-off.md`** = 받는 쪽 Claude Code에 붙여넣는 브리프(참고 파일·지킬 계약·만들 순서)를 만든다. 대상 프로젝트의 Claude가 그걸 보고 **자기 컨벤션으로** 짠다. **atelier는 대상 코드를 직접 짜지 않는다 — 특정 프레임워크·아키텍처에 묶이지 않는다.**
- 토큰은 대상 토큰 시스템에 **매핑**한다. 통째 복붙 금지.

## 참고

- 산출물 첫 줄 `@dsCard group="…"` 마커는 카드 그룹(Wireframe/Foundation/Components/Screens) 표식이다 — 산출물 분류·탐색용.
- 외부 계정·로그인 없이 전부 로컬에서 돈다.
