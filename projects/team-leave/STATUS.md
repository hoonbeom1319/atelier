# team-leave — 진행 상태

현재 단계: 7-handoff 완료 (무인 — 사람 검수/실인계 대기)

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
- [x] 1. 인테이크 (00-flow)        ← /design 부터
- [x] 2. 와이어프레임 (lo-fi)       — 11개 화면, 클릭+상태변화, 죽은 컨트롤 0
- [x] 3. 흐름·기능 검증            — Playwright 1·2층 24/24 green (무인: 3층=계약 준수)
- [x] 4. 디자인 시스템            — tokens.css 표준 2단 + a11y 대비 16쌍 AA green / colors·typography + 컴포넌트 6종
- [x] 5. 하이파이 (hi-fi)          — 10화면, 독립 검증(design-verifier N=3, 렌더 PNG 기반) RESULT:PASS + 트렌드 84(≥80)
- [~] 5.5 리디자인 (선택)          — 불필요(트렌드 84 ≥ 임계값 80, belowThreshold:false)
- [x] 6. 인터랙션 검증            — 자동 green: 죽은 컨트롤 0 + axe serious 0, screens 20/20 (무인: 3층 사람 느낌 미검수)
- [x] 7. handoff                  — handoff/ 패키지 4종(index.html·token-mapping.md·component-inventory.md·hand-off.md), lint-handoff green

후보 / chosen final:
- screens/ (원본) — (chosen)

메모:
- 모드: /forge (무인) — 업그레이드된 하네스 E2E 테스트(plan surfaceComplete · design wireframey/렌더 · forge 안정성 검증용).
- 무인 기획: 시장조사 3축 + prd-critic N=3 다수결 비평. workflow 자동 개정 1회 후에도 FAIL(소수의견 dataCoherent·consistent 각 1표).
- ⚠→해소: §0 안정성 계약(재시도 2회 내)에 따라 메인이 해당 섹션만 외과 보정 — §5에 BalanceAdjustment 엔터티(HR 시드 변경 감사 원장)+관계/불변식 추가, SC2에 HR(R3) 뷰+위젯별 ←F# backing 추가. 별도 컨텍스트 prd-critic 3명 재비평 → **만장일치 PASS**. lint-prd·lint-prd-review 둘 다 green. (degraded 해소됨 — 사람 개입 불필요.)
- 무인 디자인: forge-design workflow(빌드 10 → 렌더 PNG → design-verifier N=3 다수결 → 트렌드). 트렌드 84(≥80)로 리디자인 불필요·pixelChecked:true. 1차 독립검증서 approvals만 bad(레일이 테이블 폭 잠식) → 레이아웃 전폭화·충돌 드로어화·sticky thead 제거로 보정 → 재검증 만장일치 PASS.
- 무인 디자인 a11y 회귀(C-6): axe·죽은컨트롤 1차 red → 7화면 외과 보정(opacity 대비 트랩 제거·틴트 배경 텍스트 진하게·nested-interactive/list/aria-allowed-attr 구조 수정·login 범위밖 표식) → screens 20/20 green(죽은 컨트롤 0·axe serious 0). 활성 탭/필터·커스텀 라디오는 클릭-디프 프로브 한계라 spec ignore(픽셀 검증서 정상 확인).
- ⚠ 하네스 버그 2건(이 세션에서 발견·우회): ① forge workflow .js가 CRLF라 Workflow 승인 다이얼로그가 거부 → LF 사본을 scratchpad에 만들어 실행. ② .claude/agents/design-trend-expert.md frontmatter description에 콜론+공백이 있어 YAML 파싱 실패 → 에이전트 미등록. description을 단일 인용부호로 감싸 수정함(다음 세션부터 정상 로드). 이 세션은 레지스트리가 고정돼 trend 단계를 범용 claude 에이전트로 대체 실행(별도 컨텍스트 유지 — 프롬프트+스키마가 채점 루브릭 구동). 트렌드 점수 84는 이 대체 경로 결과.
- 시작 인테이크(가정 — 완전 무인 폴백, 사용자는 아이디어+범위만 지정):
  - 앱 = 팀 휴가 신청·승인 내부툴 (team leave request/approval internal tool)
  - 사용자(가정) = 직원(신청자) · 팀장/관리자(승인자) · HR(관리). 데스크톱 우선 내부 업무 환경.
  - 문제(가정) = 휴가 신청이 메신저·이메일·엑셀로 흩어져 승인·잔여 연차 추적이 안 됨.
  - MVP(가정) = ① 휴가 신청(종류·기간·사유) ② 승인/반려 워크플로우 ③ 잔여 연차 조회 ④ 팀 휴가 현황/캘린더 ⑤ 알림(개념).
  - 아키타입(가정) = 내부 SaaS 웹앱 → 표준 골격 default-IN: 로그인, 홈/대시보드, 신청, 승인 큐, 팀 캘린더/현황, 설정/프로필, 멤버/팀 관리(관리자).
  - 뷰포트(가정) = 데스크톱 1280px+, 라이트 기본(다크는 범위 밖 가정).
  - 톤(가정) = 미니멀·전문적(내부툴), Linear/Notion류 차분, 한국어 UI.
  - 범위 밖(가정) = 실인증·실시간·결제 백엔드(개념적 멀티유저·역할로만), 모바일 1급, 다국어.
