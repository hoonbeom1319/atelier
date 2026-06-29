# team-leave — 독립 검증 (design §C step 5 / 하이파이)

검증자: design-verifier (독립 서브에이전트) — 빌더·메인과 다른 컨텍스트
대상: screens/        ← 검증한 폴더(screens)

근거: 렌더 PNG(픽셀) 10종 직접 판독 + approvals.html 마크업(직전 수정분) deadControl/stateInert 재확인.

## 화면별 render-check
| 화면 | thin | bad | variantsIdentical | off-brief | deadControl | stateInert | wireframey | 판정 |
|---|---|---|---|---|---|---|---|---|
| login.html | ok | ok | ok | ok | ok | ok | ok | PASS |
| home.html | ok | ok | ok | ok | ok | ok | ok | PASS |
| request.html | ok | ok | ok | ok | ok | ok | ok | PASS |
| approvals.html | ok | ok | ok | ok | ok | ok | ok | PASS |
| calendar.html | ok | ok | ok | ok | ok | ok | ok | PASS |
| balance.html | ok | ok | ok | ok | ok | ok | ok | PASS |
| requests.html | ok | ok | ok | ok | ok | ok | ok | PASS |
| notifications.html | ok | ok | ok | ok | ok | ok | ok | PASS |
| members.html | ok | ok | ok | ok | ok | ok | ok | PASS |
| settings.html | ok | ok | ok | ok | ok | ok | ok | PASS |

## 검증 노트 (핵심)
- **approvals.html (집중 재검증) — bad 회귀 닫힘 확인.** 직전 FAIL 사유(우측 320px 고정 레일이 8열 테이블을 눌러 셀 줄바꿈·행 높이 불균일·사유 잘림)가 렌더 PNG에서 해소됨: 테이블이 전폭(table-card, width:100%)으로 펼쳐지고, 5개 행 높이 균일, 사유 컬럼(개인 사정 / 병원 진료 / 여름 휴가(가족 여행) / 감기 몸살, 진단서 첨부 / 본인 결혼) 한 줄로 읽힘, 8열(신청자·종류·기간·일수·신청일·사유·상태·액션) 모두 들어감. 상단 요약 스트립(대기 5 / 오늘 팀 부재 2 / 이번 달 승인 8 / 종류 범례) 추가 확인. sticky thead 제거로 풀페이지 캡처 겹침 없음. 우측 레일은 position:fixed 슬라이드인 드로어로 전환되어 평상시 테이블 폭을 점유하지 않음.
  - deadControl/stateInert(마크업): 탭(showTab)·필터칩(filterType)·검색(searchRows)·행선택→드로어(selectRow/rail.open+backdrop)·승인(doApprove: 상태태그 승인 전환 + 액션셀→확정 라벨 + refreshCount)·반려(모달 필수입력 5자 게이트, disabled→해제, doReject 상태 반려 전환)·빈 큐 토글 모두 와이어드. 죽은 컨트롤 없음.
- 나머지 9개(login/home/request/calendar/balance/requests/notifications/members/settings): 렌더 PNG에서 회귀 없음. 좌측 내비 셸·라이트모드·1280·한국어 일관. 깊이(card shadow-xs/lg)·여백 리듬·타이포 위계(display/h1/h2/body/caption 구분)·상태 배지·아바타 색·호버/마이크로 인터랙션 존재 → wireframey 아님. settings 환경설정 토글은 `[범위 밖]` 라벨 명시(의도적 셸) — deadControl 아님. 미니멀은 brief 의도이므로 off-brief 미적용.

## 재작업 지시 (FAIL이면 화면별 구체 지시)
- 없음 — 전 화면 통과.

## 종합
RESULT: PASS
