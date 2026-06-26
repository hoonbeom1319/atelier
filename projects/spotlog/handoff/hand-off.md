# spotlog 디자인 인계 — 대상 프로젝트에 구현

## 목표
아래 디자인 산출물을 **대상 프로젝트의 컨벤션**으로 구현한다. 디자인은 *참고*, 흐름·기능·상태는 *계약(필수)*.
spotlog = "공간(장소) 축의 인스타": 사진 여러 장을 올리면 EXIF(위경도·시간)로 장소별 자동 그룹핑되어 **장소 카드 피드**가 된다. 다크 단일, 모바일 폭 컬럼 셸(480px 중앙, 390~1280px 무파손).

> atelier 저장소 루트(경로 기준): `C:\Users\EASTARJET\Desktop\DEV\01. BEOM\atelier`
> 아래 경로는 그 루트 기준 상대경로다.

## 먼저 읽을 것
- 대상 프로젝트의 `CLAUDE.md` — 너의 코드 컨벤션(폴더구조·아키텍처·프레임워크). **여기 맞춰 짠다.**
- 제품 요구사항(왜·무엇의 근거):
  - `projects/spotlog/PRD.md` — 배경·목표·성공지표·기능 요구(동작·엣지케이스)·**데이터 모델**·범위 외·가정. 흐름과 디자인이 *왜* 이렇게 됐는지의 근거.
- 디자인 패키지(atelier 산출물):
  - `projects/spotlog/screens/` — chosen final 8화면(최종 비주얼·상태·전환). 진입점 `screens/index.html`.
  - `projects/spotlog/handoff/index.html` — 화면 임베드 + 흐름맵 + 화면별 스펙(한눈에).
  - `projects/spotlog/handoff/token-mapping.md` — semantic 토큰 → 너의 토큰 매핑(통째 복붙 금지).
  - `projects/spotlog/handoff/component-inventory.md` — 컴포넌트 variant/state + 쓰이는 화면.
  - `projects/spotlog/00-flow.md` — 흐름(§플로우)·기능 책임(§구성요소·상태)·인터랙션 모델 = **지킬 계약**.
  - `projects/spotlog/foundation/tokens.css` — 토큰 원본(표준 2단). `components/` — 컴포넌트 시트.

## 지킬 것 (계약 — 임의 변경 금지)
- **화면·내비·흐름:** 8화면(index, upload-select, upload-group, map-pin, upload-publish, card-detail, explore, profile)과 흐름 A(업로드)/B(열람)/C(탐색·팔로우)를 디자인대로. 죽은 컨트롤 0(모든 인터랙티브 요소는 와이어드 또는 명시적 범위 밖).
- **상태 동작(자동 검증된 계약):** 다중 선택 카운터·다음 활성화 / 장소명 후보 팝오버(role=dialog "장소명 후보") 선택→확정·후보 0건 폴백 / 미분류 이동→카운트 감소·0이면 숨김 / 핀 이동→좌표 변화 / 공개 스위치(role=switch, **기본 비공개**)→고지 변화 / 팔로우(aria-pressed)→팔로워 수 ±1 / 썸네일→대표 사진 교체. 접근성: 다크 WCAG AA, 폼·팝오버·토글에 role/aria, 포커스 가시성.
- **데이터 모델(PRD §5):** Photo(가변 placeCardId로 미분류 재배치)·PlaceCard(좌표 불변 / placeName 가변 / createdAt·postedAt 분리 — N1은 createdAt, R1·E2는 postedAt 기준)·User(팔로우 N:M)·Tag(N:M). 제안 카드 = PlaceCard(confirmed=false) → 게시(confirmed=true, postedAt 기록).
- **토큰:** token-mapping.md대로 **대상 시스템 토큰에 매핑**(통째 복붙 금지). 코랄은 장소·핀·CTA 액센트 역할로만.

## 외부 연동 (산출물은 목업 — 너가 실연동)
atelier 산출물은 외부 의존성 없는 독립 HTML이라 아래는 전부 **목업/시드**다. 대상 프로젝트에서 실연동한다(PRD §10):
- **EXIF 디코딩:** 사진의 위경도(DMS→십진, Ref 부호 적용)·촬영시간(OffsetTimeOriginal/GPS UTC 우선)·(0,0)/이상치 null 처리.
- **시공간 클러스터링:** 시간 갭(권고 90~120분)으로 세션 분리 + 좌표 반경(권고 100~200m)으로 카드 묶음 — **튜너블 파라미터로 노출**(실데이터 튜닝, PRD §11 B1).
- **역지오코딩·POI 검색:** 카카오 등(coord2address / keyword 검색)으로 근처 장소명 자동 추출 + 후보 거리순 목록. API 응답 → PlaceCard(placeName/poiId/address/region) 매핑.
- **지도 SDK:** map-pin 화면의 목업 지도/핀을 실제 지도로 — 핀 이동으로 좌표 확정.
- **프라이버시:** 기본 비공개·공개 전 고지·실시간/현재 위치 비노출(과거 방문만)을 서버/클라 양쪽에서 강제.

## 만들 순서 (제안)
1. 토큰 매핑 반영(token-mapping.md) → 2. 공통 컴포넌트(component-inventory.md 7종) → 3. 화면 조립(8화면) → 4. 흐름·상태 연결 → 5. EXIF·역지오코딩·지도 실연동.

## 검수
- 흐름·기능이 `00-flow.md` 계약대로 동작하는지(업로드→자동그룹핑→보정→게시 / 탐색→팔로우 / 빈 상태). 죽은 컨트롤 0.
- 다크 WCAG AA 대비, 390~1280px 무파손.
- 기본 비공개·위치 프라이버시가 실제로 지켜지는지.

## 참고 — atelier 검증 증빙(이미 통과)
- 기능·2층 회귀 + 반응형: `node scripts/test-project.js spotlog projects/spotlog/wire.spec.js`(screens 대상은 `SPOTLOG_DIR=screens`) — 37/37.
- 렌더 a11y(다크): `node scripts/test-project.js spotlog projects/spotlog/screens-a11y.spec.js` — 8/8.
- 토큰 대비 AA: `projects/spotlog/tokens.spec.js`. 독립 검증: `projects/spotlog/design-verify.md`(RESULT PASS). 트렌드 감정: `projects/spotlog/design-critique.md`(84/100).
- 리포트 열기: `npx playwright show-report projects/spotlog/playwright-report`.
