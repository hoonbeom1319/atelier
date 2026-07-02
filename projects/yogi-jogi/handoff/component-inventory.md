# 요기조기 — 컴포넌트 인벤토리 · 3차 (지도 히어로 피드 · 모노 UI + 컬러 사진)

> 화면은 외부 의존성 없는 독립 HTML이라 컴포넌트가 **화면 안에 인라인**. 받는 쪽은 자기 프레임워크로 추출·재사용. semantic 토큰만 참조(`token-mapping.md`).
> **톤: 인스타 하이파이** — UI 크롬은 모노크롬(검정 액션·핀·FAB, 흰 면, 헤어라인), **사진·썸네일은 컬러 실사**(회색 금지). 레드 = 좋아요·미열람만.

## 내비게이션 / 셸
| 컴포넌트 | variant / state | 쓰이는 화면 |
|---|---|---|
| **하단 탭 바** (홈·＋FAB·프로필) | 활성(aria-current), 검정 원형 FAB, 불투명 흰 바+헤어라인 | feed, map-home, search, profile-me, profile-friend, notifications, post-detail |
| **상단 앱바** | 검색 pill/타이틀·알림 벨(레드닷). 아바타 없음 | feed, search, profile-me, notifications |
| **업로드 헤더** (뒤로·제목·다음/게시 + 진행 스텝) | 1→2→4 | upload-1-gallery, upload-2-classify, upload-4-meta |

## ★홈 피드 (지도 히어로 카드 — 3차 핵심)
| 컴포넌트 | variant / state | 쓰이는 화면 |
|---|---|---|
| **지도 히어로 포스트 카드** | 헤더(작성자·동네·시간·POI칩) → **지도(동선 폴리라인+장소 핀, 카드 메인)** → **작은 컬러 사진 썸네일 행** → 좋아요♥(레드)·메모·태그 | feed(홈) |
| **동선 폴리라인 + 번호 핀** (검정) | 촬영순 연결, "동선 N곳·거리" 칩 | feed 카드, map-home, post-detail, profile 지도뷰 |
| **컬러 사진 썸네일** (실사 컬러 그라데이션 + 깊이 오버레이) | 카페 브라운·공원 초록·야경 블루 등 다양 | feed, map-home, post-detail, profile 그리드, search, upload |

## 지도 / 장소
| 컴포넌트 | variant / state | 쓰이는 화면 |
|---|---|---|
| **장소(POI) 상세** (map-home) | 장소명·카테고리·주소 + 장소 중심 지도 + 그곳 포스트/사진 컬러 그리드 + 방문 친구 + 저장 토글 | map-home |
| **모노 핀** (검정 티어드롭 + 카운트/번호) | 카테고리는 아이콘/라벨로 구분(색 아님) | feed, map-home, post-detail |
| **바텀시트** (닫힘 visibility:hidden + scrim) | 핀 미리보기·옵션 메뉴·배정 시트 | feed, profile-friend, upload-2 |

## 소셜 / 콘텐츠
| 컴포넌트 | variant / state | 쓰이는 화면 |
|---|---|---|
| **사진 캐러셀** (컬러, 도트) | 인덱스 N/M | post-detail, feed 썸네일 |
| **카카오맵 검색 결과 행** (아이콘·장소명·카테고리·도로명·거리·'카카오맵' 출처) | 리스트 | search, upload-2(배정 시트) |
| **팔로우 버튼** | 팔로우(검정)/팔로잉(아웃라인)/요청됨 (aria-pressed) | follow-seed, search, profile-friend, notifications |
| **세그먼트/탭** (role=tablist>tab, 검정 언더라인) | [장소\|사람\|태그]·[그리드\|지도]·공개범위·메모 | search, profile-me, profile-friend, upload-4-meta |
| **컬러 사진 3열 그리드** (2px gap) | 채움/빈/비공개 잠금 | profile-me, profile-friend, map-home |
| **알림 행** | 미열람(레드닷)/열람·팔로우백, 컬러 썸네일 | notifications |

## 업로드 (다단계 — upload-3 흡수)
| 컴포넌트 | variant / state | 쓰이는 화면 |
|---|---|---|
| **컬러 썸네일 다중선택 셀** | 선택(검정 순번 배지)/미선택 (aria-pressed) | upload-1-gallery |
| **POI 그룹 카드** | 추정(아웃라인)/확정(검정) pill, 컬러 대표 사진 | upload-2-classify |
| **미분류 in-place 배정** ★ | 미분류 컬러 썸네일 탭 선택→'장소 지정' 바(visibility)→배정 시트(**카카오맵 검색** role=listbox/option + **직접 핀 찍기**) + 사진 이동/병합/분리 메뉴 | upload-2-classify |
| **공개범위 세그먼트** (모노 라인 아이콘: 지구본/사람/자물쇠) | 공개/팔로워(기본)/비공개 + 설명 동기화 | upload-4-meta, settings |
| **태그 칩 입력** | 추가/삭제·빈입력 힌트 | upload-4-meta |

## 폼 / 기타
| 컴포넌트 | variant / state | 쓰이는 화면 |
|---|---|---|
| **소셜 로그인 버튼** | 카카오(노랑)·구글(브랜드)·이메일 — *브랜드색 예외* | auth |
| **권한 프라이밍 카드** | 위치/사진, 허용/나중에 + 폴백 | onboarding, settings |
| **스위치 / 커스텀 라디오** (검정 on / 투명 오버레이 input) | 동선 공개·공개범위 기본값 | settings |
| **상태 배지 pill** (모노) | 추정/확정·[범위 밖]·[다음 단계] | upload-2, post-detail, profile |
| **빈 상태** (모노 일러스트 + CTA) | 빈 피드·게시물0·알림0·빈추천·빈검색 | feed, profile-me, notifications, follow-seed, search |
| **토스트** | 권한·최대장수 등 | upload-1, upload-2, settings |
