# quick-todo — 토큰 매핑표 (semantic → 대상 시스템)

우리 **semantic 역할 토큰**을 대상 프로젝트의 토큰 시스템에 **매핑**한다 — 통째 복붙 금지.
primitive(`--gray-50`·`--indigo-600`·`--fs-14`·`--sp-2` 등 값 토큰)는 매핑 대상이 아니다(값이므로 대상 시스템의 원시 팔레트/스케일로 흡수).
원본 정의: `projects/quick-todo/foundation/tokens.css` (표준 2단: primitive → semantic, 라이트/다크 양 모드).

## 색 (라이트 / 다크 — 같은 역할명, 값만 교체)

| 우리 semantic 토큰 | 역할 | 라이트 값 | 다크 값 | 대상 토큰(채우세요) |
|---|---|---|---|---|
| `--color-bg` | 페이지 배경 | `#f6f7f9` | `#101216` | |
| `--color-surface` | 카드/입력/항목 표면 | `#ffffff` | `#181b20` | |
| `--color-surface-2` | 보조 표면(세그먼트 트랙 등) | `#eceef1` | `#25282e` | |
| `--color-text` | 본문/제목 텍스트 | `#181b20` | `#f6f7f9` | |
| `--color-text-muted` | 보조 텍스트·카운터·완료 항목 | `#515862` | `#99a1ae` | |
| `--color-border` | 기본 구분선/테두리 | `#dde0e6` | `#25282e` | |
| `--color-border-strong` | 강조 테두리(입력·체크박스) | `#c4c9d2` | `#3a3f47` | |
| `--color-primary` | 브랜드/주 액션(추가 버튼·선택 탭) | `#4f46e5` | `#818cf8` | |
| `--color-primary-hover` | 주 액션 hover | `#4338ca` | `#a5b4fc` | |
| `--color-on-primary` | primary 위 텍스트 | `#ffffff` | `#101216` | |
| `--color-primary-weak` | 선택 탭 배경·포커스 링 | `#eef0fe` | `#20233a` | |
| `--color-danger` | 삭제/위험 | `#dc2626` | `#f87171` | |
| `--color-success` | 완료 체크 채움 | `#16a34a` | `#4ade80` | |

## 타이포·라운드·모션 (역할 토큰)

| 우리 semantic 토큰 | 역할 | 값 | 대상 토큰(채우세요) |
|---|---|---|---|
| `--lh-tight` | 제목 줄높이 | `1.3` | |
| `--lh-base` | 본문 줄높이 | `1.5` | |
| `--fw-regular` | 기본 굵기 | `400` | |
| `--fw-medium` | 중간 굵기(버튼·라벨) | `500` | |
| `--fw-bold` | 굵게(제목·선택 탭) | `700` | |
| `--r-full` | 완전 둥근 모서리 | `999px` | |
| `--ease-standard` | 표준 가속(상태 전이) | `cubic-bezier(.2,0,.2,1)` | |
| `--ease-out` | 감속(행 등장·체크) | `cubic-bezier(.16,1,.3,1)` | |

> 다크 모드는 별도 토큰 세트가 아니라 **같은 역할명의 값 교체**다(`:root[data-theme="dark"]`). 대상 시스템의 테마 전환 방식(class·data-attr·CSS media)에 맞춰 같은 역할로 매핑하라.
> primitive 스케일(`--fs-*`·`--sp-*`·`--r-1..3`·`--shadow-1..2`·`--dur-1..2`)은 대상의 타이포/스페이싱/라운드/모션 스케일에 수치로 대응시키면 된다.
