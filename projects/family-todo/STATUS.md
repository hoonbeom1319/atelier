# family-todo — 진행 상태

현재 단계: ✅ 완료 — handoff 패키지 작성됨 (대상: Next.js+Supabase+Vercel). 대상 repo에 hand-off.md 붙여넣으면 구현 착수.

- [x] 0. 기획 (PRD 작성)  ← /plan
      - [x] 1. 문제 정의
      - [x] 2. 목표·성공 지표
      - [x] 3. 타깃 사용자
      - [x] 4. 핵심 기능·우선순위 (MVP 확정)
      - [x] 4-1. 개념 데이터 모델
      - [x] 5. 사용자 흐름·주요 화면
      - [x] 6. 기술·일정 제약
      - [x] 7. 착수 전 체크리스트
      - [x] → PRD.md 작성 완료
- [x] 1. 인테이크 (00-flow)        ← /design 부터
- [x] 2. 와이어프레임 (lo-fi)       — 3화면, 클릭+상태변화(localStorage 가짜 백엔드)
- [x] 3. 흐름·기능 검증            — 기계 13/13 green + 사람 OK (＋날짜 제거·완료됨 접기·S3 바텀시트 결정 반영)
- [x] 4. 디자인 시스템             — 토큰(2단)+Foundation(색·타이포·모션)+Components, 라이트/다크 _shots OK (사람 OK 2026-06-24)
- [x] 5. 하이파이 (hi-fi)           — screens/{app.css,index,list}. S3=바텀시트. 모션 강조. _shots 라이트/다크+상태 OK
- [ ] 5.5 리디자인 (선택)            — 불필요 판단(하이파이가 토큰·모션으로 충분히 도약)
- [x] 6. 인터랙션 검증             — 기계 13/13 green + 사람 느낌 OK (2026-06-24)
- [x] 7. handoff                   — handoff/{index.html,hand-off.md,token-mapping.md,component-inventory.md} (대상: Next.js+Supabase+Vercel)

메모:
- 아이디어: 우리 가족만 쓰는 전용 TO-DO 앱.
- 1.문제정의: 부부 2명의 할 일·메모·일정이 4채널(내폰 캘린더/메모, 와이프폰 등)로 흩어짐 → "우리 둘의 할 일"을 보는 단일 장소 부재. 통증=공유사고보다 "흩어짐" 자체. 가치=효율20 vs 우리만의것(애착)80.
- 실사용자=부부 2명(아기16개월은 사용자X, 할 일의 "소재"). 둘 다 아이폰. 본인=개발자(풀스택).
- 2.목표: (가)채널 통합 1개로 + (나)두 폰 공유 + (라)우리 거 같은 느낌. ※(다)리텐션은 명시 선택 안 함(라+나가 다로 이어진다고 봄).
- 동기화 한다 → 서버·계정 필요. 스택: Next.js + Supabase + Vercel. 본인 FE/BE 다 가능. (개인 폰 로컬저장은 용량부족으로 기각.)
- B(우리만의것) 80 → 최대 리스크=과욕. MVP 잔인하게 작게(흩어진 걸 한 곳에 모은다 하나).
- 4.MVP 확정: ①공유목록 1개 ②할일 추가(텍스트 기본+날짜 선택) ③완료 체크/해제 ④삭제 ⑤두 폰 동기화 ⑥로그인(둘만) ⑦완료 흔적(완료시각 남아 쌓임). 목록은 1개로 가볍게.
  - 뺄 것: 담당자/알림·푸시/월간 캘린더 뷰/카테고리·다중목록/반복·첨부·댓글.
  - 나중에: 완료 통계·성취 화면, 카테고리, 알림, 캘린더 뷰.
  - 흔적=최소(완료됨으로 남아 쌓임), 통계화면은 나중(사용자 확인 대기 중이나 "가볍게"로 사실상 확정).
- 4-1.데이터모델 (★PIN 결정으로 개정): 엔터티 2개 — Household(가족공간: 이름+PIN) 1:N Task(내용+날짜nullable+완료여부+완료시각). User 엔터티 제거(개인신원 안 씀), created_by 제거. 동시편집=마지막 동작이 이긴다(LWW). 물리스키마·PIN 보안구현은 범위 밖(가정에 명시).
- 인증: 개인 로그인(Gmail) 기각 → (2)가족 공통 PIN 하나로 입장. "우리만 들어온다"의 문. 최초 PIN 설정→이후 입력, 기기 기억.
- 5.화면(모바일, 아이폰 세로): ①PIN 입장(설정/입력) ②할 일 목록 메인★(진행중+완료됨 흔적, 빠른 추가) ③할 일 추가·편집(텍스트+선택 날짜). 상태: 빈/로딩/에러(오프라인).
- 6.제약/디자인: 스택 Next.js+Supabase+Vercel, 본인 풀스택, 일정=취미 여유(데드라인X). 디자인=파란색 계열·다크모드 포함·★애니메이션 비중 크게·모바일 온리. 레퍼 제안(Things3/Linear 등).
- ★ PRD.md 작성 완료 → /design 인테이크 대기. 미해결: PIN 분실 처리, 완료 누적 정리, S3 형태. 가정: PIN 공통입장 보안은 개발단계 직접구현(LWW 충돌).
- [/design] 1.인테이크: 00-flow.md 작성(3화면 S1 PIN/S2 목록★/S3 추가·편집, 모바일390, 동기화=범위밖 백엔드계약).
- [/design] 2.와이어: wireframe/{index,list,edit}.html. 클릭 이동 + localStorage 가짜백엔드로 추가/체크/삭제/편집 실제 상태변화. 상태 데모(빈/로딩/오프라인).
- [/design] 3.검증 기계: wire.spec.js 12/12 green (1층 도달성·막다른길0 + 2층 PIN분기·추가·완료토글·해제·삭제·빈상태·로딩/오프라인·날짜편집). 증빙 projects/family-todo/playwright-report/ (프로젝트별 라우팅). 실행: node scripts/test-project.js family-todo projects/family-todo/wire.spec.js.
- [/design] 3층 사람피드백①: 빠른추가 옆 ＋날짜 버튼 제거(중복) → 생성은 텍스트 빠른추가 1경로, 날짜는 항목 탭→S3 편집에서.
- [/design] 3층 사람피드백②(스케일): 리스트 무한증식 우려 → '최소' 선택. 진짜 커지는 건 완료됨(흔적)이라 판단 → 완료됨 기본 접기(개수만)+완료 비우기(정리). 진행중은 단순 나열 유지(카테고리 도입 안 함=과도설계 회피). 00-flow·list.html·spec 동시 정정.
- [/design] 재검증 13/13 green. 증빙 projects/family-todo/playwright-report/. → 사람 OK(4 디자인 시스템 착수).
- [/design] 4.디자인 시스템: foundation/tokens.css(2단)+colors.html+typography.html+components/index.html. 사람 OK.
- [/design] 4.사람 피드백 반영: ①할일 체크 동그라미 26→22px 축소 ②그라데이션 토큰 추가(--gradient-bg=상단 글로우 / --gradient-primary=버튼·FAB 대각), 라이트/다크/시스템다크 3곳. colors.html에 그라데이션 스와치 + 전 파운데이션 페이지 bg 적용. _shots 재캡처 OK.
- [/design] 5.하이파이 착수: screens/{index(S1)·list(S2)·app.css}. S3=00-flow 결정대로 list 위 바텀시트로 승격(별도 페이지 X). 추가=빠른추가바 인라인, 편집·날짜=시트. 6단계 재실행 위해 계약 유지: role/aria/텍스트 + .item·.skel·#offline·#date + 상태데모 버튼(정상/로딩/오프라인/전체비우기) + 카운트 '진행 중 N · 완료됨 M'.
- [/design] 5.하이파이 완성. 모션 강조(PRD): 추가=itemIn 스프링, 삭제=itemOut(animationend+240ms fallback), 체크=스프링, 시트=slide-up emphasized, 빈상태 bob, PIN오류 shake, 저장 토스트. 시트 닫힘은 visibility:hidden(transform 유지+스크린리더/테스트에 숨김). _shots: s1/s2/s3-sheet/s2-empty/s2-done-open × light·dark.
- [/design] 6.인터랙션 검증(자동): screens.spec.js 13/13 green(1층 도달성·핵심경로 + 2층 전 기능, S3는 시트 노출/닫힘으로 포팅). 증빙 projects/family-todo/playwright-report. 사람 느낌 OK(2026-06-24).
- [/design] 7.handoff: 대상=Next.js+Supabase+Vercel(PRD 스택). handoff/{index.html(비주얼 문서, screens iframe 임베드+다크동기), hand-off.md(★인계 프롬프트: 참고파일·3층 계약[토큰2단·기능/플로우·모션·데이터]·만들 순서·범위밖·톤), token-mapping.md(semantic 역할 매핑표 — 경로A CSS변수 채택 / 경로B Tailwind theme), component-inventory.md(13개 컴포넌트 variant·state·모션·aria 계약)}. PRD·00-flow·screens.spec.js는 참조 링크. atelier는 대상 코드 직접 안 짬 — 받는 쪽 Claude가 자기 컨벤션으로 구현.
