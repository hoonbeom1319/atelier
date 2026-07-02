# yogi-jogi — 진행 상태

현재 단계: 7-handoff 완료 · 4차 다크모드 반영 완료 (사람 검수/실인계 대기)

## 4차 다크모드 (사용자 "배경 검정" — 전 게이트 green)
- 라이트 모노 → **다크모드 전용**: 순검정 #000 배경·근검정 카드·흰 텍스트/액션(primary=흰)·다크 지도·흰 핀·흰 동선. **사진은 컬러 유지**. 레드=좋아요/미열람.
- semantic 토큰 다크 flip + 하드코딩 잔재 외과 보정(지도 텍스처 밝은색→다크·frosted 헤더 rgba흰→다크·entrance opacity 애니 제거·map-home/onboarding 흰도로→다크/검정핀·동선→흰·notifications 회색썸네일→컬러).
- 독립 design-verifier N=3 다크 재판정 → 지적(map-home·onboarding 반쪽전환·notifications 회색) 보정 후 14/14 PASS. 토큰 대비 다크 AA green.
- 게이트: lint-prd·lint-prd-review·lint-verify(14/14)·lint-handoff green · Playwright 51/51(하이파이 31/31) · handoff(다크 토큰·문서) 재패키징 green.

## 3차 완료 (전 게이트 green)
- 홈=피드 하나(토글 삭제), 각 카드=지도 히어로(동선 메인)+작은 컬러 사진. map-home=장소 상세. 사진=컬러 실사/UI=모노.
- 재빌드(14화면) → 1차 검증 13 PASS + settings FAIL + 실측 red → 메인 직접 보정(시트 visibility feed/profile-friend/upload-2·oos 대괄호·map-hero role=group·steps role=img·settings 라벨 block 스택) → 독립 N=3 재검증 all PASS.
- 게이트: lint-prd·lint-prd-review·lint-verify(14/14)·lint-handoff green · Playwright 51/51(하이파이 31/31: 죽은 컨트롤 0·axe 0·도달성) · 트렌드 85 · 컬러 이모지 0.
- handoff 4종 + index(14화면)·PRD·00-flow·screens·foundation·_shots 재패키징, self-contained green.

## 3차 리디자인 (사용자 재피드백)
- "지도가 메인" 재해석: 전체화면 지도 아님. **홈=피드(리스트) 하나**([지도｜리스트] 토글 삭제), **각 피드 카드가 '지도 히어로(동선 메인)+작은 사진'**.
- map-home(전체화면 지도) → **장소(POI) 상세**로 재활용.
- "왜 회색이냐(와이어 같다)" → **사진은 컬러 실사, UI 크롬만 모노크롬**(실제 인스타 방식). 그레이스케일 사진 폐기.
- 하단 탭 홈 → feed.html.
- (1차 지도앱컬러·2차 모노크롬 이력은 아래 보존.)


## 2차 리디자인 완료 요약 (전 게이트 green)
- 톤 → 인스타 모노크롬(검정/화이트/그레이 + 레드 액센트). 지도앱 컬러·무지개 핀 제거.
- 홈 = 지도 중심(핀만·동선 히어로) + [지도｜리스트] 토글. 하단 탭 [홈][＋][프로필]('지도' 탭 제거).
- 업로드: 미분류를 분류 화면에서 in-place 배정(카카오맵 검색 + 없는 장소만 직접 핀). upload-3 제거(15→14화면).
- 검색 = 카카오맵 결과.
- 재빌드(forge-design, 14화면) → 1차 4 FAIL + 실측 Playwright red → 12+화면 외과 보정(내비·모노 SVG·dead-control·axe·핀 히트박스·.ph 과부하·selectSeg·selectScope 회귀 등) → 독립 design-verifier N=3 재판정 all PASS.
- 게이트: lint-prd·lint-prd-review·lint-verify·lint-handoff green · Playwright 51/51(하이파이 31/31: 죽은 컨트롤 0·axe serious 0·도달성) · 트렌드 80 · 컬러 이모지 0.
- ⚠ 인프라: 보정 에이전트 다수가 스트림 워치독 stall(600s) — 편집은 대체로 적용됐고 메인이 직접 잔여 보정·검증. shoot.js fullPage 아티팩트는 실뷰포트 정상(검증자·Playwright 확인).
- (1차 지도앱 컬러 버전 이력은 아래 메모에 보존.)

## 사용자 피드백 리디자인 (2차 — 사람 게이트 인입)
- 톤: 지도앱 컬러 → **인스타 감성 모노크롬(검정/화이트/그레이 + 레드 액센트)**. "촌스럽다" 해소.
- 지도: 작은 사진 마커 폐기 → **핀만**, **동선 히어로**. 지도가 곧 홈.
- 내비: 하단 "지도" 탭 제거 → `[홈][＋][프로필]`, 검색·알림 상단. 카드 피드는 홈의 [지도｜리스트] 토글로 보존.
- 업로드: 미분류 사진을 **현재(분류) 화면에서** 선택→장소 배정. **upload-3 제거**(흐름 1→2(분류+배정)→4).
- 검색/배정: **카카오맵 검색 결과** 기반. 없는 장소(할머니네집)만 직접 핀 이동.
- 가정: 둘째 탭=프로필 · 카드 피드 리스트 토글 보존 · 핀색 모노크롬 단일화 · 지도 SDK=카카오 가닥.


- [x] 0. 기획 (PRD 작성)  ← /plan
      - [x] 1. 문제 정의
      - [x] 2. 목표·성공 지표
      - [x] 3. 타깃 사용자
      - [x] 4. 핵심 기능·우선순위 (MVP 확정)
      - [x] 4-0. 제품 아키타입 + 표준 화면 골격 (IN/OUT 확인)
      - [x] 4-1. 개념 데이터 모델
      - [x] 5. 사용자 흐름·주요 화면
      - [x] 6. 기술·일정 제약
      - [x] 7. 착수 전 체크리스트
      - [x] → PRD.md 작성 완료
- [x] 1. 인테이크 (00-flow)        ← /design 부터 — 15 빌드화면(SC-01~20 커버), 셸/내비 계약, 상태 spec
- [x] 2. 와이어프레임 (lo-fi)       — 15화면(+index), 병렬 빌드, 셸/내비 계약, 죽은 컨트롤 0
- [x] 3. 흐름·기능 검증            — Playwright 1·2층 19/19 green(보정 3건: map-home .hidden 우선순위·search 지우기·upload4 추가). 무인: 3층=계약 준수
- [x] 4. 디자인 시스템 (tokens)    — tokens.css 2단(primitive→semantic) + 카테고리 핀 팔레트, a11y 대비 9쌍 AA green / colors·typography
- [x] 5. 하이파이 (hi-fi)        — 독립 검증(N=3 다수결, 렌더 기반) + 트렌드 85 통과
- [~] 5.5 리디자인 (선택)         — 불필요(트렌드 85 ≥ 임계 80, belowThreshold:false). 1차 FAIL 2건은 외과 보정+N=3 재검증으로 해소
- [x] 6. 인터랙션 검증            — 하이파이 실측 Playwright(390×844): 죽은 컨트롤 0 + axe serious 0, screens 53/53 green(보정: 토큰 muted/badge 대비 + 9화면 dead/aria 외과). 무인: 3층 사람 느낌 미검수
- [x] 7. handoff                  — handoff/ self-contained 패키지(index.html·token-mapping.md·component-inventory.md·hand-off.md + PRD·00-flow·screens·foundation·_shots 복사), lint-handoff green

후보 / chosen final:
- screens/ (chosen) — 하이파이 chosen final. 독립 검증(N=3 다수결, 렌더 기반) + 트렌드 85(임계 80) 통과.

메모:
- 모드: /forge (무인) — 장소 중심 인스타 클론(요기조기). 사람 접점은 시작 인테이크 1회.
- 무인 기획: 시장조사 4축(경쟁/니즈/도메인/IA, market-researcher 웹검색) + prd-critic N=3 다수결 비평(PASS, FAIL표 0). 자동 저하 없음.
  - 산출: PRD.md(본문) · plan-decisions.md(근거 원장 — grounded 항목 §11.2→§11.1 승격, guess는 A1·A2만 잔존) · prd-review.md(8차원 전부 ok). lint-prd / lint-prd-review 게이트 대상.
- 시작 인테이크(사용자 답 — 최우선 전제):
  - 앱 = 장소 중심 사진 SNS. 인스타가 시간 중심이라면 요기조기는 **장소 중심**. 피드에 지도+사진.
  - 업로드 흐름 = 사진 다중 선택 → EXIF(촬영 위치/시각) + **역지오코딩**으로 장소별 자동 분류 → 미분류 사진은 사용자 수동 편집 → 태그·메모(옵션, 인스타 동일).
  - **홈 구조(답) = 지도 중심 홈** — 전체 지도에 내/팔로잉 사진이 장소 핀으로, 동선 라인 표시. (지도 탭 + 피드 탭 + 업로드)
  - **장소 단위(답) = POI/장소명 단위** (예: "블루보틀 성수", "서울숲", "대림창고"). 역지오코딩을 POI로 매핑.
  - **MVP 화면(답, 전부 IN) = 로그인/회원가입 · 온보딩 · 프로필(내 지도/그리드) · 알림** + 핵심(지도 홈·피드·업로드 흐름·검색·친구 프로필).
  - 인증(답) = Supabase 제공 카카오/지메일(구글)/이메일 로그인. (백엔드 실인증은 범위 밖, 진입 화면 UI는 그림)
  - 소셜(답) = 친구 검색 및 팔로우 추가, 친구 프로필 보기, 공개/비공개.
  - **비주얼 톤(답) = 지도앱 감성** (네이버지도/구글맵류 컬러 핀·정보카드·FAB 버튼·그림자).
  - 지도 SDK = 카카오 지도 또는 구글 지도 예정(미확정 — 디자인은 SDK 비종속 지도 표현으로).
  - "MVP라도 인스타와 최소한 동일한 경험을 제공하고 싶다"(사용자 요구).
- 뷰포트(가정) = 모바일 390px 기본(인스타식 모바일 앱), 라이트 우선.
- 언어(가정) = 한국어 UI.
- 무인 디자인: forge-design workflow(빌드 15 → 렌더 PNG → design-verifier N=3 다수결 → 트렌드 85≥80, 리디자인 불필요·pixelChecked:true).
  - workflow degraded "chosen 독립 검증 FAIL" → §0 안정성 계약(재시도 ≤2)으로 메인이 외과 보정 후 해소:
    - 1차 FAIL 2건: follow-seed(deadControl — '요즘 뜨는 동네' 칩 미와이어 → search 링크), map-home(bad — 핀 라벨↔동선 캡션 충돌 → 캡션 좌하단 이동). 독립 design-verifier N=3 재판정 만장일치 PASS → lint-verify green.
    - 하이파이 실측 Playwright(390×844) 1차 red: 토큰 muted(#6a737b→#626b72)·상태 pill amber/green 텍스트 대비 보정 + 9화면 dead-control/aria 외과(칩/범위밖 마커/모두해제/지도컨트롤·후보 listbox/scrim/카운트 비인터랙티브/라디오 클릭/재요청 토스트/grid·dots·maparea role). screens 53/53 green(죽은 컨트롤 0·axe serious 0).
  - shoot.js fullPage 캡처라 fixed CTA/탭바가 풀페이지 PNG에서 겹쳐 보이는 아티팩트 존재 — 실 390×844 뷰포트는 padding-bottom으로 정상(검증자·Playwright로 확인). 트렌드 권고(히어로 평면 그라데이션·settings 아이콘 톤·profile-me 그리드 충실도)는 비차단 권고로 미반영(사람 검수 시 개선 여지).
- handoff: handoff/ self-contained 패키지 4종 + PRD·00-flow·screens·foundation·_shots 복사, 경로 ./상대 재작성. lint-handoff green. ★ 무인 최종 산출물.
- ⚠ 자동 저하: 없음 — 전 게이트(lint-prd·lint-prd-review·Playwright 1·2층·a11y 토큰·axe·lint-verify·lint-handoff) 정상 통과. 1차 FAIL 2건은 재시도 2회 내 해소(사람 개입 불필요).
