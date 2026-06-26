# spotlog — 컴포넌트 인벤토리

> 각 컴포넌트의 variant/state + **쓰이는 화면** 매핑. 원본 시트: `projects/spotlog/components/*.html`(다크, semantic 토큰만).
> 셀렉터 계약(role·aria·텍스트·#id)은 화면이 그대로 쓴다 — 구현 시 의미를 보존(마크업은 대상 컨벤션 자유).

## 1. place-card (`components/place-card.html`)
피드의 1차 단위 = 장소 1곳 + 사진 묶음 + 시간 + (옵션)메모·태그 + 공개 표시.
- **Variants:** 공개(코랄 배지) / 비공개(중립 배지) · 다중 사진(대표+그리드) / 단일 사진 · 좌표만(placeName=null → 사용자 라벨/동네 폴백) · 메모·태그 有/無.
- **쓰이는 화면:** `index.html`(내 피드), `explore.html`(타인 카드), `profile.html`(타일 변형), `card-detail.html`(상세 확장).

## 2. bottom-nav (`components/bottom-nav.html`)
글로벌 하단 내비(홈·탐색·＋업로드·프로필).
- **States:** 항목별 활성(aria-current="page", 코랄 강조) — 홈/탐색/프로필 각각. 현재 화면 항목은 비링크(span), 나머지는 `<a href>`.
- **쓰이는 화면:** `index.html`(홈 활성), `explore.html`(탐색 활성), `profile.html`(프로필 활성). ＋업로드는 항상 `upload-select.html`로.

## 3. poi-popover (`components/poi-popover.html`)
장소명 후보 팝오버(SC4). role=dialog, aria-label "장소명 후보", 기본 hidden.
- **States:** 후보 있음(거리순 목록, 1개 선택 강조) / 후보 0건('주변 등록된 장소가 없습니다' + 지도 폴백). 검색 재질의 입력.
- **쓰이는 화면:** `upload-group.html`(카드 장소명 탭 시 오버레이).

## 4. unclassified-tray (`components/unclassified-tray.html`)
미분류 사진 트레이(F3 — 상시 경로, 1급 대우).
- **States:** 미분류 있음(행마다 사진+파일명+사유+'카드로 이동' 버튼, #unclassCount) / 0장(완료 안내·섹션 숨김).
- **쓰이는 화면:** `upload-group.html`.

## 5. visibility-switch (`components/visibility-switch.html`)
공개 범위 스위치 + 공개 고지(F7). role=switch, aria-checked, **기본 비공개**.
- **States:** 비공개(기본, 🔒 고지) / 공개('이 장소가 공개됩니다' 고지). 인터랙티브 토글 데모 포함.
- **쓰이는 화면:** `upload-publish.html`(게시 전). 카드 상세에서 공개범위 변경 진입도 동일 패턴.

## 6. tag-input (`components/tag-input.html`)
메모·태그 입력(F6 — 옵션).
- **States:** 빈 입력(강제 아님) / 입력됨(메모 + 태그 칩, 칩 삭제). 빈 값은 저장 안 함.
- **쓰이는 화면:** `upload-publish.html`. 표시는 `card-detail.html`·`index.html`·`explore.html` 카드의 chips.

## 7. photo-select-grid (`components/photo-select-grid.html`)
사진 다중 선택 그리드(SC2). role=checkbox + aria-checked, 선택 카운터 + '다음' 활성화.
- **States:** 선택됨(체크 표식·카운터·다음 활성) / 미선택(0장·다음 비활성).
- **쓰이는 화면:** `upload-select.html`(다중 선택). `card-detail.html` 썸네일 스트립도 같은 시각언어(단일 활성, aria-pressed).
