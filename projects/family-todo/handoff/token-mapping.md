# 토큰 매핑표 — family-todo → 대상(Next.js)

> 원본: `foundation/tokens.css` (2단: primitive → semantic).
> **통째 복붙하지 말고 매핑하라.** 단, 이미 표준 2단 구조라 **그대로 채택해도 깨끗**하다 — 아래 두 경로 중 택1.

---

## 경로 A — CSS 변수 채택 (권장, 가장 적은 마찰)

`app/globals.css`(또는 동등 위치)에 primitive→semantic 2단을 그대로 올린다. 컴포넌트는 `var(--color-*)`만 참조. 다크모드는 `prefers-color-scheme` + `[data-theme]` 두 경로 유지(원본 그대로).

```css
/* globals.css */
:root { /* primitive: --blue-*, --gray-*, --amber-*, --green-500, --red-* */
        /* semantic: --color-primary, --color-bg, --color-surface, ... */
        /* gradient: --gradient-bg, --gradient-primary */ }
[data-theme="dark"] { /* semantic 다크 오버라이드 */ }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { /* 동일 */ } }
```

→ 원본 `tokens.css`를 거의 그대로 가져오되, 폰트 스택만 프로젝트 표준(예: Pretendard 웹폰트)으로 교체.

---

## 경로 B — Tailwind theme 매핑

CSS 변수를 단일 출처로 두고 Tailwind가 그것을 참조(라이트/다크 자동 추종). `tailwind.config`에서 색을 `var(--color-*)`로 연결.

```js
// tailwind.config.{js,ts}
theme: {
  extend: {
    colors: {
      primary:   'var(--color-primary)',
      'primary-hover': 'var(--color-primary-hover)',
      bg:        'var(--color-bg)',
      surface:   'var(--color-surface)',
      'surface-2':'var(--color-surface-2)',
      text:      'var(--color-text)',
      'text-muted':'var(--color-text-muted)',
      border:    'var(--color-border)',
      'accent-warm':'var(--color-accent-warm)',
      success:   'var(--color-success)',
      danger:    'var(--color-danger)',
    },
    backgroundImage: {
      'app':     'var(--gradient-bg)',
      'primary': 'var(--gradient-primary)',
    },
    borderRadius: { sm:'8px', md:'12px', lg:'18px', xl:'24px', full:'999px' },
  },
}
```

→ primitive 팔레트와 다크 오버라이드는 여전히 `globals.css`의 CSS 변수로 둔다(Tailwind는 semantic만 본다). 다크 토글은 `[data-theme]`. 단순 `dark:` variant만 쓰려면 `darkMode: ['selector','[data-theme="dark"]']`.

---

## semantic 역할 매핑표 (역할명은 보존)

| 역할 토큰 | 라이트 | 다크 | 용도 |
|---|---|---|---|
| `--color-primary` | `--blue-500` | `--blue-400` | 주요 버튼·체크·강조·링크 |
| `--color-primary-hover` | `--blue-600` | `--blue-300` | hover |
| `--color-primary-soft` | `--blue-50` | `#16244a` | 포커스 링·옅은 강조 배경 |
| `--color-on-primary` | `#fff` | `#0e1830` | primary 위 텍스트 |
| `--color-bg` | `--gray-50` | `#131210` | 앱 바탕(+ `--gradient-bg`) |
| `--color-surface` | `--gray-0` | `#1d1b18` | 카드·시트·바·헤더 |
| `--color-surface-2` | `--gray-100` | `#272420` | 입력칸·옅은 면 |
| `--color-text` | `--gray-900` | `#f3f1ee` | 본문 |
| `--color-text-muted` | `--gray-500` | `#a8a39a` | 보조(카운트·라벨) |
| `--color-text-subtle` | `--gray-400` | `#6f6a61` | 더 옅음(섹션·플레이스홀더) |
| `--color-border` | `--gray-200` | `#322e29` | 구분선·테두리 |
| `--color-border-strong` | `--gray-300` | `#423d36` | 입력 테두리·토글 트랙 |
| `--color-accent-warm` | `--amber-500` | `--amber-400` | 날짜 배지·우리집 정서 터치(소량) |
| `--color-accent-warm-soft` | `#fff5e0` | `#2c2415` | 날짜 배지 배경 |
| `--color-success` | `--green-500` | (동일) | 성공 |
| `--color-warn-soft` / `--color-warn-text` | `#fff3cd`/`#6b4e02` | `#3a3115`/`#f0d79a` | 오프라인 배너 |
| `--color-danger` / `-hover` | `--red-500`/`--red-600` | (동일) | 삭제 |
| `--gradient-bg` | `radial(상단 --blue-50 글로우)` | `radial(상단 #1a2742)` | 앱 바탕(fixed) |
| `--gradient-primary` | `linear 135° blue-400→600` | `blue-300→500` | primary 버튼·FAB |

## 타이포·간격·모서리·그림자·모션 (그대로 이식)

- **fs**: xs12 / sm13 / base15 / md17 / lg20 / xl24 / 2xl30. **fw**: 400 / 550 / 700. **lh**: tight1.25 / base1.5.
- **간격** 4px 스케일: `--sp-1..10` (4·8·12·16·20·24·32·40).
- **모서리**: sm8 / md12 / lg18 / xl24 / full999.
- **그림자**: `--shadow-1/2/3` + `--shadow-primary`(파랑 글로우). 다크는 검정 베이스로 재정의(원본 참조).
- **모션**: dur `instant90 / fast160 / base240 / slow360 / sheet420`; ease `standard / emphasized / spring(.34,1.56,.64,1) / in`. **spring·emphasized·sheet는 이 앱의 정체성** — 줄이지 마라.

## 제품 전용(파운데이션 아님)
- 날짜 배지 = `--color-accent-warm` 계열, faux 요소 아님. PIN 입력·바텀시트·토스트 등은 컴포넌트 토큰을 별도로 만들지 말고 위 semantic을 조합해 표현(원본 `app.css`가 그렇게 함).
