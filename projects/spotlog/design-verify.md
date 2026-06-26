# spotlog — 독립 검증 (design §C step 5 / 하이파이)

검증자: design-verifier (독립 서브에이전트) — 빌더·메인과 다른 컨텍스트
대상: screens/        ← 검증한 폴더(screens 또는 screens-<variant>)

검증 범위: index.html, upload-select.html, upload-group.html, map-pin.html, upload-publish.html, card-detail.html, explore.html, profile.html (8화면 전부 직접 Read)
기준 문서: 00-flow.md(흐름·화면별 구성·상태 계약), PRD §8, foundation/tokens.css(2단 토큰, 톤: "사진이 주연 / 장소·핀 = 코랄 액센트 / 다크 단일")

## 화면별 render-check
| 화면 | thin | bad | variantsIdentical | off-brief | deadControl | stateInert | 판정 |
|---|---|---|---|---|---|---|---|
| index.html | ok | ok | ok | ok | ok | ok | PASS |
| upload-select.html | ok | ok | ok | ok | ok | ok | PASS |
| upload-group.html | ok | ok | ok | ok | ok | ok | PASS |
| map-pin.html | ok | ok | ok | ok | ok | ok | PASS |
| upload-publish.html | ok | ok | ok | ok | ok | ok | PASS |
| card-detail.html | ok | ok | ok | ok | ok | ok | PASS |
| explore.html | ok | ok | ok | ok | ok | ok | PASS |
| profile.html | ok | ok | ok | ok | ok | ok | PASS |

## 화면별 검증 근거 (요약)

- **index.html** — 시드 카드 3개(공개/비공개/좌표만 폴백 라벨 — 00-flow §SC1 폴백 계약 충족), 빈 상태 데모 토글(`#emptyDemo` aria-pressed ↔ `#feedEmpty`/`#feedList` hidden 전환 = 실상태 변화). 카드·내비 4개 `<a>` 모두 와이어드, 홈은 current span. 사진 자리 그라데이션은 `--color-primary-weak`(#2a1613, 극히 어두운 코랄 틴트)로 사실상 중립 — 코랄 남용 아님.
- **upload-select.html** — 16셀 동적 생성, `role=checkbox`/aria-checked 토글 + `#selCount` 증감 + 선택순서 배지 + `#nextBtn` disabled 해제까지 마크업/JS로 실제 변동. 셀의 다색 hsl 그라데이션은 "휴대폰 갤러리의 서로 다른 실사진"을 모사한 picker 썸네일이라 브랜드 표면이 아님 — 허용. 뒤로/다음 와이어드.
- **upload-group.html** — 핵심 화면. 추정 장소명 버튼, 후보 팝오버(`#poiPopover` role=dialog, 후보 3건/0건 폴백 분기), 후보 선택 시 카드 장소명 갱신+✓confirmed, "지도에서 직접 지정"→map-pin, 미분류 트레이 [이동]→행 제거+카운트−1+0이면 섹션 숨김. 모든 인터랙션 관측 가능. 사진=surface-2 중립, 코랄은 `.pin`만.
- **map-pin.html** — (직전 누락 화면) 이번엔 완전 존재·동작. 지도 목업(격자·도로·공원=그린/물=블루 = 지도 관례, "지도 목업" 라벨 명시), 코랄 핀, 핀위/핀아래 버튼→`#coord` 좌표 텍스트 변화+핀 이동, 라벨 입력→핀 위 미리보기 반영, 확정→upload-group. 죽은 컨트롤 없음.
- **upload-publish.html** — 메모/태그/공개스위치. 공개 토글 **기본 비공개**(aria-checked=false, 고지 "비공개로 게시됩니다") → 토글 시 aria-checked 반전+`is-public`+고지문구/아이콘 변화(00-flow §SC6·Q2 계약 충족). 태그 추가→칩 생성/삭제, 게시→index. 와이어드.
- **card-detail.html** — 히어로/썸네일4/장소/메타/메모/태그/위치목업/편집. 썸네일 탭→`aria-pressed` 단일활성+`#hero` 대표사진 텍스트 교체(실상태 변화). 히어로 코랄 radial(.28, 좌상단→55%서 소멸)은 지배 톤이 gray-700~950이고 썸네일·본문 사진자리는 중립 — 사진 위 웜라이트 액센트로 읽혀 off-brief 아님(profile 과거 FAIL=타일 전면 코랄/그린 채움과 다른 종류). 편집은 upload-group으로 와이어드.
- **explore.html** — 타인 공개 카드 3개(작성자행→profile, 카드→card-detail), 빈 상태 데모 토글 동작. `.ph` 코랄 radial 22%는 좌상단 옅은 웜틴트로 base 중립 gray, 아바타 코랄 그라데이션은 이니셜 모노그램(사진 아님, 표준 액센트 패턴) — 허용 범위. 내비 와이어드, 탐색 current span.
- **profile.html** — **직전 off-brief FAIL 수정 재확인 완료.** 아바타: `--color-surface-2` 중립 단색 + `--color-border-strong` 절제 보더(코랄 글로우 제거, 코드주석 "사진 placeholder 중립; 코랄은 .pin 액센트에만"과 일치). 사진 타일 `.ph`: surface-2/surface/bg 사이 중립 그라데이션 변주(코랄/그린 채움 제거). 코랄은 `.pin`(svg fill primary)·grid-head bar·팔로우 CTA·current 내비 = 정당한 액센트로만 잔존 → **on-brief 확인**. 팔로우 버튼: aria-pressed 반전 + 라벨 팔로우↔팔로잉 + `#followerCount` ±1 실변동. 타일/내비 와이어드.

## 재작업 지시 (FAIL이면 화면별 구체 지시)
(없음 — 전 화면 PASS)

## 종합
RESULT: PASS
