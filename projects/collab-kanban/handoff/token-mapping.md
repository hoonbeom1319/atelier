# collab-kanban — 토큰 매핑표 (semantic → 대상 토큰 시스템)

> **통째 복붙 금지.** 아래 semantic 역할 토큰을 받는 프로젝트의 *기존 토큰 시스템*에 **매핑**한다.
> primitive 그레이/인디고 램프(`--gray-*`·`--indigo-*`·`--red-*` 등)는 *값*이라 매핑 대상이 아니다 — 대상 팔레트로 치환만.
> 표준 2단(primitive → semantic) 구조이며, 컴포넌트는 semantic만 참조한다. 라이트/다크는 별도 페어 스케일(`:root` / `:root[data-theme="dark"]`).
> 원본 정의: `../foundation/tokens.css`. 대비는 양 모드 WCAG AA를 통과한다(`tokens.spec.js` + axe).

## 표면 / Elevation
| semantic 토큰 | 역할 | 라이트 | 다크 | 대상 매핑 가이드 |
|---|---|---|---|---|
| `--color-bg` | 보드 base 배경 | #ffffff | #161619 | 앱 배경 / `background.default` |
| `--color-surface` | 1차 elevated(컬럼·패널) | #f7f7f8 | #1d1d22 | `surface` / `background.subtle` |
| `--color-surface-2` | 2차 elevated(카드·중첩) | #eeeef0 | #26262c | `surface.raised` / 카드 배경 |
| `--color-overlay` | 모달 표면 | #ffffff | #2f2f36 | `surface.overlay` / 다이얼로그 |
| `--color-scrim` | 모달 뒤 배경막 | rgba(24,24,27,.38) | rgba(0,0,0,.55) | backdrop/scrim |
| `--color-card-shadow` | 카드 그림자 색 | rgba(24,24,27,.10) | rgba(0,0,0,.45) | shadow color 변수 |

## 텍스트
| semantic 토큰 | 역할 | 라이트 | 다크 | 대상 매핑 가이드 |
|---|---|---|---|---|
| `--color-text` | 본문·제목 | #18181b | #f2f2f4 | `text.primary` |
| `--color-text-muted` | 보조·메타 | #5d5d65 | #9a9aa6 | `text.secondary` |
| `--color-text-subtle` | 약한 힌트·placeholder | #828289 | #74747e | `text.tertiary`/placeholder |
| `--color-on-primary` | primary 위 텍스트 | #ffffff | #161619 | `text.onAccent`(다크는 어두운 텍스트) |

## 경계 / 포커스
| semantic 토큰 | 역할 | 라이트 | 다크 | 대상 매핑 가이드 |
|---|---|---|---|---|
| `--color-border` | 기본 구분선 | #e3e3e6 | #34343b | `border.default` |
| `--color-border-strong` | 강조 경계 | #d2d2d6 | #44444c | `border.strong` |
| `--color-focus` | 포커스 링 | #5e6ad2 | #8a8ff0 | `focus.ring` |

## Accent / 인터랙티브
| semantic 토큰 | 역할 | 라이트 | 다크 | 대상 매핑 가이드 |
|---|---|---|---|---|
| `--color-primary` | 1차 액션(단일 accent) | #4c56b8 | #8a8ff0 | `accent`/`primary`. 라이트=어두운 인디고+흰텍스트, 다크=밝은 인디고+어두운텍스트(AA) |
| `--color-primary-hover` | primary hover | #3c4596 | #b6baf2 | `primary.hover` |
| `--color-primary-subtle` | 선택/활성 틴트 배경 | #b6baf2 | #2c2f55 | `accent.subtle`/selected bg |
| `--color-drop-target` | 유효 드롭존 하이라이트 | #5e6ad2 | #8a8ff0 | DnD active 강조 |

## 상태 신호
| semantic 토큰 | 역할 | 라이트 | 다크 | 대상 매핑 가이드 |
|---|---|---|---|---|
| `--color-danger` | overdue·삭제(채운 칩, 흰 텍스트 AA) | #b23b3b | #c43d3d | `danger`/`error` |
| `--color-warning` | 임박 | #c98a2e | #c98a2e | `warning` |
| `--color-success` | 완료 | #3f9d62 | #3f9d62 | `success` |

## 형태 / 타이포
| semantic 토큰 | 역할 | 값 | 대상 매핑 가이드 |
|---|---|---|---|
| `--radius-sm` | 작은 라운드(카드·칩·입력) | 4px | `radius.sm` |
| `--radius-md` | 중간 라운드(패널·컬럼) | 6px | `radius.md` |
| `--radius-pill` | 알약(아바타·필터칩·카운트) | 999px | `radius.full` |
| `--shadow-card` | 카드 그림자 | 0 1px 2px (card-shadow) | `shadow.sm` |
| `--shadow-pop` | 팝오버/모달 그림자 | 0 6px 20px rgba(24,24,27,.16) | `shadow.lg` |
| `--shadow-bold` | 대담 lift(카드 hover·히어로) | 0 10px 30px rgba(60,69,150,.18) / 다크 rgba(0,0,0,.5) | `shadow.xl` |
| `--font-sans` | 본문 폰트 스택 | system-ui … | `font.sans`(시스템 스택, 외부폰트 의존 없음) |

## 대담·화려 방향 (셸·대시보드 강조 — 그라데이션은 배경/장식에만, 텍스트는 solid 위)
| semantic 토큰 | 역할 | 라이트 | 다크 | 대상 매핑 가이드 |
|---|---|---|---|---|
| `--gradient-brand` | 사이드바·아바타·뱃지 강조 | indigo→violet 135° | 동(밝은 페어) | `gradient.brand`(장식/아바타 배경) |
| `--gradient-hero` | 홈 히어로 배경(흰 텍스트 AA) | 인디고→바이올렛→마젠타 120° | 어두운 페어 | `gradient.hero`(히어로 배너) |
| `--ring-accent` | 강조 포커스/선택 글로우 | 0 0 0 3px rgba(94,106,210,.35) | 다크 페어 | `focus.glow`/selected ring |

> `--color-accent-2`(라이트 #c026a8 / 다크 #e05fc6, 흰 텍스트 ≥5.1)는 보조 강조색 — 토큰명에 숫자가 있어 primitive로 분류되나 실제로는 보조 accent 역할이다. 대상 `accent.secondary`로 매핑.

> 스페이싱은 4px 그리드 primitive(`--space-1..5`)로 토큰화돼 있다(값이라 매핑 불필요 — 대상 스페이싱 스케일에 맞춤).

## 라벨 색 팔레트 (제품 데이터 — 파운데이션 토큰 아님)
> 라벨 색은 **사용자 데이터(라벨 엔티티의 color)** 다. 디자인 토큰이 아니라 **DB 시드/사용자 지정 값**으로 다룬다.
> 칩 = 흰 텍스트 + 라벨색 배경. 작은 11px라 흰 텍스트 기준 **WCAG AA 4.5:1**로 보정했다(양 모드 동일, axe 검증). 사용자가 새 라벨 색을 추가할 땐 같은 AA 기준을 강제할 것.

| 토큰 | 라벨 | 값(흰 텍스트 대비) |
|---|---|---|
| `--label-bug` | 버그 | #bf3535 (5.56) |
| `--label-feature` | 기능 | #2f6fb0 (5.22) |
| `--label-design` | 디자인 | #7d44b8 (6.19) |
| `--label-docs` | 문서 | #5d5d65 (6.52) |
| `--label-urgent` | 긴급 | #a85a1f (5.06) |
| `--label-research` | 리서치 | #2f7d70 (4.90) |

## 패스스루(원시 값 — 매핑보다 치환)
> 아래는 primitive에 가깝지만 토큰명에 숫자가 없어 semantic으로 분류된 값들이다. 대상 시스템엔 **표면 스케일의 원시 값**으로 흡수한다.
- `--white` (#ffffff) — 라이트 base 원색.
- `--d-base` (#161619) · `--d-overlay` (#2f2f36) · `--d-line` (#34343b) — 다크 표면/경계 원시 값(다크 페어 스케일의 base·overlay·line).
