# 시장조사 근거 원장 — 요기조기 (Yogi-Jogi)

> 무인 기획(`/forge` §B / forge-plan workflow)에서 **market-researcher** 서브에이전트(웹검색)가 plan 질문을 4개 축으로 갈라 근거화한 기록이다.
> 행마다: **질문 → 근거(출처 URL) → 답/권고 → 신뢰도(grounded | guess)**.
> PRD §11(가정)과 교차참조한다 — **근거를 확보한 항목은 "가정"에서 "근거 있는 결정"으로 승격**(§11.1)되고, 출처를 못 구한 항목만 가정·실측 보완 대상(§11.2)으로 남는다.

조사 축:
- **ⓐ 경쟁/유사 제품** — Mapstr · Polarsteps · Foursquare/Swarm · Instagram Map (핵심기능·차별점·데이터 모델·엣지케이스)
- **ⓑ 실사용자 니즈·불만** — 사진을 장소로 정리/회상하는 페인, EXIF 지오태깅·역지오코딩 정확도 한계, 수동분류 UX
- **ⓒ 도메인 관행** — EXIF GPS·역지오코딩·POI 매핑 데이터 모델, 다중선택→장소 그룹핑 업로드, 공개범위·팔로우 그래프
- **ⓓ 제품 아키타입 IA** — 인증/온보딩·홈피드·다단계 업로드·검색·프로필·알림·설정 등 인스타급 table-stakes 화면 구성

---

## ⓐ 경쟁/유사 제품

| 질문 | 근거(출처) | 답/권고 | 신뢰도 |
|------|-----------|---------|--------|
| 경쟁 제품 핵심기능과 요기조기의 진짜 차별점은? | mapstr.com · medium(Mapstr report) · polarsteps.com(+travel-tracker FAQ) · wikipedia(Swarm) · about.instagram(Photo Maps) | 4개 아키타입으로 정리: Mapstr(수동 장소 북마크 SNS), Polarsteps(상시 GPS 동선 추적), Swarm(수동 체크인 라이프로그), Instagram Map(기존 SNS에 지도 레이어). **누구도 "사진 다중선택→EXIF로 POI 자동 군집 업로드 + 장소핀 소셜 피드 + 사후 동선 라인"을 한 앱에 묶지 않음** — 요기조기의 빈칸. 사용자 답①②와 충돌 없음. | grounded |
| POI 단위 데이터 모델 업계 관례는? | docs.foursquare(Places) · medium/foursquare(POI digitizing) · foursquare blog(location data) | Foursquare Places 스키마가 사실상 표준: venue { id, name, lat, lng, category, parent/subvenue }. Photo는 좌표를 직접 들지 말고 **Place(POI)에 FK(N:1)**. external_place_id로 SDK(카카오/구글) place id 캐싱 → SDK 비종속. nullable poi_id + 수동편집을 1급으로. 사용자 답②⑥과 정합. | grounded |
| EXIF 자동분류 업로드의 흔한 엣지케이스는? | geotag.world · support.google(photos location) · github/immich · howtogeek(exif) | 반드시 그릴 케이스: ①GPS 없는 사진(스크린샷·편집본·위치OFF·EXIF 제거)→미분류 버킷+수동지정, ②불완전 EXIF→검증·폴백, ③동일 POI 다중사진→한 핀/카드 묶음, ④위치 추정은 MVP에선 "수동지정 우선"(오분류↓), ⑤한 좌표 다중 POI→후보 선택. 빈약하면 핵심 차별이 죽음. | grounded |
| 위치 기반 SNS 프라이버시 관례·함정은? | nbcnews · cbc(IG map opt-in) · mapstr FAQ · about.instagram | 위치공유는 카테고리 최대 지뢰(Instagram Map 2025 백래시). 표준 패턴: 기본 OFF·명시적 옵트인, 공유 범위 세분화, "마지막 활동 위치"는 실시간 아닌 진입 시 갱신, 지도 노출 시한. 요기조기 함의: 온보딩 위치 프라이밍, 게시 시 공개범위 토글, 집/직장 민감 POI 가리기, 동선 공개 별도 제어. 동선 라인이 강한 만큼 제어가 더 중요. | grounded |
| MVP 경계는 어디까지? 경쟁 실패/생존 교훈은? | favshq(Foursquare vs Swarm) · wikipedia(Swarm) · polarsteps · mapstr | Foursquare/Swarm 분리 교훈 = **핵심 루프(기록↔보기/발견)를 한 앱에서 끊지 말 것**. 요기조기는 지도홈+피드+업로드를 한 곳에 둬 정합. IN = 사용자 답 전부. OUT 권고(근거 있음): 게이미피케이션/배지·협업 지도·실시간 위치공유·AI 추천·POI 운영상태 판정. 빼도 "인스타 최소 동등"은 충족(table-stakes는 피드·프로필·검색·알림·팔로우이지 배지가 아님). | grounded |
| 동선 라인(route)은 경쟁사 대비 어떻게? | polarsteps(travel-tracker) · polarsteps.com · geotag.world | 레퍼런스는 Polarsteps(상시 백그라운드 GPS). 단 배터리·프라이버시 부담 큼. 요기조기는 EXIF 기반이라 본질이 다름 → **사후 동선**(업로드 사진의 POI를 촬영시각순으로 잇는 폴리라인) 기본 권고. 상시추적 부담 없이 동선 획득. 실시간 추적 여부는 사용자 미확정(§11 A7). | grounded |
| 검색은 무엇을 검색하게? | swarmapp · mapstr · medium(Mapstr) | 경쟁 검색 축은 사람/계정 + 장소(POI) + 태그. 요기조기는 장소 중심이므로 **3축(장소·사람·태그), 기본 장소**가 차별. 사용자 답은 사람 검색만 명시 → 장소·태그 추가는 권고(사용자 검수 대상). | grounded |
| 목표 지표(리텐션·업로드율·핀당 사진)의 현실 수준은? | (신뢰 1차 출처 미확보) | 신규 카테고리·국내 시장 공개 벤치마크 없음. 통념 수준(검증 안 됨): D1 20~30%/D30 한 자릿수 후반. "첫 업로드 완료율"을 북극성에 두는 것이 차별 가설과 정합. **절대 수치는 못 박지 말고 출시 후 실측 보정.** | **guess** |
| 아키타입 표준 진입/온보딩 관례는? | swarmapp · mapstr · cbc(IG opt-in) · about.instagram | 표준: 소셜 로그인 우선, 위치 권한 프라이밍(OS 팝업 전 가치 설명), 사진 권한 프라이밍, 팔로우 시드(빈 지도/피드 방지), 빈 상태(첫 업로드 CTA). 빈 상태를 지도홈/피드/프로필 각각에 둬야 표면 빈약 방지. | grounded |

---

## ⓑ 실사용자 니즈·불만

| 질문 | 근거(출처) | 답/권고 | 신뢰도 |
|------|-----------|---------|--------|
| EXIF 자동분류의 현실 성공률(목표 수준)은? | fast.io(geo metadata) · geotag.world · metaclean(IG strips exif) · exifdata.org | **100% 자동분류를 KPI로 잡지 말 것.** GPS 있어도 정확도 개활지 3~5m·도심 10~15m·실내 부정확. 인스타는 업로드 시 EXIF 제거 → "인스타에 올렸던 사진 재업로드"는 위치 0. 지표 권고: 자동분류 정확도%가 아니라 ①EXIF 위치 보유율 ②자동 무수정 확정률 ③수동보정 탭 수/시간. 야외·카페 위주면 70~85% 체감, 나머진 빠른 수동확정. | grounded |
| 수동분류는 옵션인가 1급 흐름인가? | support.google(photos location) · metaclean · screenshotedits(metadata) | **1급 흐름이다.** 위치 없는 사진 비율이 무시 못 할 수준(스크린샷·SNS 수신·다운로드·실내). Google Photos 표준 패턴 MVP 포함: 장소 추가/수정 UI, 최근/자주 쓴 장소 빠른선택, 다중선택 일괄 위치지정. 업로드 흐름에 "자동분류 확인→미분류 묶음→장소 검색/핀 지정"을 별도 단계로. 작게 축소하면 table-stakes 미달. | grounded |
| 좌표→POI 매핑 데이터 모델 관례는? | github/photoprism(revgeo 오답) · developers.google(Places) · support.google · mapbox(POI) | 역지오코딩은 모호·가끔 틀림(프랑스 좌표가 미국으로 매핑된 실례). **"좌표 1개=확정 POI 1개"로 모델링 금지**: Photo(lat/lng, exif_time, location_source∈{exif,estimated,manual,none}, geocode_confidence) ↔ Place(place_id, name, category, lat/lng, address) 분리, 사진-장소는 "후보 리스트 + 확정 1개(confirmed_by∈{auto,user})". location_source가 수정가능성·UX 분기 근거. | grounded |
| 반드시 처리할 흔한 엣지케이스는? | geotag.world · metaclean · github/photoprism · play.google(photomap) | ①위치 0 사진→일괄 수동지정, ②좌표 있으나 POI 모호→후보 picker, ③역지오코딩 오답→"여기 맞나요?" 한 탭, ④시각만/위치만→동선 정렬 보정, ⑤같은 장소 묶음 다수→일괄편집·대표사진, ⑥수동지정 후 저장 실패 보고됨→낙관적 UI 주의, ⑦동선 큰 점프(비행기)→라인 끊김. 빈 상태로 명시. | grounded |
| 장소 중심 니즈는 실증되나? | journiapp · hellodoorcounty(maps timeline) · support.google(maps timeline) | 그렇다. "대량 사진을 구조화된 이야기로"가 핵심 페인, 여행 회상 욕구 반복 확인. Google Maps Timeline+Photos가 "방문 장소 핀+경로로 여행을 다시 사는" 경험 제공 → 사용자 답(지도 중심 홈+동선)이 검증된 니즈와 일치. 동선 라인은 장식 아닌 회상의 핵심 도구. | grounded |
| 공개/비공개 설계 주의 리스크는? | hankookilbo(카카오맵 즐겨찾기) · picfair(location scouting) | 장소 공개는 양날의 검. 카카오맵 즐겨찾기/리뷰가 사생활(모텔 기록) 노출 → 기본값을 비공개로 변경. 사진가 커뮤니티는 명소 노출(과밀) 우려로 위치 공개 꺼림. 함의: 게시물 단위뿐 아니라 "내 동선/자주 가는 장소 노출"까지 고려. 게시 시 공개범위 명시, 집·반복 장소 노출 줄이는 옵션, 프로필 지도 공개 범위 제어. | grounded |
| 수동분류/위치편집 화면 표준 UX(IA)는? | support.google(photos, android+desktop) · 9to5google(location estimates) | Google Photos가 사실상 표준: ①Info에서 "장소 추가", ②최근 장소 빠른선택, ③다중선택 후 위치 일괄편집, ④추정은 "estimated" 라벨로 출처 구분. 업로드 흐름 매핑: 다중선택 그리드→자동분류 결과(묶음 카드+추정/확정 배지)→미분류 묶음→핀 드래그+장소검색(최근장소 칩)→후보 선택 시트→태그·메모→게시. 빈 상태·일괄지정 액션바 필수. | grounded |

---

## ⓒ 도메인 관행

| 질문 | 근거(출처) | 답/권고 | 신뢰도 |
|------|-----------|---------|--------|
| EXIF GPS 추출·좌표→장소 변환 표준 파이프라인은? | opencagedata(geocode images) · developers.kakao(Local) · developers.google(places geocoding) · geotag.world | (1)EXIF GPS+촬영시각 추출(거의 모든 기기 WGS-84 → 변환 불필요), (2)역지오코딩으로 주소·행정구역, (3)POI(장소명)는 좌표 반경 키워드/카테고리 검색(Kakao Local category.json·keyword, Google Nearby). Kakao Local은 coord2address + 카테고리 기반 장소검색 모두 제공 → 요기조기 요구에 정확히 부합. place 테이블 분리 + photo가 place_id FK. 사용자 답②와 일치. | grounded |
| GPS 없는 미분류 사진은 얼마나 흔한가? | whereisthisplace · metaclean(FB) · sammapix · proton(exif) | **매우 흔함 — 수동 폴백은 필수 1급 경로.** 원인: 스크린샷, SNS 다운로드본(IG·FB·왓츠앱이 메타데이터 제거), 실내, 기내모드, 권한 미허용. 업로드 흐름에서 자동분류 그룹과 미분류 버킷을 처음부터 동등 노출. 사용자 답과 일치·강화. (정확 % 는 사용자층 의존 → guess.) | grounded |
| 다중선택→장소별 그룹핑 업로드 패턴, 인스타 대비 차이는? | help.instagram(carousel) · help.socialbee(carousel) | 인스타: 다중선택(최대 20장, 선택순=슬라이드순)→개별편집→**단일 캡션·단일 위치**(1게시물=1위치, 다대일). 요기조기는 **1 업로드가 EXIF로 여러 POI 그룹으로 자동 분할(다중사진→다중장소, 다대다)** — 카디널리티가 반대. UI 권고: 선택 직후 "장소별 N개 그룹으로 묶었어요" 검수(확인/병합/분리/이동), 미분류 버킷, 그룹별/공통 태그·메모. **인스타와 가장 다른 화면 = MVP 난이도 핵심 → 표면 두텁게.** | grounded |
| 사진→POI 자동 그룹핑 알고리즘의 현실 정확도/방식은? | springer · sciencedirect · uspto patent | 1순위 신호 = 시간(촬영시각), 그다음 GPS, 보조로 콘텐츠/색상. 표준: 연속 사진 간 시간·거리 갭이 로컬 평균보다 크면 "다른 장소/방문"으로 경계. 보고 정확도 trip 분할 ~85%, 보조신호 추가 ~91%. 함의: 목표는 "완벽"이 아니라 "대략 맞게 묶고 쉽게 고치게" — 자동 ~80%대 전제, 검수·수정(병합/분리/이동) UX를 1급으로. 같은 POI 반복방문은 시간 갭으로 별도 visit, 같은 place_id에. **학술 일반치라 직접 목표로 못 박지 말 것.** | grounded |
| 팔로우 그래프 데이터 모델 관례는? | medium(follower schema) · geeksforgeeks(follow system) · github/socialite | **directed graph.** follows 테이블에 (follower_id, following_id, created_at) 복합 PK로 1관계=1행(User 문서 비정규화보다 별도 테이블이 표준). 트위터/인스타식 비대칭. 비공개 계정은 status(pending/accepted) → 요청·승인 모델. 팔로워/팔로잉 수는 카운터 캐시 병행이 실무. 사용자 답과 일치. | grounded |
| 게시물 공개범위는 계정 단위인가 게시물 단위인가? | medium(follower schema) · proton(exif) · geotag.world | 인스타 관례는 계정 단위 binary(공개 계정=전체, 비공개=승인 팔로워만). 사용자 답은 "공개/비공개 게시"(게시물 단위 뉘앙스)도 언급 → **post.visibility enum(public|followers|private) 컬럼**이 유연. 권고: MVP는 계정 단위 비공개(follows.status=accepted 게이트) 기본 + post.visibility 컬럼을 미리 스키마에 둬 확장 대비. 추가: 정확 좌표가 집·동선 노출 → 장소 공개 정밀도 토글(P1). | grounded |
| 지도 홈 핀/동선 표시 데이터·성능 관례는? | developers.kakao(Local) · uspto patent | 장소는 WGS-84 저장, 뷰포트 핀 조회·클러스터링 위해 공간 인덱스(PostGIS·geohash). 줌아웃 시 핀 수백~수천 → 서버/클라이언트 클러스터링(geohash prefix·SDK 클러스터러), 핀 하나=1 POI(대표 썸네일). 동선=같은 user의 visit을 taken_at 정렬 → 좌표 잇는 polyline. SDK 비종속(사용자 답⑥)이므로 핀·클러스터 버블·정보카드·동선을 일반화 표현으로. | grounded |
| 도메인 흔한 엣지케이스(가정 원장에 박을 것)는? | whereisthisplace · geotag.world · proton · developers.google(reverse geocoding) | ①GPS 없는 사진→미분류 버킷, ②부정확 GPS→후보 picker, ③1좌표=다중 POI→최근접 자동+변경, ④DB에 없는 신규 장소→직접 입력, ⑤같은 POI 반복방문→시간 갭으로 별도 visit, ⑥시각만/위치만→한 신호 그룹핑, ⑦프라이버시(정확좌표=집·직장·동선 노출)→공개 정밀도 제어, ⑧잘못 묶인 그룹→사후 이동/병합/분리. | grounded |
| MVP 경계·우선순위 권고(도메인 관점)는? | help.instagram · springer · whereisthisplace | (P0 차별 코어) EXIF추출→역지오코딩→POI매핑→그룹핑 업로드 + 미분류 수동편집 + 지도 홈(핀/클러스터/동선). (P0 table-stakes) 인증·온보딩·프로필·피드·검색·친구프로필·팔로우·공개비공개. (P1 안전 축소) 좋아요/댓글. **자동분류 정확도에 과투자 말고(~85% 전제) 검수·수정·미분류 폴백을 두텁게.** SDK 비종속 유지. (정확 우선순위 수치는 guess.) | grounded |

---

## ⓓ 제품 아키타입 IA (table-stakes 화면)

| 질문 | 근거(출처) | 답/권고 | 신뢰도 |
|------|-----------|---------|--------|
| 인스타급 사진 SNS table-stakes 화면 전체 목록은? | inro.social(IG tabs 2025) · hannahschm(IG flows) · bobayerl(IG patterns) · appcues(onboarding) | 표준 10종: ①인증 ②온보딩(가치+권한 프라이밍) ③홈피드 ④검색/탐색(계정·장소·태그) ⑤다단계 업로드(4~5스텝) ⑥알림/액티비티 ⑦내 프로필 ⑧타인 프로필 ⑨게시물 상세 ⑩설정. 요기조기는 +지도홈·POI 상세. 사용자 IN 항목 전부 이 표준과 일치 → "인스타급 경험" 충족하려면 10종을 최소 골격으로. | grounded |
| 하단 탭 구조, 3탭(지도/피드/업로드)으로 충분한가? | inro.social · minter.io · themodems | 인스타 표준은 5섹션. 사용자는 3탭 못박음 → 우선. **충돌 명시: 3탭만 두면 검색·프로필·알림 진입점이 하단에서 사라짐.** 권고: 누락 진입점을 상단 앱바(검색 아이콘·알림 벨) + 지도홈 우상단 아바타로 흡수 → "하단 3탭 + 상단바"로 5종 진입 보존해야 빈약하지 않음. | grounded |
| 다단계 업로드 몇 단계·어떤 순서? | socialbee(multi-photo) · perfectcorp · help.instagram | 인스타 4~5스텝: 다중선택(최대 20장)→편집→메타입력(캡션+위치1개+태그)→공유. 요기조기 변형: 다중선택→EXIF 자동 클러스터링→**자동분류 결과 확인/수정(인스타에 없는 핵심 단계 — POI 묶음 편집·미분류 수동지정)**→장소별 태그/메모→공개/비공개→공유. 위치가 "게시물당 1개"가 아닌 "사진별 POI"라 다중 위치 다루는 게 구조적 차이. | grounded |
| 인증/온보딩·권한 요청 관례는? | useronboard(permission priming) · appcues · adapty · vwo | (1)소셜 로그인 우선(전환 이메일 대비 2~3배) — 버튼을 폼 위에. (2)권한 프라이밍 — 위치·사진·알림을 온보딩서 한꺼번에 X, "그 기능 쓰는 순간" 가치 설명 후 시스템 프롬프트(opt-in 20~40%↑). 위치는 지도홈 첫 진입/첫 업로드 직전, 사진은 업로드 탭 누를 때. (3)한 화면 한 기능, 짧게. | grounded |
| 알림(액티비티) 화면 관례는? | help.instagram(activity) · hannahschm | 좋아요·팔로우·댓글·언급을 시간순 리스트, 동종 그룹핑("A님 외 12명"), 우측 컨텍스트 썸네일/팔로우백, 미열람 레드닷. '팔로잉/회원님' 탭 분리. 요기조기 차별: 장소 맥락 추가("A님이 블루보틀 성수에 사진을 올렸어요"). 사용자 IN. | grounded |
| 프로필(내/타인) 구성 관례는? | eleken(profile design) · bobayerl · companionlink | 헤더(아바타·이름·소개)+카운트 3종+액션(내=편집/공유, 타인=팔로우/언팔)+그리드(3열). 타인은 팔로우 상태·비공개 잠금 표현. 요기조기: 사용자 전제대로 [그리드|지도] 토글(그리드 3열 + 지도뷰 내 동선·방문 POI). | grounded |
| 검색/탐색 화면 관례(친구 검색·팔로우 반영)는? | hannahschm · foursquare(Swarm discover) | 상단 검색바 + 결과 탭(계정/장소/태그), 빈 상태는 탐색 그리드. 요기조기: [계정(친구)|장소(POI)|태그] — 사용자 요구 "친구 검색·팔로우"=계정 탭, "장소 중심" 정체성=장소 탭(POI 카드). 빈 상태는 인기/근처 장소로 빈약 방지. | grounded |
| 지도 홈·POI 상세는 어떤 지도앱 패턴 차용? | docs.devexpress(bottomsheet) · mapuipatterns(cluster·marker) · nngroup(bottom sheet) · swarmapp · wikipedia(Swarm) | (1)마커/핀, (2)밀집 시 클러스터(숫자 버블, 줌인 분해·탭=확대), (3)장소 탭 시 바텀시트(Google Maps식, 지도는 뒤에서 인터랙티브). 요기조기: POI 핀+카운트 배지, 핀 탭→바텀시트(POI명·사진 그리드·방문 친구·메모), 동선=시간순 polyline. Swarm + Google/Naver Maps 바텀시트 결합이 선례. 사용자 답④(컬러 핀·정보카드·FAB·그림자)와 부합. | grounded |
| MVP 화면 경계·우선순위는? | inro.social · minter.io · swarmapp | IN = 사용자가 못박은 전부(인스타 table-stakes와 일치). OUT = 스토리·릴스/동영상·DM·댓글 스레드·해시태그 챌린지·쇼핑. 우선순위 1=지도홈+업로드 자동분류(차별), 2=피드·프로필·검색, 3=알림·설정. 인증 백엔드 실구현은 범위 밖(UI만). | grounded |
| 목표 지표 현실 수준은? | adapty · useronboard · appcues | **정량 벤치마크 직접 근거 약함(guess).** 정성 기준만 근거 있음: 소셜 로그인 전환 2~3배, 권한 프라이밍 opt-in 20~40%↑, D1에 의미있는 행동(첫 게시물/첫 팔로우) 완료 시 리텐션 2~3배. 구체 D1/D7%·MAU는 신규 장소 SNS 공개 벤치 없어 추측 → 디자인 단계는 "위 3개 행동 전환을 설계로 끌어올린다"는 정성 목표로. | **guess** |

---

## §11 가정 교차참조 — 승격/잔존

PRD §11과 대조해, 시장조사로 근거를 확보한 항목은 **§11.1(근거 있는 결정)** 으로 승격되고, 출처를 못 구한 항목만 **§11.2 가정** 으로 남는다.

| §11 항목 | 조사 결과 | 상태 |
|----------|-----------|------|
| POI/장소명 단위 데이터 모델 | ⓐ Foursquare Places · ⓒ Kakao Local — grounded | **승격 → §11.1 근거 있는 결정** |
| directed follow graph · 공개/비공개 모델 | ⓒ follower schema · IG private — grounded | **승격 → §11.1** |
| 수동분류 1급 흐름 | ⓑ GPS 없는 사진 흔함 · Google Photos 표준 — grounded | **승격 → §11.1** |
| 권한 프라이밍 · 빈 상태 | ⓓ useronboard · appcues — grounded | **승격 → §11.1** |
| 클러스터링 · 바텀시트 패턴 | ⓓ mapuipatterns · nngroup — grounded | **승격 → §11.1** |
| 사후 동선 라인(상시 추적 아님) | ⓐ Polarsteps 배터리·프라이버시 부담 — grounded | **승격 → §11.1** (단 실시간 vs 사후 선택은 A7로 잔존) |
| 검색 3축(장소·사람·태그) | ⓐ Swarm·Mapstr — grounded (장소·태그 추가는 권고) | **승격 → §11.1** (사용자 검수 권고) |
| A1. 목표 수치(M1·M3·M4·M5·M7) | ⓐⓓ 외부 벤치마크 미확보 — **guess** | **가정 잔존 → §11.2** (출시 후 실측 보정) |
| A2. 자동분류 정확도 ~70~85% | ⓒ 학술 일반치(85/91%)는 grounded이나 우리 도메인 실측 아님 | **가정 잔존 → §11.2** (검수·수정 UX로 의존 낮춤) |
| A3. 피드 기본 정렬 = 시간순 | 사용자 검수 필요(장소 묶음 vs 시간순) | **가정 잔존 → §11.2** |
| A4. 다중선택 최대 장수(N) | ⓒ 인스타 20장 관례 차용 가정 | **가정 잔존 → §11.2** |
| A5. 카테고리별 핀 컬러 팔레트 | 지도앱 톤 전제, 구체 분류·색 매핑 미확정 | **가정 잔존 → §11.2** |
| A6. 뷰포트 390px·라이트·한국어 | 사용자 가정 | **가정 잔존 → §11.2** |
| A7. 실시간 vs 사후 동선 | ⓐ 사후 동선을 근거 있는 기본 권고, 최종은 사용자 미확정 | **가정 잔존 → §11.2** (사후가 근거 있는 권고) |
| A8. 공개범위 기본값 | ⓑ 카카오맵 사례로 보수적 권고하나 성장과 충돌 → 사용자 결정 | **가정 잔존 → §11.2** |

> 요약: 데이터 모델·IA·UX 패턴·차별 메커니즘은 전부 grounded로 §11.1 승격. **수치 목표(A1)와 제품 고유 정확도(A2)만 guess로 §11.2 잔존** — PRD §2가 절대 수치를 못 박지 않고 선행 지표로 둔 판단이 이 근거 분포와 정합한다.
