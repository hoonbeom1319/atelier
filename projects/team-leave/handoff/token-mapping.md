# team-leave — 토큰 매핑표 (semantic → 대상 시스템)

> atelier의 **semantic 토큰**을 받는 쪽 프로젝트의 토큰 시스템에 **매핑**한다. 통째 복붙 금지 — 대상의 네이밍·스케일에 맞춰 대응시킨다.
> primitive(`--gray-50..900`·`--indigo-*`·`--green/amber/red/blue-*`·`--sp-1..10`)는 *값*이라 매핑 대상이 아니다(semantic이 이들을 참조). 대상 시스템이 자기 팔레트로 semantic을 채우면 된다.
> 원본 정의: `projects/team-leave/foundation/tokens.css` (표준 2단: primitive → semantic).

## 색 — 표면·텍스트·경계

| atelier semantic | 역할 | 현재 값(참조) | 대상 토큰(채우기) |
|---|---|---|---|
| `--color-bg` | 앱 배경 | gray-50 #f7f8fa | |
| `--color-surface` | 카드·테이블·패널 표면 | #ffffff | |
| `--color-surface-alt` | 옅은 표면(헤더 행·hover) | gray-50 | |
| `--color-text` | 본문 텍스트 | gray-900 #181b20 | |
| `--color-text-muted` | 보조 텍스트 | gray-600 #555c69 | |
| `--color-text-subtle` | 캡션·메타 | gray-500 #6b7280 | |
| `--color-border` | 구분선·기본 테두리 | gray-200 | |
| `--color-border-strong` | 강한 테두리(입력·버튼) | gray-300 | |

## 색 — 강조(primary)

| atelier semantic | 역할 | 현재 값(참조) | 대상 토큰(채우기) |
|---|---|---|---|
| `--color-primary` | 강조·CTA·활성 | indigo-500 #4f46e5 | |
| `--color-primary-hover` | 강조 hover | indigo-600 #4338ca | |
| `--color-on-primary` | primary 위 텍스트 | #ffffff | |
| `--color-primary-soft` | 옅은 강조 배경(활성 pill·선택 행) | indigo-50 #eef0ff | |

## 색 — 상태(색+텍스트, WCAG AA)

| atelier semantic | 역할 | 현재 값(참조) | 대상 토큰(채우기) |
|---|---|---|---|
| `--color-success` | 승인(텍스트) | green-600 #1d7a45 | |
| `--color-success-bg` | 승인 태그 배경 | green-50 | |
| `--color-warning` | 대기(텍스트) | amber-700 #854d0e | |
| `--color-warning-bg` | 대기 태그 배경 | amber-50 | |
| `--color-danger` | 반려·삭제(텍스트) | red-600 #c02626 | |
| `--color-danger-bg` | 반려 태그 배경 | red-50 | |
| `--color-info` | 정보·반차(텍스트) | blue-600 #1f63c4 | |
| `--color-info-bg` | 정보 태그 배경 | blue-50 | |

## 색 — 휴가 종류(캘린더 색 바 · 색+라벨 병기)

| atelier semantic | 역할 | 대상 토큰(채우기) |
|---|---|---|
| `--type-annual-bg` / `--type-annual-fg` | 연차 배경 / 텍스트 | |
| `--type-half-bg` / `--type-half-fg` | 반차 배경 / 텍스트 | |
| `--type-sick-bg` / `--type-sick-fg` | 병가 배경 / 텍스트 | |
| `--type-event-bg` / `--type-event-fg` | 경조사 배경 / 텍스트 | |

> 종류 색은 반드시 **라벨/아이콘 병기**(색맹 안전, G3). 대상 시스템에서 색만 바꾸되 라벨 규칙은 유지.

## 타이포

| atelier semantic | 역할 | 현재 값 | 대상 토큰(채우기) |
|---|---|---|---|
| `--font-sans` | 본문 글꼴 | Pretendard / system-ui | |
| `--fs-display` | 메트릭 숫자(잔여·카운트) | 28px | |
| `--fs-h1` | 페이지 타이틀 | 22px | |
| `--fs-h2` | 섹션 헤더 | 18px | |
| `--fs-h3` | 카드 헤더 | 15px | |
| `--fs-body` | 본문·테이블 | 14px | |
| `--fs-sm` | 보조·라벨 | 13px | |
| `--fs-xs` | 캡션·메타 | 12px | |
| `--lh-tight` | 타이트 행간(헤딩) | 1.25 | |
| `--lh-body` | 본문 행간 | 1.55 | |
| `--fw-regular` / `--fw-medium` / `--fw-semibold` / `--fw-bold` | 굵기 400/500/600/700 | | |

## 모서리·그림자·모션

| atelier semantic | 역할 | 현재 값 | 대상 토큰(채우기) |
|---|---|---|---|
| `--r-sm` / `--r-md` / `--r-lg` / `--r-full` | 라운드 6 / 8 / 12 / pill | | |
| `--shadow-xs` | 카드 기본(거의 안 보임) | elevation 1 | |
| `--shadow-sm` | 카드 | elevation 1+ | |
| `--shadow-md` | 드롭다운·팝오버 | elevation 2 | |
| `--shadow-lg` | 모달·드로어 | elevation 3 | |
| `--dur-fast` / `--dur` | 트랜지션 120ms / 200ms | | |
| `--ease` | 이징 cubic-bezier(.2,.6,.3,1) | | |

> elevation은 4단(0 본문 → 1 카드 → 2 팝오버 → 3 모달/드로어)으로 제한. 깊이는 절제된 그림자 + 경계 + 표면 톤차로만(글래스모피즘·강한 그라데이션 금지).
