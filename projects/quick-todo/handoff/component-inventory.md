# quick-todo — 컴포넌트 인벤토리

쇼케이스 원본: `projects/quick-todo/components/*.html` (각 파일에 variant/state 나열).
모든 컴포넌트는 단일 기능 화면 **`screens/main.html`** 에서 조립된다(진입 화면 `screens/index.html`은 헤더의 theme-toggle만 공유).

| 컴포넌트 | 파일 | variant / state | 쓰이는 화면 |
|---|---|---|---|
| 할 일 항목 | `todo-item.html` | 미완료 / 완료(취소선+muted) / 긴 텍스트 줄바꿈 · hover 시 삭제 강조 | `main.html` |
| 필터 바 | `filter-bar.html` | 전체 선택 / 미완료 선택 / 완료 선택 (단일선택 세그먼트) + "남은 할 일 N개" 카운터 | `main.html` |
| 입력 + 추가 | `input-add.html` | 비어있음(placeholder) / 포커스 / 입력됨 | `main.html` |
| 테마 토글 | `theme-toggle.html` | 라이트(aria-pressed=false) / 다크(aria-pressed=true) | `main.html`, `index.html` |
| 빈 상태 | `empty-state.html` | 전체 0개 / 필터 매칭 0개(완료·미완료) | `main.html` |

## 컴포넌트별 계약 요점 (구현 시 지킬 것)
- **할 일 항목:** 행 = `[체크박스] [텍스트] [삭제]`. 완료는 `class="done"` + 취소선 + `--color-text-muted`(불투명도로 흐리지 말 것 — AA 미달). 삭제 버튼은 모바일에서도 **항상 노출**, hover는 강조만.
- **필터 바:** 상호배타 3택1, 선택 탭 `aria-selected="true"` + `aria-current="true"`. 데이터 필터가 아니라 **뷰 상태**(파생 계산).
- **입력 + 추가:** `trim` 후 빈 값 무시. Enter / 버튼 둘 다 추가. 추가 후 입력 비우고 포커스 유지.
- **테마 토글:** 2상태, `aria-pressed` 반전, 선택 영속.
- **빈 상태:** (a) 전체 0개 "할 일이 없습니다" (b) 필터 매칭 0개 — 필터별 메시지. 절제된 안내(과한 일러스트 금지).
