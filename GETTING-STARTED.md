# 🚀 Getting Started — Atelier 사용 가이드

아이디어 한 줄에서 **개발에 넘길 디자인 인계 패키지**까지, 터미널에서 끝내는 법.
처음이라면 이 문서만 따라오면 된다. (개념 설명은 [README](./README.md) 참고.)

---

## 📋 1. 필요한 것

| 도구 | 용도 | 확인 |
|---|---|---|
| **Claude Code** | `/forge`(메인) · `/plan` · `/design` harness 구동 | `claude --version` |
| **Node.js** (18+) | 와이어/하이파이 동작 검증(Playwright) | `node -v` |
| **Git** | 버전 관리·handoff 전달 | `git --version` |

> 🔑 외부 계정·로그인이 **필요 없다.** 전부 **로컬에서, 터미널만으로** 돈다. (`/forge`의 시장조사·트렌드 전문가만 웹검색을 쓴다.)

---

## ⚙️ 2. 설치

두 가지 방법 중 하나로 — 결과는 같다.

**A. npm으로 (권장 — 새 작업장을 어디든 깐다):**

```bash
npx @hb-kit/atelier init my-atelier   # 폴더명 생략 시 현재 폴더에
cd my-atelier

npm install                       # Playwright 등 의존성
npx playwright install chromium   # 검증용 브라우저 (1회)
```

**B. git clone으로 (repo를 통째로 — 아틀리에 자체를 고치며 쓸 때):**

```bash
git clone https://github.com/hoonbeom1319/atelier.git
cd atelier

npm install                       # Playwright 등 의존성
npx playwright install chromium   # 검증용 브라우저 (1회)
```

이게 전부다. 빌드도, 서버도 없다.

---

## 👀 3. 무엇이 나오나 — `/forge` 한 번의 산출물

`/forge`를 한 번 돌리면 `projects/<name>/` 아래에 이런 게 생긴다(브라우저로 바로 열린다):

```bash
# 최종 인계 패키지(비주얼 문서) — 화면이 임베드돼 클릭된다
start "" "projects\<name>\handoff\index.html"      # Windows
# open projects/<name>/handoff/index.html          # macOS
```

핵심 산출물:
- `handoff/hand-off.md` — 받는 쪽에 붙여넣는 **인계 프롬프트**(이게 최종 결과물)
- `handoff/` — 비주얼 문서·토큰 매핑표·컴포넌트 인벤토리
- `plan-decisions.md` — 시장조사가 기획 질문에 **무슨 근거로** 답했나(출처 URL)
- `prd-review.md` · `design-verify.md` — 만든 쪽이 아닌 **별도 에이전트**의 독립 비평·검증 판정
- `design-critique.md` — 트렌드 전문가 감정 점수·지적(미달 시 리디자인 기록)
- `STATUS.md` — `0 기획 → 7 handoff`까지 어떻게 흘러갔는지 한눈에

---

## 🧭 4. 내 작업 시작하기

작업장 폴더에서 **Claude Code 세션을 연다.** 길은 둘 — **통째로 맡길지(메인), 손으로 몰지.**

### ⚡ 메인 — `/forge` (무인, 가장 빠른 길)

```
/forge
```

`/forge`는 **시작에서 한 번만** 묻는다(타깃·플랫폼·톤·MVP 경계 등). 답하면 그 뒤로 사람 게이트 없이 **PRD → 와이어 → 하이파이 → handoff**까지 자동으로 짓는다.

- **자동 게이트는 그대로** — `lint-prd`·Playwright·a11y·`lint-handoff`가 품질 바닥을 지킨다.
- **사람 판단의 빈자리**는 ① 가정 원장(`PRD.md §11`) ② **시장조사 에이전트**(웹 → `plan-decisions.md`) ③ **디자인 트렌드 전문가**(웹 감정 → 미달 시 자동 리디자인 1회, `design-critique.md`)가 메운다.
- 끝나면 **인계 패키지 + 가정·근거·감정 요약**을 받는다. 마음에 안 들면 **가정만 고쳐 다시 `/forge`**, 또는 아래 수동 모드로 갈아탄다.

> ⚠️ 무인은 빠르지만 *"옳은 제품인가·최종 미감"* 은 사람 미검수다 — 전달 시 명시된다.

### 🔧 직접 단계별로 — `/plan` · `/design`

단계마다 멈춰 직접 보고 합의하고 싶으면, `/forge`가 내부에서 굴리는 두 공정을 손으로 부른다.

```
/plan      # 아이디어만 있을 때 — 25년차 PM처럼 캐물어 PRD까지
/design    # PRD가 있을 때 — 인테이크부터 handoff까지, 단계마다 OK
```

`/plan`은 바로 기획서를 쓰지 않고 캐묻는다("다 중요"는 거절, 모호한 말은 되묻기). `/design`은 PRD를 받아 단계마다 사용자 OK를 받으며 짓는다.

> 📂 세 스킬 모두 **먼저 어느 프로젝트인지 고른다.** `projects/`의 각 `STATUS.md`를 대시보드로 보여주고, 멈춘 단계부터 이어간다. **셋은 같은 폴더·STATUS·검증을 공유** — `/forge` 1차 결과를 `/design`으로 이어 다듬거나, `/plan`으로 PRD만 굳힌 뒤 `/forge`에 맡길 수 있다.

---

## 🪜 5. 파이프라인이 밟는 단계 (무슨 일이 일어나나)

`/forge`는 아래를 **자동으로**, 수동 모드(`/design`)는 **사용자 OK를 받으며** 밟는다 — 같은 단계, 다른 운전석.

| 단계 | 만드는 것 | `/forge`(무인) | `/design`(수동) |
|---|---|---|---|
| ① 인테이크 | `00-flow.md` | 자동 | 사용자 OK |
| ② 와이어프레임 | `wireframe/*.html` (클릭됨·상태 변함) | 자동 | 사용자 OK |
| ③ 흐름·기능 검증 | Playwright spec | 자동 green | 자동 green + 사람 판단 |
| ④ 디자인 시스템 | `foundation/tokens.css` + 컴포넌트 | 자동 (토큰 대비 green) | 사용자 OK |
| ⑤ 하이파이 | `screens/*.html` | 자동 (axe green) | 사용자 느낌 OK |
| ⑤.5 리디자인 | `screens-<variant>/` | **트렌드 전문가 미달 시 자동 1회** | 선택 (사람이 후보 선택) |
| ⑥ 인터랙션 검증 | 같은 spec 재실행 | 자동 green | 자동 green + 사람 느낌 |
| ⑦ handoff | `handoff/` + `hand-off.md` | 자동 (`lint-handoff` green) | 대상 지정 |

> 🚦 수동 모드는 **단계마다 OK를 받고** 넘어간다 — 앞 단계가 검증돼야 뒤 단계 품질이 오른다. `/forge`는 그 OK를 *시작 1회 인테이크 + 가정 원장 + 전문가 감정*으로 대신한다.

---

## ✅ 6. 검증 직접 돌려보기

③·⑥ 검증은 자동으로 돌지만, 직접 실행할 수도 있다:

```bash
# 한 프로젝트의 특정 spec
node scripts/test-project.js <name> projects/<name>/screens.spec.js

# 증빙 리포트 열기 (pass/fail + 스크린샷 + 클릭 재생 trace)
npx playwright show-report projects/<name>/playwright-report

# 경계 게이트
node scripts/lint-prd.js <name>          # PRD 형식 (plan→design)
node scripts/lint-prd-review.js <name>   # PRD 독립 비평이 있었나
node scripts/lint-verify.js <name>       # 하이파이 독립 검증이 있었나
node scripts/lint-handoff.js <name>      # handoff 완결성 + self-contained (design→dev)
```

증빙은 `projects/<name>/playwright-report`·`test-results`에 프로젝트별로 쌓인다. (git에는 안 올라간다 — `.gitignore` 처리.)

---

## 📦 7. handoff — 앱 레포로 넘기기

⑦단계가 끝나면 `projects/<name>/handoff/`가 생긴다. **atelier는 대상 코드를 직접 짜지 않는다.** 넘기는 법:

1. `handoff/index.html`을 열어 비주얼로 최종 확인.
2. 앱 레포에서 **새 Claude Code 세션**을 연다.
3. `handoff/hand-off.md`의 내용을 **그대로 붙여넣는다.**
4. 받는 쪽 Claude가 참고 파일·계약·만들 순서를 보고 **자기 컨벤션**으로 구현한다.

> 🎯 토큰은 대상 시스템에 **매핑**한다(통째 복붙 금지). 그래서 특정 프레임워크에 묶이지 않는다.

---

## 💡 8. 자주 하는 질문 · 팁

- **그냥 다 알아서 해줘.** → `/forge`. 시작 1회 질문만 답하면 인계 패키지까지 통째로 나온다.
- **세션이 끊겼어요.** → 다시 `/forge`·`/plan`·`/design` 아무거나 부르면 된다. `STATUS.md`가 현재 위치라 멈춘 단계부터 이어간다.
- **`/forge` 결과가 살짝 아쉬워요.** → ① 가정(`PRD.md §11`)을 고쳐 다시 `/forge` ② `/design`으로 갈아타 사람이 단계별로 다듬기 ③ 추가 리디자인 — 셋 다 같은 산출물 위에서 된다.
- **프로젝트가 여러 개여도 되나요?** → 된다. `projects/` 아래 폴더마다 독립. 토큰·산출물을 공유하지 않는다.
- **결과물에 외부 라이브러리 못 쓰나요?** → 외부 의존성은 금지(독립 실행 HTML). **상태 변화용 인라인 JS는 허용**된다.

---

## 🗂️ 치트시트

```
/forge      ⚡ 무인 — 시작 1회 질문 → PRD → hi-fi → handoff (사람 게이트 0)
/plan       아이디어 → PRD (캐묻는 기획)              ← 손으로 몰 때
/design     PRD → 와이어 → 디자인시스템 → hi-fi → handoff  ← 손으로 몰 때

node scripts/test-project.js <name> [spec경로]                  검증 실행
node scripts/lint-{prd,prd-review,verify,handoff}.js <name>     경계 게이트 4종
npx playwright show-report projects/<name>/playwright-report    증빙 보기

projects/<name>/STATUS.md     현재 어느 단계인지 (항상 여기부터)
projects/<name>/handoff/      ★ 최종 인계 패키지
```

막히면 `STATUS.md`를 열어보면 된다 — 그게 이 작업장의 지도다. 🗺️
