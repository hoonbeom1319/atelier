# household-ledger — 토큰 매핑표

> 우리 **semantic 토큰** → **대상 시스템 토큰**에 *매핑*한다(통째 복붙 금지). 값은 라이트·미니멀 금융앱(토스·뉴뱅크) 기준.
> primitive(`--gray-50`·`--blue-600`·`--sp-2`·`--shadow-1` 등 `--이름-숫자`)는 *값*이라 매핑 불필요 — 대상 팔레트의 동급 단계에 흡수한다.
> "대상 토큰" 열은 일반적 네이밍 예시 — 받는 프로젝트의 실제 토큰명으로 바꿔 매핑하라.

## 색 (Color)
| 우리 semantic | 값(라이트) | 역할 | 대상 토큰(예시) |
|---|---|---|---|
| `--white` | #ffffff | 순백 베이스 | `color.white` |
| `--color-bg` | #ffffff | 화면 배경 | `color.background` |
| `--color-surface` | #f2f4f6 | 카드/면 | `color.surface` |
| `--color-surface-alt` | #f9fafb | 보조 면 | `color.surface.subtle` |
| `--color-text` | #191f28 | 본문 텍스트 | `color.text.primary` |
| `--color-text-muted` | #4e5968 | 보조 텍스트(AA) | `color.text.secondary` |
| `--color-text-subtle` | #4e5968 | 캡션(AA) | `color.text.tertiary` |
| `--color-border` | #e5e8eb | 경계선 | `color.border` |
| `--color-border-strong` | #d1d6db | 강한 경계 | `color.border.strong` |
| `--color-primary` | #1b64da | 주 액센트(딥블루) | `color.primary` |
| `--color-primary-weak` | #eef4fe | 액센트 약배경 | `color.primary.subtle` |
| `--color-primary-hover` | #1450b0 | 주 액센트 hover | `color.primary.hover` |
| `--color-on-primary` | #ffffff | primary 위 텍스트 | `color.onPrimary` |
| `--color-income` | #1b64da | 수입(블루) | `color.semantic.income` |
| `--color-expense` | #191f28 | 지출(먹색) | `color.semantic.expense` |
| `--color-success` | #15803d | 성공(AA 텍스트) | `color.semantic.success` |
| `--color-warn` | #d97706 | 경고 | `color.semantic.warning` |
| `--color-danger` | #dc2626 | 위험/삭제 | `color.semantic.danger` |

> ⚠ 대비 계약: `--color-primary`는 흰 글씨 대비 5.4:1, `--color-text-muted/subtle`는 surface 위에서도 AA(4.5)를 만족하도록 gray-700로 상향됐다. 대상 시스템에 매핑할 때 이 대비를 깨지 말 것(WCAG AA).

## 타이포 (Typography)
| 우리 semantic | 값 | 역할 | 대상 토큰(예시) |
|---|---|---|---|
| `--font-sans` | system / Pretendard / Apple SD Gothic | 본문 폰트 | `font.family.sans` |
| `--fs-display` | 28px | 금액·잔액 강조 | `font.size.display` |
| `--fs-h1` | 22px | 화면 제목 | `font.size.h1` |
| `--fs-h2` | 18px | 섹션 제목 | `font.size.h2` |
| `--fs-body` | 15px | 본문 | `font.size.body` |
| `--fs-sm` | 13px | 보조 | `font.size.sm` |
| `--fs-xs` | 11px | 뱃지·라벨 | `font.size.xs` |
| `--fw-regular` | 400 | 기본 굵기 | `font.weight.regular` |
| `--fw-medium` | 500 | 중간 | `font.weight.medium` |
| `--fw-bold` | 700 | 강조 | `font.weight.bold` |
| `--lh-tight` | 1.25 | 제목 행간 | `font.lineHeight.tight` |
| `--lh-base` | 1.5 | 본문 행간 | `font.lineHeight.base` |

> 금액은 `font-variant-numeric: tabular-nums`로 자릿수 정렬(대상에서도 유지 권장).

## 모서리·그림자·모션·레이아웃
| 우리 semantic | 값 | 역할 | 대상 토큰(예시) |
|---|---|---|---|
| `--r-sm` | 8px | 작은 라운드 | `radius.sm` |
| `--r-md` | 12px | 카드 라운드 | `radius.md` |
| `--r-lg` | 16px | 큰 카드 | `radius.lg` |
| `--r-pill` | 999px | 알약(칩·FAB) | `radius.pill` |
| `--shadow-fab` | 0 6px 16px rgba(27,100,218,.32) | FAB 그림자 | `shadow.fab` |
| `--dur-fast` | 120ms | 빠른 전환 | `motion.duration.fast` |
| `--dur-base` | 200ms | 기본 전환 | `motion.duration.base` |
| `--ease` | cubic-bezier(.2,.7,.2,1) | 이징 | `motion.easing.standard` |
| `--app-w` | 390px | 앱 최대 폭(모바일) | `layout.appWidth` |
| `--tabbar-h` | 56px | 하단탭 높이 | `layout.tabbarHeight` |

> primitive 램프(매핑 불필요, 대상 팔레트 단계에 흡수): `--gray-50..900`, `--blue-50/100/500/600/700`, `--green-600/700`, `--amber-600`, `--red-600`, `--sp-1..8`, `--shadow-1/2`.
> 제품 전용(파운데이션 아님): stats 도넛 카테고리색 `--cat-1..5`(블루·틸·앰버·바이올렛·회색)는 `screens-refined/stats.html` 안에 인라인 — 통계 차트에서만 쓰며 대상에서도 차트 전용 색으로 둔다.
