# yogi-jogi — 진행 상태

현재 단계: 7-handoff 대기 (대상 프로젝트 지정 필요)

- [x] 1. 인테이크
- [x] 2. 와이어프레임 (lo-fi, 클릭+상태변화) — 전 묶음 OK
- [x] 3. 흐름·기능 검증 (기계 49/49 green + 사람 OK, IA 수정 포함)
- [x] 4. 디자인 시스템 (2단 토큰 + Foundation + Components) — OK
- [x] 5. 하이파이 (hi-fi) — 14화면, §C 편성(빌더+독립검증) — 사람 느낌 OK
- [x] 6. 인터랙션 검증 (기계 screens 22/22 green + 사람 느낌 OK)
- [ ] 7. handoff

메모:
- 5단계 하이파이: screens/app.css(공용 컴포넌트 레이어, semantic만). C4 톤세터 메인 직접.
- 묶음1 하이파이 §C 편성 완료: 빌더 5(C1·C2·C3·C5·C6 병렬) → 독립 검증 1(적대적 render-check). 검증이 2건 적출(C1 본문글자 코랄 오용 / C6 큰 사진 너무 옅음) → 메인이 수정 → 재캡처 OK.
- 기계 2층 회귀(screens-chunk1.spec.js) 9/9 green, JS에러 0. 증빙 playwright-report/ + _shots/.
- 묶음1 하이파이 = screens/{index,picker,assembling,review,finalize,course}.html. 사람 느낌 OK.
- 묶음2 하이파이 §C: 빌더 3(home·together·webview) → 독립 검증 3/3 PASS. 사람 느낌 OK.
- 묶음3 하이파이 §C: 빌더 5(profile·user·search·login·settings) → 독립 검증 5/5 PASS(수정 0, JS에러 0).
- ★ 전체 하이파이 14화면 완성. 기계: screens-chunk1/2/3 + screens-reachability = 22/22 green (전체 도달성 14화면·막다른길 0·고아 0 포함). 증빙 playwright-report/ + _shots/verify*.png.
- → 묶음3+전체 사람 느낌 OK → 6 인터랙션 검증 마무리(사람) → 7 handoff.
- 큰 PRD(13화면) → 3묶음. 묶음1 기록루프(C1~C6, C4★) / 묶음2 발자취&연결(S1·S2·S4) / 묶음3 계정(S3·S5·S6).
- 외부 의존성 0 제약 → 지도는 CSS/SVG faux-map(코랄 동선 polyline + 번호 핀). 실제 카카오맵 X.
- 인테이크 확정: 샘플=전주 한옥마을 가족나들이 / 진입점=C1 빈상태 / 뷰포트=모바일 단일컬럼(반응형 셸은 hi-fi에서).
- 2단계 진행: 묶음1(C1~C6) 와이어부터. 와이어는 단순 폰 폭, 반응형 X.
- 묶음1 와이어 7파일 완성: index(C1)·picker(C2)·assembling(C3)·review(C4★)·finalize(C5)·course(C6)·stub-next(경계 스텁).
- 2단계 묶음별 진행: 묶음1 OK / 묶음2 OK / 묶음3 기계 green(사람 판단 대기).
- 묶음3 와이어 완성: login(S5)·profile(S3)·settings(S6). chunk3.spec.js 11/11.
- ★ 와이어 배리어 완료: 스텁(stub-next) 제거, 탭바 프로필/다같이 실제 화면 연결. reachability.spec.js — index에서 12화면 전부 도달·막다른길 0·고아 0.
- ★ IA 수정(사람 3층 피드백): 프로필 탭=내 프로필(profile). 다른 사람 프로필=user(신규)는 다같이 이름·아바타/검색에서만. 사람 찾기=search(신규). 다같이는 팔로우한 사람 보는 곳, 발견·팔로우는 search가 담당.
  - profile.html→내 프로필 전용 재작성 / user.html·search.html 신규 / together.html 이름·아바타→user, 헤더·빈상태→search. 00-flow §1·§2·§3·§4 갱신(화면 14개).
- 전체 와이어 49/49 green(묶음1 21 + 묶음2 13 + 묶음3 14 + 도달성 1). 증빙: playwright-report/ + test-results/.
- 와이어 단계(2·3) 확정 OK.
- 4단계 디자인 시스템 작성: foundation/tokens.css + foundation/colors.html·typography.html(Foundation) + components/index.html(Components 갤러리: 버튼·FAB·탭바·토글·팔로우·칩·배지·인풋·진행바·코스/Stop 카드·faux-map·썸네일선택·시트·토스트).
- ★ 스킬 업데이트 반영: 토큰을 표준 2단(primitive 팔레트 + semantic 역할)으로 리팩터. 중립 웜그레이 램프(0~900) + 액센트 코랄(100/500/600) 등. 화면·컴포넌트는 semantic만 참조(--color-primary/text/bg/surface/border…). 제품토큰(지도 동선=var(--color-primary), 지도배경=로컬 리터럴)은 파운데이션에서 제거. _shots/로 시각 확인 OK. → 사람 OK 대기.
- 다음: 토큰·컴포넌트 OK → 5단계 하이파이(14화면, §C 에이전트 편성: 계획→토큰·스펙 공유→병렬 빌더→독립 검증).
- 묶음2 와이어 완성: home(S1)·together(S2)·webview(S4). course 공유링크 → webview 연결.
- 묶음2 기계검증 green: chunk2.spec.js 11/11. 전체 32/32. 증빙: playwright-report/ + test-results/(스크린샷·트레이스).
- 묶음1 기계검증 green: chunk1.spec.js 21/21. 사람 직접 테스트 통과(2026-06-23).
- 증빙 규칙 반영: playwright.config.js = html 리포트 + screenshot:on + trace:on. 실행 후 `npx playwright show-report`로 확인.
- 묶음2 = S1 홈 누적지도(home) · S2 다같이(together) · S4 웹뷰(webview). 묶음3(S3·S5·S6) 대기.
