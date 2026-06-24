# 컴포넌트 인벤토리 — family-todo

> 출처: `screens/app.css` (스타일) + `screens/index.html`·`list.html` (마크업·동작).
> 각 항목: 용도 · variant/state · 토큰 · 모션 · 접근성 계약. **접근성 계약(role/aria/텍스트)은 `screens.spec.js`가 의존하므로 유지하면 동작 검증이 따라온다.**

---

## 1. 버튼 `.btn`
- **variant**: `primary`(그라데이션 `--gradient-primary` + `--shadow-primary`) · `secondary`(surface-2+border) · `ghost`(텍스트만, primary색) · `danger`(테두리, danger색) · `disabled`(border 배경, 비활성) · **FAB**(56px 원형, gradient — 현재 화면엔 미사용, 갤러리에만).
- **모션**: `:active` `scale(.95)`; primary `:hover` `brightness(1.06)` (그라데이션 유지). 전환 `--ease-spring`.

## 2. 빠른 추가 바 `.addbar` + `.input`
- 하단 sticky. `input`(flex:1) + primary "추가" 버튼. 텍스트만, 즉시 추가.
- 입력 `:focus` → border primary + `0 0 0 3px var(--color-primary-soft)` 링.
- **접근성**: input `aria-label="할 일 빠른 추가"`, 버튼 텍스트 "추가". Enter로도 추가.

## 3. 체크박스 `.cb`
- 22px 원형. 미체크=테두리만 / 체크=primary 채움 + 안쪽 `✓`(.tick).
- **state**: `role="checkbox"` `aria-checked="true|false"`, `tabindex=0`.
- **모션**: 체크 시 컨테이너 `scale(1.06)` + tick `scale(0→1)` 둘 다 `--ease-spring`. Enter/Space 토글.

## 4. 할 일 항목 행 `.item`
- 구성: `.cb` + `.body`(`.txt` + 선택 `.badge`) + `.del`("삭제").
- **state**: `.done` → `.txt` 취소선 + subtle색. `data-id`로 식별.
- **모션**: 추가/복귀 시 `.entering`(itemIn: 위에서 스프링) / 삭제 시 `.leaving`(itemOut: 옆으로 밀려 height 0, animationend 후 제거 — reduced-motion 대비 240ms fallback).
- **접근성**: 체크박스 role, 삭제 버튼 `aria-label="삭제"`, `.txt` 탭 → S3 편집.

## 5. 날짜 배지 `.badge`
- `📅 YYYY-MM-DD`. `--color-accent-warm-soft` 배경 + `--color-accent-warm` 글자, pill. 날짜 있는 항목에만.

## 6. 완료됨 접이식 `.secToggle` + `.clearDone`
- 헤더 "완료됨 · 흔적 N개" + `.chev`(`aria-expanded`로 90° 회전). 기본 접힘.
- 펼치면 완료 항목들 + "완료 비우기" 버튼(danger 텍스트, border).
- **접근성**: 토글 버튼 텍스트에 "완료됨" 포함, `aria-expanded`. 정리 버튼 "완료 비우기".

## 7. 토글 스위치 `.sw` (S3 날짜 on/off)
- 48×28 트랙 + 22 knob. off=border-strong / on=primary. knob `--ease-spring`로 슬라이드.
- **접근성**: `role="button"` `aria-pressed` `aria-label="날짜 추가"`. (스위치 의미지만 spec 계약상 button+aria-pressed 유지.)

## 8. 빈 상태 `.empty`
- 큰 🏠(bob 바운스 애니) + "아직 우리집 할 일이 없어요. / 아래에 첫 할 일을 남겨보세요." 진입 fadeUp.
- `.empty.mini` = "진행 중인 일이 없어요 🎉"(완료만 남았을 때).

## 9. 스켈레톤 `.skel` (로딩)
- 3줄 바, sheen 애니(좌→우 빛 흐름). 동기화 중 표현.

## 10. 오프라인 배너 `.banner` `#offline`
- warn-soft 배경. "⚠ 오프라인 — 연결되면 자동으로 맞춰져요" + `[범위 밖]` 주석. dropIn 등장. `hidden` 토글.

## 11. 토스트 `.toast`
- 하단 중앙, text/bg 반전 pill. `.show`로 fade+slide-up, 1.8s 후 사라짐. 저장 성공 등 피드백.

## 12. 바텀시트 `.sheet` + `.scrim` (S3)
- 목록 위로 올라오는 편집 시트. scrim(반투명 dim) + sheet(상단 둥근, grab 핸들).
- 구성: 제목("할 일 편집") · 내용 `textarea`(placeholder "무엇을 할까요?") · err · 날짜 토글+`#date` · "저장"/"삭제".
- **모션**: `--dur-sheet`(420ms) `--ease-emphasized`로 `translateY(100%→0)`. 닫힘은 `visibility:hidden`으로 비가시(transform 애니 유지하면서 스크린리더/테스트에 숨김).
- **검증**: 내용 비면 "저장" `disabled`. scrim 클릭 → 닫힘.

## 13. 헤더 `.app-header` / 카운트 `.count` / 데모바 `.demobar`
- 헤더: "🏠 우리집" + "🔒 잠금"(→ S1) sticky.
- 카운트: "진행 중 N · 완료됨 M".
- **데모바**: 상태(정상/로딩/오프라인/전체비우기) 토글 — **검증·시연용 보조 컨트롤**. 실제 제품에선 제거하거나 dev 전용으로 감춰도 된다(상태 자체는 백엔드 신호로 구동).

---

### 화면별 조립
- **S1** = 브랜드 마크(gradient) + PIN 입력 + primary "입장/시작" + 에러(shake) + 힌트.
- **S2** = 헤더 + (데모바) + 오프라인 배너 + 카운트 + 리스트(진행중 `.item` × N → 완료됨 접이식) + 빠른 추가 바 + 토스트 + (숨은) 바텀시트.
- **S3** = S2 위 바텀시트(편집 전용; 추가는 빠른 추가 바로).
