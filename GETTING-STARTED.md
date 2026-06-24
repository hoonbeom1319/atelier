# 🚀 Getting Started — Atelier 사용 가이드

아이디어 한 줄에서 **개발에 넘길 디자인 패키지**까지, 터미널에서 끝내는 법.
처음이라면 이 문서만 따라오면 된다. (개념 설명은 [README](./README.md) 참고.)

---

## 📋 1. 필요한 것

| 도구 | 용도 | 확인 |
|---|---|---|
| **Claude Code** | `/plan`·`/design` harness를 구동 | `claude --version` |
| **Node.js** (18+) | 와이어/하이파이 동작 검증(Playwright) | `node -v` |
| **Git** | 버전 관리·handoff 전달 | `git --version` |

> 🔑 외부 계정·로그인이 **필요 없다.** 전부 **로컬에서, 터미널만으로** 돈다.

---

## ⚙️ 2. 설치

```bash
git clone https://github.com/hoonbeom1319/atelier.git
cd atelier

npm install                       # Playwright 등 의존성
npx playwright install chromium   # 검증용 브라우저 (1회)
```

이게 전부다. 빌드도, 서버도 없다.

---

## 👀 3. 5분 둘러보기 — 완성된 예시부터 열어보기

`projects/family-todo/`는 **PRD부터 handoff까지 완주된 실제 예시**다. 결과물이 어떤 모양인지 먼저 눈으로 보자.

```bash
# 인계 패키지(비주얼 문서) — 실제 화면이 임베드돼 클릭된다
start "" "projects\family-todo\handoff\index.html"     # Windows
# open projects/family-todo/handoff/index.html         # macOS

# 하이파이 화면 직접 진입 (PIN은 아무 4자리나 설정 → 목록 진입)
start "" "projects\family-todo\screens\index.html"
```

열어볼 것:
- `handoff/hand-off.md` — 받는 쪽에 붙여넣는 **인계 프롬프트**(이게 최종 결과물)
- `STATUS.md` — `0 기획 → 7 handoff`까지 어떻게 흘러갔는지 한눈에
- `screens/` — 클릭되고 상태가 변하는 하이파이

---

## 🧭 4. 내 작업 시작하기 — 두 갈래

작업장 폴더에서 **Claude Code 세션을 열고**, 가진 게 무엇이냐에 따라 시작점이 다르다.

### 갈래 A — 아이디어만 있다 (기획부터)

```
/plan
```

`/plan`은 25년차 PM처럼 **바로 기획서를 쓰지 않고 캐묻는다.** 대화로 7단계를 밟는다:

```
1 문제 정의 → 2 목표·지표 → 3 타깃 → 4 핵심기능·MVP
→ 4-1 데이터 모델 → 5 흐름·화면 → 6 제약 → 7 체크리스트  →  PRD.md ✍️
```

> 💬 "다 중요해요"라고 하면 되묻는다. 모호한 말("깔끔하게")도 구체화를 요구한다. — 이게 핵심 기능이다, 버그가 아니라.

PRD가 완성되면 `projects/<name>/PRD.md`가 생기고, 그대로 갈래 B로 이어진다.

### 갈래 B — 이미 PRD가 있다 (디자인부터)

PRD를 `projects/<name>/PRD.md`에 넣어두고:

```
/design
```

`/design`이 PRD를 받아 인테이크부터 handoff까지 단계별로 짓는다.

> 📂 두 스킬 모두 **먼저 어느 프로젝트인지 고른다.** `projects/`의 각 `STATUS.md`를 읽어 대시보드로 보여주고, 멈춘 단계부터 이어간다.

---

## 🪜 5. `/design`이 밟는 단계 (무슨 일이 일어나나)

| 단계 | 만드는 것 | 끝나는 조건 |
|---|---|---|
| ① 인테이크 | `00-flow.md` (화면·플로우 합의) | 사용자 OK |
| ② 와이어프레임 | `wireframe/*.html` (클릭됨·상태 변함) | 사용자 OK |
| ③ 흐름·기능 검증 | Playwright spec | **자동 green** + 사람 판단 |
| ④ 디자인 시스템 | `foundation/tokens.css` + 컴포넌트 | 사용자 OK |
| ⑤ 하이파이 | `screens/*.html` (토큰·모션 입힘) | 사용자 느낌 OK |
| ⑥ 인터랙션 검증 | 같은 spec 재실행 | **자동 green** + 사람 느낌 |
| ⑦ handoff | `handoff/` 패키지 + `hand-off.md` | 대상 지정 |

> 🚦 **단계마다 OK를 받고 넘어간다.** 한 번에 다 쏟지 않는다 — 앞 단계가 검증돼야 뒤 단계 품질이 오른다.

---

## ✅ 6. 검증 직접 돌려보기

`/design`의 ③·⑥ 검증은 자동으로 돌지만, 직접 실행할 수도 있다:

```bash
# 한 프로젝트의 특정 spec
node scripts/test-project.js family-todo projects/family-todo/screens.spec.js

# 한 프로젝트 전체
node scripts/test-project.js family-todo

# 증빙 리포트 열기 (pass/fail + 스크린샷 + 클릭 재생 trace)
npx playwright show-report projects/family-todo/playwright-report
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

- **세션이 끊겼어요.** → 그냥 다시 `/plan`이나 `/design`을 부르면 된다. `STATUS.md`가 현재 위치라, 멈춘 단계부터 이어간다.
- **프로젝트가 여러 개여도 되나요?** → 된다. `projects/` 아래 폴더마다 독립. 토큰·산출물을 공유하지 않는다.
- **PRD 없이 디자인부터 하면?** → 가능은 하지만 권장 안 함. `/plan`으로 전제를 굳히면 ②~⑦ 품질이 확 오른다.
- **화면이 아주 많아요.** → `/design`이 묶음(청크)으로 나눠 묶음마다 게이트를 걸고, 빌더를 병렬로 띄운 뒤 독립 에이전트가 적대적으로 검증한다.
- **결과물에 외부 라이브러리 못 쓰나요?** → 외부 의존성은 금지(독립 실행 HTML). **상태 변화용 인라인 JS는 허용**된다.

---

## 🗂️ 치트시트

```
/plan       아이디어 → PRD (캐묻는 기획)
/design     PRD → 와이어 → 디자인시스템 → 하이파이 → handoff

node scripts/test-project.js <name> [spec경로]     검증 실행
npx playwright show-report projects/<name>/playwright-report   증빙 보기

projects/<name>/STATUS.md     현재 어느 단계인지 (항상 여기부터)
projects/<name>/PRD.md        /plan 산출물 = /design 입력
projects/<name>/handoff/      최종 인계 패키지
```

막히면 `STATUS.md`를 열어보면 된다 — 그게 이 작업장의 지도다. 🗺️
