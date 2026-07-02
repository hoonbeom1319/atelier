# 요기조기 — 토큰 매핑표 (semantic → 대상) · 4차 다크모드

> **다크모드 전용** — 순검정(#000) 배경·근검정 카드·흰 텍스트/액션(primary=#fff)·다크 헤어라인. 핀은 흰색(다크 지도 위). 사진은 컬러(토큰 아님). 레드=좋아요/미열람. 컴포넌트는 semantic만. 라이트 대응은 semantic만 뒤집으면 됨. primitive(값 램프)는 매핑 불필요.

## 색 — 표면/텍스트/보더

| semantic 토큰 | 값(다크) | 대상 토큰(권장) |
|---|---|---|
| `--color-bg` | #000000 | `--color-bg` |
| `--color-surface` | #121213 | `--color-surface` |
| `--color-surface-alt` | #1c1c1e | `--color-surface-alt` |
| `--color-surface-sunken` | #262628 | `--color-surface-sunken` |
| `--color-overlay` | rgba(0,0,0,.66) | `--color-overlay` |
| `--color-map-canvas` | #191a1c | `--color-map-canvas` |
| `--color-text` | #f5f5f5 | `--color-text` |
| `--color-text-secondary` | #c9c9cf | `--color-text-secondary` |
| `--color-text-muted` | #9a9aa0 | `--color-text-muted` |
| `--color-on-primary` | #0a0a0a | `--color-on-primary` |
| `--color-on-dark` | #f5f5f5 | `--color-on-dark` |
| `--color-border` | #2c2c2f | `--color-border` |
| `--color-border-strong` | #3c3c40 | `--color-border-strong` |
| `--color-divider` | #202023 | `--color-divider` |
| `--color-on-danger` | #0a0a0a | `--color-on-danger` |

## 색 — 브랜드/상태(다크 + 레드 액센트)

| semantic 토큰 | 값(다크) | 대상 토큰(권장) |
|---|---|---|
| `--color-primary` | #ffffff | `--color-primary` |
| `--color-primary-hover` | #e2e2e2 | `--color-primary-hover` |
| `--color-primary-tint` | #202024 | `--color-primary-tint` |
| `--color-focus-ring` | #ffffff | `--color-focus-ring` |
| `--color-danger` | #ff5b6b (← var(--red-600)) | `--color-danger` |
| `--color-on-danger` | #0a0a0a | `--color-on-danger` |
| `--color-unread` | #ff3b4e (← var(--red-500)) | `--color-unread` |
| `--color-like` | #ff3b4e (← var(--red-500)) | `--color-like` |
| `--color-badge-estimate` | #c9c9cf | `--color-badge-estimate` |
| `--color-badge-confirm` | #f5f5f5 | `--color-badge-confirm` |
| `--color-info` | #c9c9cf | `--color-info` |

## 색 — 핀(흰색·다크지도 위)/공개범위

| semantic 토큰 | 값(다크) | 대상 토큰(권장) |
|---|---|---|
| `--color-pin-food` | #ffffff | `--color-pin-food` |
| `--color-pin-cafe` | #ffffff | `--color-pin-cafe` |
| `--color-pin-culture` | #ffffff | `--color-pin-culture` |
| `--color-pin-nature` | #ffffff | `--color-pin-nature` |
| `--color-pin-shopping` | #ffffff | `--color-pin-shopping` |
| `--color-pin-etc` | #ffffff | `--color-pin-etc` |
| `--color-scope-public` | #f5f5f5 | `--color-scope-public` |
| `--color-scope-followers` | #c9c9cf | `--color-scope-followers` |
| `--color-scope-private` | #8a8a90 | `--color-scope-private` |

## 타이포그래피

| semantic 토큰 | 값(다크) | 대상 토큰(권장) |
|---|---|---|
| `--font-sans` | -apple-system, BlinkMacSystemFont, 'Pretendard', 'Apple SD Gothic Neo', 'Segoe UI', 'Helvetica Neue', 'Malgun Gothic', sans-serif | `--font-sans` |
| `--fs-display` | 26px | `--fs-display` |
| `--lh-display` | 32px | `--lh-display` |
| `--fw-display` | 700 | `--fw-display` |
| `--fs-h1` | 21px | `--fs-h1` |
| `--lh-h1` | 27px | `--lh-h1` |
| `--fw-h1` | 700 | `--fw-h1` |
| `--fs-h2` | 17px | `--fs-h2` |
| `--lh-h2` | 23px | `--lh-h2` |
| `--fw-h2` | 600 | `--fw-h2` |
| `--fs-body` | 15px | `--fs-body` |
| `--lh-body` | 21px | `--lh-body` |
| `--fw-body` | 400 | `--fw-body` |
| `--fs-sm` | 13px | `--fs-sm` |
| `--lh-sm` | 18px | `--lh-sm` |
| `--fs-xs` | 11px | `--fs-xs` |
| `--lh-xs` | 15px | `--lh-xs` |
| `--fw-medium` | 500 | `--fw-medium` |
| `--fw-semibold` | 600 | `--fw-semibold` |

## 둥글기/z/레이아웃

| semantic 토큰 | 값(다크) | 대상 토큰(권장) |
|---|---|---|
| `--radius-xs` | 4px | `--radius-xs` |
| `--radius-sm` | 8px | `--radius-sm` |
| `--radius-md` | 12px | `--radius-md` |
| `--radius-lg` | 16px | `--radius-lg` |
| `--radius-full` | 999px | `--radius-full` |
| `--z-appbar` | 50 | `--z-appbar` |
| `--z-tabbar` | 60 | `--z-tabbar` |
| `--z-scrim` | 70 | `--z-scrim` |
| `--z-sheet` | 80 | `--z-sheet` |
| `--z-toast` | 90 | `--z-toast` |
| `--app-width` | 390px | `--app-width` |
| `--tabbar-h` | 56px | `--tabbar-h` |
| `--appbar-h` | 48px | `--appbar-h` |
| `--touch-min` | 44px | `--touch-min` |

_semantic 67개 중 68개 매핑. primitive는 tokens.css ①단._
