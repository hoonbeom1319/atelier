# household-ledger — 컴포넌트 인벤토리

> 각 컴포넌트의 variant/size/state + **쓰이는 화면** 매핑. 원본: `../components/*.html` (브라우저로 열어 상태 확인).
> 모든 컴포넌트는 semantic 토큰만 참조 — 대상 시스템 토큰으로 매핑해 구현(token-mapping.md).

## buttons (`../components/buttons.html`)
| variant | states / sizes | 쓰임 |
|---|---|---|
| Primary (fill) | default · hover · **disabled** · large(풀폭) | `add.html` 저장(하단 고정) · `detail.html` 수정 |
| Secondary (outline) | default | `detail.html` 보조 액션 |
| Ghost (text) | default | 링크형 액션(전체 보기 등) |
| Danger | default | `detail.html` 삭제 · 삭제 확인 |
| FAB (pill) | default + `--shadow-fab` | `index.html` 빠른 입력(→add) |

> 저장 버튼: 유효성 미충족 시 `disabled`(회색), 충족 시 primary fill 활성. 상태 전이가 입력 화면의 핵심.

## chips (`../components/chips.html`)
| variant | states | 쓰임 |
|---|---|---|
| Segment (단일선택) | `aria-pressed` true/false | `add.html` 수입/지출 · `stats.html` 수입/지출 탭 · `list.html` 기간 |
| Filter chip (다중 토글) | pressed/unpressed | `list.html` 카테고리·멤버·공동/개인 필터 |
| Category tile (아이콘 그리드, 단일선택) | pressed/unpressed | `add.html` 카테고리 선택 |
| Member chip | pressed/unpressed | `add.html` 입력 멤버 |
| Member avatar (색 구분) | 나/배우자/… | `index.html` · `list.html` · `detail.html` · `stats.html` 멤버 귀속 표시 |

> 아이콘은 단색 라인 픽토그램(`../_icons.md`) — 멀티컬러 이모지 금지(신뢰형 금융앱 톤).

## cards (`../components/cards.html`)
| variant | 구성 | 쓰임 |
|---|---|---|
| Summary card | 지출·수입·잔액 3분할, tabular-nums | `index.html` 이번달 요약 · `stats.html` 요약 |
| Transaction row | 카테고리 아이콘 · 메모 · 멤버 아바타 · 금액(지출 먹색/수입 블루) · 🔁 자동 뱃지 | `index.html` 최근 거래 · `list.html` 거래 행 |
| Recurring card | 카테고리 아이콘 · 금액 · 주기 · **다음 발생일 강조** · 활성 토글 | `recurring.html` 규칙 목록 |

## 차트 (stats 전용, 인라인)
| 요소 | 구현 | 쓰임 |
|---|---|---|
| Donut (카테고리 비중) | 순수 CSS conic-gradient, 상위5+기타, `--cat-1..5` hue 분리 | `stats.html` |
| 범례 (legend) | 색칩=슬라이스 1:1 + 아이콘 + 이름 + % + 금액 | `stats.html` |
| Member bar (가로막대) | 멤버별 지출, 2색 분리 | `stats.html` |

> 화면↔컴포넌트 역참조: `index.html`(summary·transaction row·avatar·FAB) / `add.html`(segment·category tile·member chip·buttons) / `list.html`(filter chip·transaction row·avatar) / `detail.html`(buttons·avatar) / `stats.html`(segment·summary·donut·legend·member bar) / `recurring.html`(recurring card·buttons).
