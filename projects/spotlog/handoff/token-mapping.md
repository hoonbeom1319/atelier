# spotlog — 토큰 매핑표 (semantic 역할 → 대상 시스템)

> 통째 복붙 금지 — **semantic 역할 토큰을 대상 프로젝트의 토큰 시스템에 매핑**한다.
> primitive(`--gray-50`·`--coral-500`·`--fs-15`·`--sp-4`·`--r-1`·`--shadow-1`·`--dur-1` 등 `--이름-숫자`)는 *값*이라 매핑 대상이 아니다 — 대상 시스템의 팔레트/스케일 값으로 흡수하면 된다.
> spotlog는 **다크 단일**이다(라이트는 P1). 대상이 라이트/다크 양모드면 아래 역할에 양쪽 값을 배정.
> 원본 정의: `projects/spotlog/foundation/tokens.css`.

## 색 — 역할(semantic)

| spotlog semantic 토큰 | 역할 | 다크 값(참고) | 대상 토큰(매핑 — 채워서 쓰기) |
|---|---|---|---|
| `--color-bg` | 앱 배경 | `--gray-950` #0b0e11 | 예: `--background` / `theme.colors.bg` |
| `--color-surface` | 카드·시트 표면 | `--gray-900` #12161a | `--surface` / `colors.surface` |
| `--color-surface-2` | 중첩 표면(트레이·입력·셀) | `--gray-800` #1a1f24 | `--surface-elevated` |
| `--color-text` | 본문 텍스트(AA 4.5:1+) | `--gray-50` #f3f5f7 | `--text` / `colors.fg` |
| `--color-text-muted` | 보조 텍스트(주소·거리·메타) | `--gray-300` #9aa4ae | `--text-muted` |
| `--color-border` | 구분선·카드 보더 | `--gray-700` #262c33 | `--border` |
| `--color-border-strong` | 강조 보더·컨트롤 외곽 | `--gray-600` #363d45 | `--border-strong` |
| `--color-primary` | 액센트(장소·핀·CTA) = 코랄 | `--coral-500` #ff6b5c | `--primary` / `colors.accent` |
| `--color-primary-hover` | 액센트 호버 | `--coral-400` #ff8576 | `--primary-hover` |
| `--color-on-primary` | 코랄 위 텍스트(대비) | `--gray-950` #0b0e11 | `--on-primary` |
| `--color-primary-weak` | 선택/강조 배경(코랄 틴트) | #2a1613 | `--primary-subtle` |
| `--color-success` | 성공·공개 신호 | `--green-400` #4ade80 | `--success` |
| `--color-warning` | 주의·미분류 신호 | `--amber-400` #fbbf24 | `--warning` |
| `--color-danger` | 위험·삭제 | `--red-400` #f87171 | `--danger` |

## 타이포 역할 (스케일 숫자값 `--fs-*`는 primitive — 흡수)

| spotlog 토큰 | 역할 | 값 | 대상 매핑 |
|---|---|---|---|
| `--lh-tight` | 좁은 행간(제목) | 1.3 | `--leading-tight` |
| `--lh-base` | 기본 행간(본문) | 1.55 | `--leading-normal` |
| `--fw-regular` | 본문 굵기 | 400 | `--font-regular` |
| `--fw-medium` | 중간 굵기 | 500 | `--font-medium` |
| `--fw-semibold` | 강조 굵기(장소명·버튼) | 600 | `--font-semibold` |
| `--fw-bold` | 굵게(헤더·수치) | 700 | `--font-bold` |

## 모양·모션 역할

| spotlog 토큰 | 역할 | 값 | 대상 매핑 |
|---|---|---|---|
| `--r-full` | 완전 둥근(칩·핀·아바타·스위치) | 999px | `--radius-full` |
| `--ease-standard` | 표준 이징(상태 전환) | cubic-bezier(.2,0,.2,1) | `--ease-standard` |
| `--ease-out` | 진입 이징(시트·카드 rise) | cubic-bezier(.16,1,.3,1) | `--ease-out` |

> 라운드 스케일 `--r-1`(8px)·`--r-2`(12px)·`--r-3`(16px), 간격 `--sp-*`(4~40px), 타입 `--fs-*`(11~24px), 그림자 `--shadow-1/2`, 모션 시간 `--dur-1`(130ms)/`--dur-2`(220ms)는 primitive 값 — 대상 스케일에 대응시키면 된다.

## 제품 전용 색(파운데이션 아님 — 컴포넌트/화면 내 결정)

- 지도 목업의 공원/물 표현색(`map-pin.html`의 옅은 green/blue 블롭)은 **지도 컴포넌트 전용**이라 파운데이션 토큰이 아니다. 실 지도 SDK 연동 시 SDK 테마에 위임한다.
