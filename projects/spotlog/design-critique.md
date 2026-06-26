# spotlog — 트렌드 감정 (design-critique)

- 감정자: design-trend-expert (웹검색 기반 트렌드 감정)
- 대상: chosen = screens/ (원본)
- 임계값: 80
- 원본 종합 점수: **84** — 임계 80 통과 → 자동 리디자인 강제 트리거 아님
- 리디자인 여부: **아니오** (84 ≥ 80, variant 없음)

## 원본 감정

방향 적합성 판정 결과: spotlog 하이파이는 brief(00-flow·PRD §8)가 택한 "사진 주연·차분한 다크·절제된 크롬·카드 위계·모바일 폭 컬럼" 방향 안에서 현행 기준에 부합한다. off-brief 징후 없음 — 다크 단일 유지, 480px 중앙 컬럼을 1280px까지 그대로 유지(반응형 분기 없음, 의도대로), 코랄 액센트 절제, 외부 의존성 0. 트렌드 추종으로 방향을 배신한 흔적은 없으며 방향 교체는 불필요하다.

강점(방향 안의 완성도):
- 색 운용·대비: bg를 순흑(#000)이 아닌 #0b0e11로 두고 surface 램프를 깐 것은 2025 다크 베스트프랙티스(순흑 회피, 사진 대비 완충)와 정확히 일치. 본문 gray-50/bg ≈ 12:1+, muted gray-300/bg ≈ 7.8:1, 코랄 위 dark-text ≈ 7:1 — WCAG AA 본문·UI 모두 통과(G3 충족). 토큰은 2단 semantic만 사용해 시스템 일관성이 높다.
- 상태 표현: 빈 상태(index·explore), switch 기본 비공개+고지 문구 변화(upload-publish), 후보 팝오버/확정 체크(upload-group), 미분류 트레이 이동 애니메이션+카운트, 팔로우 aria-pressed 반전 — 상태 표현은 이 브리프에서 가장 높은 수준. 프라이버시 고지(F7) 시각화도 공개/비공개 보더 색 전환으로 명료.
- 모바일 패턴: POI 선택을 popover가 아닌 grip 달린 bottom-sheet로 띄운 것은 모바일 현행 기준(모바일에선 popover 대신 bottom sheet)에 부합. map-pin 목업(그라디언트 지도·가짜 도로·pulse 핀·라벨 미리보기)은 8화면 중 비주얼 완성도 최상.

방향 안에서의 미달·완성도 갭(임계 80은 넘으나 폴리시 필요):
1. "사진이 주연" 톤 대비 사진 표현이 가장 약하다. 대부분 카드의 사진 자리가 평평한 회색 그라디언트+"사진" 텍스트다. 특히 card-detail의 히어로(코랄 틴트 단일 그라디언트 + "대표 사진 1" 태그)와 썸네일 스트립이 회색이라, 사진을 가장 떠받들어야 할 플래그십 상세 화면이 가장 비어 보인다. upload-select가 셀마다 hue를 변주해 가장 사진같이 보이는 것과 대비된다 — 목업이라도 이 톤차를 메워야 방향 완성도가 산다.
2. 동일 컨트롤의 크로스-스크린 불일치. (a) 뒤로가기 버튼이 화면마다 4종(upload-group=사각 36px, map-pin=pill"뒤로", card-detail=pill"← 뒤로", upload-publish=원형 38px ←, upload-select=svg chevron 원형). (b) 하단 내비 아이콘이 index·explore는 이모지(⌂🔍＋◔), profile만 정제된 인라인 SVG — 이모지는 OS별 렌더가 갈리고 "절제된 크롬" 톤에서 가장 저렴해 보이는 요소다. (c) 셸 배경이 일부는 --color-surface, 일부는 --color-bg로 갈려 화면 전환 시 지면 톤이 미세하게 튄다. 이 셋은 컴포넌트 일관성 항목의 실질 감점.
3. 타이포 리듬: 핵심 '장소 카드'가 index(pname fs-15, r-2)와 explore(pname fs-17 bold, r-3, 작성자 행)에서 사실상 다른 컴포넌트로 렌더된다. 타인 카드 차별은 정당하나 제목 스케일·라운드까지 갈리면 한 제품의 같은 단위로 읽히는 결속이 약해진다.

종합: 위계·여백·색 운용·상태 표현·뷰포트 적합성은 방향 기준 상회, 사진 표현 완성도와 컴포넌트(뒤로/내비/셸) 일관성이 끌어내린다. 종합 84 — 임계 80 통과, 자동 리디자인 트리거 아님. 다만 위 3건은 폴리시 지시로 남긴다.

## 화면별 점수

| 화면 | 점수 | 지적 |
| --- | --- | --- |
| index.html | 82 | 세로 피드 위계·여백 양호, 빈 상태 토글·좌표만 카드 폴백까지 충실. 감점: 사진 묶음이 평평한 그라디언트, 하단 내비가 이모지(⌂🔍＋◔)라 절제된 크롬 톤에서 가장 약함. 카드 제목 fs-15는 explore와 불일치. |
| upload-select.html | 86 | 인스타식 다중 선택의 인터랙션·상태(선택순 배지·카운터·다음 활성)가 정밀. 셀별 hue 변주로 8화면 중 가장 '사진다운' 자리표시. svg 뒤로. 거의 흠 없음. |
| upload-group.html | 84 | 핵심 화면. grip 달린 bottom-sheet 후보 팝오버·추정/확정 라벨·미분류 트레이 이동 애니메이션+카운트가 현행 기준 부합. 감점: 카드 사진이 단조로운 회색 'ph', 셸 bg가 --color-bg로 타 화면과 갈림, 뒤로 버튼 스타일 단독(사각). |
| map-pin.html | 88 | 지도 목업(그라디언트+가짜 도로·공원/물 blob·pulse 핀·라벨 미리보기·좌표 tabular-nums)이 비주얼 완성도 최상. 목업임을 명시한 태그도 정직. 핀 이동 마이크로인터랙션 좋음. |
| upload-publish.html | 83 | 공개 범위 switch·고지 문구/보더 색 전환으로 프라이버시(F7)를 명료히 시각화, 태그 칩 추가 상태 표현 양호. 감점: summary/notice의 이모지(📍🔒🌐) 의존, 셸 bg --color-bg로 갈림. |
| card-detail.html | 79 | 위계(fs-24 장소명·메모 인용·미니맵)는 좋으나 '사진 주연' 플래그십인데 히어로가 단일 코랄 그라디언트+텍스트 태그, 썸네일도 회색이라 가장 비어 보임. 메타 아이콘(◎◷)이 이모지/기호 의존. 방향 톤 대비 완성도가 가장 미달 — 우선 폴리시 대상. |
| explore.html | 83 | 작성자 행+공개 배지+칩+메타로 타인 카드 리치함 양호, 빈 상태 충실. 감점: 이모지 내비, 핵심 장소 카드가 index와 제목 스케일·라운드 불일치(r-3/fs-17 vs r-2/fs-15). |
| profile.html | 85 | 정제된 인라인 SVG 내비(8화면 중 유일·최상 — 이 세트로 통일해야 할 기준), 팔로우 aria-pressed/채움-해제 상태, 통계 행·타일 그리드(틴트 그라디언트 변주) 깔끔. 셸 bg --color-bg로 일부와 갈림은 동일 이슈. |

## 권고(리디자인 지시 — 우선순위 순)

방향 교체 없이, 방향 안의 완성도만 끌어올리는 구체 지시(우선순위 순):

1) [card-detail 최우선] 사진 주연 톤 회복. 히어로를 단일 그라디언트가 아니라 upload-select 식의 다중 hue/각도 변주 또는 다층 그라디언트(피사체-바닥 명암)로 풍부화하고, 썸네일 스트립도 회색 단조를 깨 각 썸네일에 서로 다른 톤을 준다. 목업이라 외부 이미지 없이도 가능 — upload-select의 hue 배열 기법을 재사용.

2) [전 화면] 사진 자리표시 통일·풍부화. index·upload-group·explore의 '사진' 회색 블록을 upload-select·profile에서 쓴 코랄 틴트/hue 변주 그라디언트로 통일해 "사진이 주연"인 톤을 8화면에 일관 적용.

3) [뒤로 버튼 단일화] upload-group/map-pin/card-detail/upload-publish/upload-select의 4~5종 뒤로 affordance를 한 컴포넌트로 통일(권장: upload-select의 원형+svg chevron — 가장 절제됨). foundation/components에 back 컴포넌트로 고정.

4) [내비 아이콘 단일화] index·explore의 이모지 내비(⌂🔍＋◔)를 profile의 인라인 SVG 내비 세트로 교체. 이모지는 OS 렌더 편차+톤 저하 요인 — profile 세트를 표준으로 승격. upload-publish·card-detail·upload-group의 이모지/기호 메타(📍🔒🌐◎◷)도 동일 SVG 라인 아이콘으로 정리.

5) [셸 배경 통일] .shell 배경을 --color-surface 또는 --color-bg 중 하나로 8화면 통일(권장: index·card-detail이 쓰는 --color-surface로 맞춰 카드와 지면 분리감 유지). 현재 upload-group·upload-publish·profile만 --color-bg라 전환 시 지면 톤이 튄다.

6) [장소 카드 결속] index와 explore의 장소 카드 제목 스케일·라운드를 한 기준으로 수렴(예: 둘 다 pname fs-17 + r-2 또는 r-3). 타인 카드의 작성자 행 추가는 유지하되 '같은 장소 카드 단위'로 읽히게 코어 토큰을 공유.

이상은 모두 다크·사진주연·모바일 폭 컬럼 방향 내부의 폴리시다. 종합 84로 임계 80 통과 → 자동 리디자인 강제 트리거는 아니며, 1·2·4번을 우선 반영하면 90대 진입 가능.

## 출처

- https://www.mindinventory.com/blog/how-to-design-dark-mode-for-mobile-apps/
- https://appinventiv.com/blog/guide-on-designing-dark-mode-for-mobile-app/
- https://muksalcreative.com/2025/07/26/dark-mode-design-best-practices-2025/
- https://blog.logrocket.com/ux-design/dark-mode-ui-design-best-practices-and-examples/
- https://blog.logrocket.com/ux-design/bottom-sheets-optimized-ux/
- https://www.eleken.co/blog-posts/popover-ux
- https://mobbin.com/glossary/bottom-sheet
- https://developer.apple.com/design/human-interface-guidelines/popovers
