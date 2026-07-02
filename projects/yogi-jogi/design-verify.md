# yogi-jogi — 하이파이 독립 검증 (design-verify) · 4차(다크모드) · 지도 히어로 카드 홈 + 컬러 사진

검증자: design-verifier (독립 서브에이전트, N=3 다수결, 렌더 스크린샷 기반) — 빌더·메인과 다른 컨텍스트

대상: screens/

## 화면별 render-check 판정

| 화면 | thin | bad | variantsIdentical | off-brief | deadControl | stateInert | wireframey | 판정 |
|---|---|---|---|---|---|---|---|---|
| feed.html | ok | ok | ok | ok | ok | ok | ok | PASS |
| map-home.html | ok | ok | ok | ok | ok | ok | ok | PASS |
| search.html | ok | ok | ok | ok | ok | ok | ok | PASS |
| post-detail.html | ok | ok | ok | ok | ok | ok | ok | PASS |
| upload-1-gallery.html | ok | ok | ok | ok | ok | ok | ok | PASS |
| upload-2-classify.html | ok | ok | ok | ok | ok | ok | ok | PASS |
| upload-4-meta.html | ok | ok | ok | ok | ok | ok | ok | PASS |
| profile-me.html | ok | ok | ok | ok | ok | ok | ok | PASS |
| profile-friend.html | ok | ok | ok | ok | ok | ok | ok | PASS |
| notifications.html | ok | ok | ok | ok | ok | ok | ok | PASS |
| auth.html | ok | ok | ok | ok | ok | ok | ok | PASS |
| onboarding.html | ok | ok | ok | ok | ok | ok | ok | PASS |
| follow-seed.html | ok | ok | ok | ok | ok | ok | ok | PASS |
| settings.html | ok | ok | ok | ok | ok | ok | ok | PASS |

각 행은 N=3 다수결 판정(voters=3). 한 항목이라도 ng면 그 화면은 FAIL.

## 판정 요약 (3차 재검증 후)

- 3차 재빌드 1차 검증: 13 PASS + settings FAIL(bad — 행 제목·설명이 자간 없이 붙는 조판, ‘동선 공개지도에…’). §0 안정성 계약에 따라 메인이 외과 보정: `.row .k/.desc` + `.opt .ot/.osub`에 `display:block` 추가해 제목/설명 세로 스택 분리.
- **settings 재검증**: 독립 design-verifier N=3 재판정 후 bad 해소(라디오·토글 라벨 정상 분리) → **PASS**. (탭바가 콘텐츠 위 겹쳐 보이던 건 fullPage 스크린샷의 fixed 요소 아티팩트 — body padding-bottom 있어 실 390×844 뷰포트 정상.)
- 그 외 13화면: 하이파이 실측 Playwright(390×844) **31/31 green**(죽은 컨트롤 0·axe serious 0·도달성)로 보정 확인 — 시트 visibility(feed·profile-friend·upload-2)·oos 대괄호·map-hero role·steps role·라벨 스택 외과 수정.
- 3차 = 홈(feed)=지도 히어로 카드 피드(동선 메인+컬러 사진), map-home=장소 상세, 사진=컬러/UI=모노. 트렌드 85(≥80)·pixelChecked:true.

## 4차: 다크모드 전환 (사용자 재피드백 "배경 검정")
- 톤: 라이트 모노 → **다크모드**(순검정 #000 배경·근검정 카드·흰 텍스트/액션(primary=흰), 다크 지도, 흰 핀·흰 동선). **사진은 컬러 유지**(다크 위에서 더 살아남). 레드는 좋아요/미열람만.
- 방식: semantic 토큰 다크로 flip(전파) + 하드코딩 잔재 외과 보정 — 지도 텍스처 밝은색→다크(도로/블록/공원/물), frosted 헤더 `rgba(255,255,255)`→다크, entrance opacity 애니메이션 제거(axe 대비 안정), map-home/onboarding 지도 흰 도로→다크·검정 핀·동선→흰색, notifications 회색 썸네일→컬러.
- 독립 design-verifier N=3 다크 재판정: 지적된 map-home·onboarding(반쪽 전환)·notifications(회색 썸네일) 외과 보정 후 **14/14 PASS**. 토큰 대비 다크 AA green · 하이파이 Playwright 31/31(죽은 컨트롤 0·axe serious 0).

RESULT: PASS
