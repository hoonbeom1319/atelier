# spotlog — 기획 결정 근거 (plan-decisions)

> forge §B 무인 기획에서 market-researcher가 plan 질문들을 **웹검색으로 근거화**한 기록이다.
> 행마다: 질문 → 근거(출처 URL) → 답/권고 → 신뢰도(grounded/guess).
> 근거 확보 항목은 §11의 "가정"에서 "근거 있는 결정"으로 승격됐다(맨 아래 교차참조표).
> 조사: 3개 축(경쟁/유사 제품, EXIF·역지오코딩 관행, 실사용자 니즈·프라이버시). 사용자 인테이크 답과 충돌 없음 — 오히려 강하게 보강됨.

---

## 축 1 — 경쟁/유사 제품 (장소 기반 사진/지도 SNS)

요약: 장소축 사진 SNS는 빈 시장이 아니다. 기능 조각은 흩어져 존재한다(Mapstr=핀 큐레이션, Polarsteps=GPS 경로 시간축 일기, Google/Apple Photos=EXIF 자동 장소 그룹핑(개인 보관함), Foursquare/Swarm=체크인 소셜, Instagram Map=친구 위치 지도). spotlog의 진짜 차별점은 '인스타식 다중 업로드 → EXIF 자동 장소 그룹핑 → 세로 장소카드 피드(SNS)'라는 **조합과 마찰 제거**(개별 기능은 신규 아님).

| 질문 | 근거(출처) | 답/권고 | 신뢰도 |
|---|---|---|---|
| 경쟁/유사 제품과 본 아이디어의 실제 차별점(빈칸)은? | mapstr.com · thecompassandkey.com/mapstr-app-review · polarsteps support(steps) · pixelunion.eu(reverse-geocoding) · nbcnews.com(instagram maps privacy) | 직접 경쟁 5종(Mapstr·Polarsteps·Google/Apple Photos·Foursquare/Swarm·Instagram Map) 모두 조각만 가짐. 'Google Photos 자동 그룹핑 + Mapstr 소셜 큐레이션 + 인스타 피드 UX'를 합친 조합은 통째로 없음 = 진짜 빈칸. 기술 난이도가 아니라 UX 조합·마찰 제거가 승부처. | grounded |
| 장소 기반 소셜 앱의 대표 실패 요인? MVP에서 피할 것? | watsspace.com(foursquare 실패) · thelettertwo.com(city guide 종료) · cnbc.com·cbsnews.com(instagram map backlash) | 최대 실패축=수동 입력 마찰 + 앱/기능 분리. 교훈: ① 수동 단계 제거(=EXIF 자동 그룹핑) ② 한 셸에서 기록+탐색 완결(탭 분리 금지) ③ 위치 기본 비공개·과거 시점·집/실시간 비노출. | grounded |
| 장소/사진 그룹핑 데이터 모델 표준 구조? | polarsteps support(export·travel tracker) · r-bloggers.com(polarsteps munging) | 업계 사실상 표준=Polarsteps 3계층 trip→step(장소 1곳)→media. step≈본 앱 PlaceCard 1:1. 권고: Photo가 좌표/시간 자기 필드 보유 + PlaceCard에 가변 FK(미분류 재배치 쉽게), placeName은 좌표와 분리 필드, 자동결과는 '제안+확정 플래그'(Suggestion 패턴). Trip 계층은 MVP 필수 아님. | grounded |
| EXIF 자동 그룹핑의 흔한 엣지케이스? '미분류 수동 편집'은 얼마나 자주 필요? | metaclean.app · exifdata.org · whereisthisplace.net · geotag.world | EXIF GPS 결손은 예외가 아니라 상시: 스크린샷·SNS strip(압축 전송 ~89% GPS 제거)·편집 도구·실내/도심 오차. 따라서 미분류 수동 편집은 fallback이 아니라 핵심 상시 경로로 설계 필수. 클러스터링 반경 기본 50~150m는 추측(데이터 튜닝 필요). | grounded(반경값만 guess) |
| 역지오코딩(장소명 자동추출+후보검색)은 경쟁사에서 어떻게? 본 설계가 관행에 맞나? | pixelunion.eu · fast.io(geolocation extraction) · photools.com | 역지오코딩은 사진앱 표준(Google/Apple/Lightroom). 단 '근처 상호/POI 추출 + 오류시 후보 선택 + 핀 직접 보정'까지 매끄럽게 묶은 소비자앱은 드물다=차별 디테일. 자동명은 항상 '제안'으로, 1탭 수정 노출, 좌표 주변 반경 질의가 표준. 검색에 없으면 좌표만 보존. handoff에서 실 API 계약으로. | grounded |
| 목표 지표(리텐션·인게이지먼트)의 현실적 수준? | uxcam.com(retention benchmarks) · a16z.com(social app benchmark) · mapstr.com/faq | 소셜앱 벤치마크 중앙값 D1 40%/D7 18%/D30 12%, 상위25% D1 50~60%. 단 신규 소셜앱은 초기 스파이크 후 중앙값 회귀. 초기엔 소셜보다 개인기록 효용이 먼저 서야 리텐션이 산다. 권고 MVP 목표: 첫세션 자동생성 성공률 60%+, D1 35~45%/D7 15~20%(1차), 코호트 리텐션 곡선 중심. | grounded(수치는 산업 일반) |
| MVP 경계 — 무엇을 넣고 빼나(우선순위 근거)? | watsspace.com · cnbc.com · polarsteps support · medium.com(mapstr 리포트) | IN: 다중업로드+EXIF 자동그룹핑 / 미분류 수동편집 / 역지오코딩+후보+핀 / 내 기록 피드 / 가벼운 탐색·팔로우. OUT: 댓글·좋아요·DM·푸시(후순위), 실시간 위치공유(backlash 리스크>가치, 의도적 제외), 백그라운드 GPS 추적(배터리·프라이버시, EXIF 기반이라 불필요), 게이미피케이션(후속). 가장 위험한 단일 가정='자동 그룹핑 정확도'+수동편집 UX 품질 → 한 묶음으로 검증. | grounded |
| 수익화/지속성에서 참고할 경쟁사 신호? | justuseapp.com(mapstr reviews) · polarsteps support(export) | Mapstr는 무료 저장 한도(~300개) 후 구독 락 → '쌓은 데이터 락' 반발 신호. MVP는 수익화 범위 밖이나 '내 사진/장소 항상 내보내기 가능' 가정을 처음부터 박으면 후행 반발 완화(Polarsteps의 전체 JSON export가 신뢰 장치). 데이터 소유권/내보내기를 handoff 계약 후보로 메모. | grounded |

## 축 2 — EXIF·역지오코딩·클러스터링 관행 + 카카오/구글 API 데이터 모델

요약: 사용자 MVP 설계(EXIF 자동그룹핑 → 역지오코딩 자동추출 → 틀리면 POI 후보 팝오버 → 없으면 핀 직접, 미분류 수동편집)는 업계 관행과 정확히 일치. 오히려 조사는 '수동편집/핀 보정 = first-class'를 강하게 뒷받침 — 실내 GPS ~11.5m·도심 캐니언 20m+·타임존 부재·SNS strip 때문에 자동 분류 실패율이 구조적으로 높다.

| 질문 | 근거(출처) | 답/권고 | 신뢰도 |
|---|---|---|---|
| 자동 그룹핑에 쓸 EXIF 필드·형식·함정? | wikipedia.org/Exif · merginmaps.com(exif layer) · gpsnap.com(exif viewer) | 핵심 4필드: GPSLatitude/Longitude(DMS rational + Ref N/S/E/W로 부호 결정 필수), DateTimeOriginal('YYYY:MM:DD HH:MM:SS'), GPSAltitude(+Ref), GPSDateStamp+TimeStamp(UTC). 권고: {lat,lng,altitude?,capturedAtLocal,tzOffset,capturedAtUtc} 보관, lat/lng는 십진 WGS84 정규화, DMS→십진·Ref는 업로드 파이프라인 1회. | grounded |
| EXIF 시간 타임존 문제가 있나? | wikipedia.org/Exif · bugtender.com(timezone fix) · photostructure(exiftool dates) | 있다. EXIF 2.31(2016.7) 이전 DateTimeOriginal엔 TZ 없음 → 로컬/UTC 모호. 2.31에 OffsetTimeOriginal 추가, Apple은 별도 저장 → 함께 읽어야 정렬 맞음. 권고 우선순위: OffsetTimeOriginal → 없으면 GPS UTC → 둘 다 없으면 '로컬 그대로 TZ미상'. 해외 사진 정렬 어긋남 방지 위해 §11 명시. | grounded |
| 카카오 역지오코딩 데이터 모델·필드(장소카드 스키마)? | developers.kakao.com(local) · github menthamin(geocoding) · wooiljeong.github.io(kakao local) | 2단계: ① coord2address → road_address{address_name,region_1/2/3depth,road_name,building_name,zone_no…}+address+meta.total_count(building_name이 1차 장소명 후보). ② 상호(POI)는 keyword/category 검색 보강. 권고 카드 스키마: {placeName, poiId, category, roadAddress, jibunAddress, region, lat, lng, source:reverse-geocode/poi-search/manual-pin}. | grounded |
| 장소명 수정 '후보 팝오버'의 검색·필드·정렬 관례? | developers.kakao.com · github nanangqq(kakao-local-search) · skyer9.pe.kr | 카카오 keyword.json + 좌표중심 반경검색이 정석. params: query·x,y(사진좌표)·radius·sort=distance·category_group_code. documents[]: place_name·distance·x/y·category·address/road_address·place_url·id. 팝오버: sort=distance로 가까운 후보부터, 각 후보에 상호+도로명+거리('32m'). 좌표 미입력 초기엔 반경 내 distance 최소 기본채택. 후보 0건→핀 직접. | grounded |
| 클러스터링 알고리즘·임계값 관례? | mdpi.com(10/8/548) · uspto pdf(9411831) · mapular.com(place detection) · arxiv 2401.06154 | 정석=시공간 결합(시간만/공간만 불가). (a)시간 인접(이전 사진 30분 이내 같은 묶음) (b)공간 밀도(DBSCAN). 체류지점 연구치 도심 250~1000m·체류 15분. 단 '사진첩 장소카드'엔 더 타이트해야 → 권고(추정): 시간갭 90~120분으로 세션 분리 후 세션 내 반경 100~200m로 묶기. 정확값은 실데이터 튜닝(handoff 튜너블 파라미터). | guess(임계값) |
| 반드시 다룰 흔한 엣지케이스? | exifreader.org · gpsworld.com(indoor·shadow matching) · wikipedia.org/Exif | ①EXIF GPS 전무(스크린샷·SNS strip·메신저) ②실내/지하 ~11.5m 오차 ③도심 캐니언 20m+ ④타임존 모호 ⑤같은 좌표 다른 장소(복합건물/다층) ⑥(0,0)·이상치→null 미분류 ⑦DMS Ref 누락→반대 반구. | grounded |
| 자동 분류율/미분류율 목표의 현실적 수준? | photoaid.com(mobile photo stats) · exifreader.org | 정확한 산업 수치는 공개 근거 없음(추정). 방향성: 업로드엔 스크린샷·전송본·SNS 다운로드가 섞여 GPS strip 비율 상당 → 100% GPS 보유 전제 금지. 권고: '직접 촬영 원본 위주' 시 자동 성공률 70~90% 합리적, 미분류 1건당 수동 지정 탭수를 핵심 UX 지표로. 평균 카메라롤 ~2,795장이라 대량 선택 성능 중요. | guess |
| EXIF/지도/역지오코딩을 어디까지 넣고 무엇을 handoff로? | developers.kakao.com · mdpi.com(10/8/548) | 디자인 산출물 단계: EXIF 파싱·클러스터링 결과·역지오코딩명·POI 팝오버·지도+핀 전부 목업/시드로(흐름·상태변화만 완결, 독립 HTML). 실연동(카카오 키·EXIF 라이브러리·클러스터링 튜닝·지도 SDK)은 handoff 계약으로 이관. handoff에: API응답→카드필드 매핑표, 클러스터링 파라미터 노출, 미분류/오차 폴백 UX 계약. | grounded |
| '수동편집/핀 보정'을 first-class로 둘 근거? | exifreader.org · gpsworld.com(indoor) · wikipedia.org/Exif | 강한 근거. 자동분류는 (a)GPS 없는 사진 (b)실내 11.5m·도심 20m+ (c)복합건물 동좌표 모호 (d)타임존 뒤섞임 — 네 구조적 실패원을 상시 안고 감. '자동이 자주 틀린다'가 상수. 따라서 보정 플로우를 '에러 처리'가 아닌 업로드 주경로 일부로 1급 대우(장소명 항상 1탭 수정, 미분류 별도 섹션 가시화). | grounded |

## 축 3 — 실사용자 니즈·불만 (자동 정리 욕구, 수동 태깅 피로, 프라이버시, 지표 현실성)

요약: 여행/장소 기록 앱 이탈의 핵심은 '수동 입력 피로'+'완벽주의 부담' → EXIF 자동 그룹핑이 정확히 통점을 침. 자동화 최대 약점=위치 추정 부정확(Polarsteps 불만 다수)+SNS의 EXIF 완전 제거. 미분류 수동 편집은 필수 안전망(first-class). 프라이버시(집 주소 노출)는 구조적 신뢰 리스크 → 최소 안전망 권고.

| 질문 | 근거(출처) | 답/권고 | 신뢰도 |
|---|---|---|---|
| 자동 정리 욕구가 실재하나(추측 아님)? | upperdelawareinn.com · solotravelerworld.com · getacti.app | 실재 통점. 여행 기록앱 이탈 최대 단일원인=매 엔트리 수동 정리 부담+완벽주의 압박. 성공앱은 GPS 자동추적으로 '수동 입력 없이' 진화. '사진만 던지면 장소별로 묶인다'는 검증된 니즈 정조준(사용자 답과 정합). | grounded |
| 자동 위치 그룹핑/추정의 실사용자 불만? 경계할 점? | mattsnextsteps.com · wandrly.app(polarsteps reviews) | 경쟁앱(Polarsteps) 대표 불만이 '위치 추정 부정확'(안 간 곳 표시, 'atrocious'). 시사: 자동은 best-effort로 제시 + 쉽게 들여다보고 고치는 UX가 핵심 신뢰요소. 자동이 틀릴 것 전제 설계(사용자 MVP ②/⑤=장소명 수정·핀 이동이 정확한 대응). | grounded |
| EXIF 신뢰성 한계 — 미분류 수동편집이 정말 MVP 필수? | metaclean.app · fast.io · exifdata.org · radar.com(geocoding) | 필수. SNS(인스타/페북/링크드인)는 업로드 시 EXIF 거의 완전 제거, 스크린샷은 원본 메타 없음, GPS는 실내/도심 드리프트+캐시. 미분류는 예외 아닌 대량 상시 발생 → ②는 필수 폴백 경로, first-class. 엣지: EXIF 전무, GPS만/시간만, 후보 0건, 클러스터 흩어짐, 자정 넘김, 동좌표 다른 장소. | grounded |
| 역지오코딩 자동추출이 틀리는 원인? 수정 UX 고려점? | radar.com · pro.arcgis.com(reverse geocoding) · developers.google.com(reverse geocoding) | 본질적으로 부정확: 좁은 반경 복수 후보, POI 중심점 우선매칭으로 '가깝지만 엉뚱', 매칭 티어(rooftop/parcel/street/locality)별 제공자 차이, '지도상 맞지만 운영상 틀림'. 시사: ①자동명='추정' 표시 ②수정 시 후보 팝오버(confidence 활용) ③없으면 핀 직접 — 3단 폴백이 업계 권고와 부합. | grounded |
| 프라이버시(위치 노출) 우려는 얼마나 심각, MVP에서 무엇을? | iplocation.net · reputationdefender.com · mcafee.com | 구조적 신뢰 리스크. 지오태그로 집/직장/학교 노출, 휴가사진→빈집털이 악용 사례, 스토킹 피해자 75%+가 SNS 지오태그로 위치 특정, 사용자 90%+가 지오태그 박힌 줄 모름. 위치가 콘텐츠 축인 본 앱은 더 직접적. 권고: ①공유 전 공개 고지 ②집/특정 장소 숨김·정밀도 낮추기 ③기본 공개범위 보수적. 사용자 미답 → §11 가정으로 올려 검수. | grounded |
| MVP 경계 — 무엇을 넣고 빼나? | solotravelerworld.com · mcafee.com · wandrly.app | 사용자 MVP(①다중+자동그룹핑 ②미분류 편집 ③피드 ④탐색·팔로우 ⑤역지오코딩+수정/핀) 타당. ①②=핵심가치+필수안전망 동급 1순위. ③=결과 가시화. ④⑤=차별·소셜. OUT: 댓글·좋아요·DM·푸시(통점은 자동정리이지 소셜 아님), 실시간 GPS 추적(프라이버시 부담, EXIF 사후정리라 불필요). 충돌 없음. | grounded |
| 목표 지표의 현실적 수준? | businessofapps.com(retention) · a16z.com · clevertap.com(dau/mau) · shno.co(engagement) | 소셜 사진앱 신규 리텐션 D1 ~25%/D7 ~11~13%/D30 ~5~7%(전 카테고리 평균; 3일 내 DAU 77% 이탈). 스티키니스 DAU/MAU 20%+ sticky·25%+ 강함(컨슈머 소셜 25% good·45% great). 초기 MVP는 대박 벤치마크 아닌 핵심루프 검증: 업로드 완주율, 자동 그룹핑 정확도(수정없이 게시 비율), 미분류 편집 완료율, D7 10%+. '자동이 얼마나 안 틀리나'가 북극성. | grounded |
| 데이터 모델 관례에서 참고할 점? | support.google.com/photos · androidcentral.com · radar.com | 핵심 엔티티: Photo(좌표·촬영시각·EXIF유무·출처), Place/Cluster(클러스터 중심+역지오코딩 후보+확정명+place_id+정밀도/숨김), Post/장소카드(Place 1곳+Photo 묶음+시간범위+메모/태그). 관례: 좌표(불변)와 장소명(가변) 분리 저장(Google Photos와 일관), 클러스터링은 거리+시간갭(튜닝 대상), confidence/match-type을 후보에 저장해 수정 UX 정렬에 활용. 일부 세부는 관례 일반화 추론. | guess(세부) |

---

## §11 가정 ↔ 근거 교차참조 (승격 표시)

근거 확보로 "가정"→"근거 있는 결정"으로 승격되어 본문(§1·§4·§5)에 반영된 항목 ✔ / 여전히 추측(guess)이라 본문 비단정 ▲:

| §11 항목 | 상태 | 근거 출처(요약) |
|---|---|---|
| EXIF 자동 그룹핑이 핵심 가치(F1) | ✔ 승격 | 축1·축3: 수동입력 마찰이 location SNS 이탈 최대원인(Foursquare·여행앱) |
| 미분류 수동편집 = 상시 핵심경로(F3, 1급) | ✔ 승격 | 축1·2·3 전부: SNS strip·실내11.5m·도심20m+·복합건물·타임존 구조적 실패원 |
| 역지오코딩 자동명+후보 팝오버+핀(F2) | ✔ 승격 | 축2·3: 카카오 keyword/coord2address 관행, 3단 폴백이 업계 권고 |
| 데이터 모델 Photo 가변FK·좌표/장소명 분리(§5) | ✔ 승격 | 축1·2·3: Polarsteps step 1:1, Google Photos 좌표/라벨 분리 관례 |
| A5 기본 비공개·프라이버시 최소안전망(F7) | ✔ 승격(사용자 미답이었음) | 축1·3: Instagram Map backlash, 스토킹 75% 지오태그 특정 — 단 정밀도 슬라이더 범위는 §11에서 검수 |
| MVP 경계(실시간 위치·백그라운드 추적·풀소셜 제외, §10) | ✔ 승격 | 축1·3: backlash·배터리·통점이 소셜 아닌 자동정리 |
| B1 클러스터링 임계값(시간갭 90~120분·반경 100~200m) | ▲ guess 유지 | 축2: 체류지점 연구는 도심 250~1000m·15분, 사진카드엔 더 타이트 필요 — 실데이터 튜닝, handoff 파라미터 |
| B2 자동 분류율 70~90% | ▲ guess 유지 | 축2: 정확한 산업 실측 없음, 방향성만. 베타 보정 |
| B3 리텐션·활성화·축적 수치(N1/R1/E2) | ▲ guess 유지 | 축1·3: 소셜앱 일반 벤치마크 기반 권고, 본 도메인 실측 아님 |
| 데이터 소유권/내보내기 가정(§9 메모) | ✔ 보강 | 축1: Mapstr 락 반발, Polarsteps export 신뢰장치 |
