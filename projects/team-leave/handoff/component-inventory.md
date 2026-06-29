# team-leave — 컴포넌트 인벤토리

> atelier가 정의한 공통 컴포넌트와 variant/state, 그리고 **각 컴포넌트가 쓰이는 화면**. 받는 쪽은 이 목록을 자기 컴포넌트 시스템으로 구현한다.
> 원본: `projects/team-leave/components/*.html` (모든 variant/state 나열) · semantic 토큰만 사용.

## buttons.html — 버튼
- **variant**: primary(CTA·승인), secondary(취소·상세), ghost(보조 액션·모두 읽음), danger(반려·휴가 취소).
- **size**: 기본, sm.
- **state**: default, hover, focus-visible(2px ring), disabled(opacity).
- **쓰이는 화면**: 전 화면. primary→login(로그인)·home([+휴가 신청])·request(제출)·approvals(빈 큐 CTA) / danger→approvals(반려)·requests(취소) / ghost·secondary→테이블 행 액션.

## tags.html — 상태·종류 태그
- **신청 상태(s-*)**: 대기(warning), 승인(success), 반려(danger), 취소(중립). 색+텍스트+점(색맹 안전).
- **휴가 종류(t-*)**: 연차·반차·병가·경조사. 옅은 배경 + 진한 텍스트 + 라벨.
- **flag**: 부여 미설정(danger 강조).
- **쓰이는 화면**: approvals(테이블 상태·종류)·requests(상태)·calendar(종류 색 바·범례)·balance(종류)·notifications(종류)·members(미설정 플래그)·home(상태 요약).

## forms.html — 폼 필드
- **종류**: text/date input, select, textarea, 세그먼트 토글(반차 오전/오후, aria-pressed), 커스텀 라디오(휴가 종류 칩).
- **state**: default, focus(primary ring), error(danger 테두리+메시지), hint.
- **검증 패턴**: blur 시 에러, 입력 즉시 성공/계산 피드백(reward early, punish late).
- **쓰이는 화면**: request(신청 폼·실시간 잔액 미리보기)·members(시드 편집 모달)·login(이메일/비밀번호).

## data-table.html — 데이터 테이블
- **구성**: sticky 아닌 헤더(surface-alt), 행 hover(surface-alt), 행 선택(primary-soft + 좌측 인디케이터), 숫자 우측정렬(tabular-nums), 행 액션 버튼.
- **state**: 정상, 빈 상태(다음 행동 CTA — 막다른 길 0).
- **쓰이는 화면**: approvals(승인 큐 8열)·requests(내 신청)·members(직원 목록).

## cards.html — 카드 / 스탯
- **종류**: stat 카드(메트릭 display 숫자 + 분해값 + 진행 바 + CTA), 요약 스트립 카드, 소진 상태 카드.
- **쓰이는 화면**: home(대시보드 위젯)·balance(잔여 카드)·approvals(상단 요약 스트립).

## modal.html — 모달 / 드로어
- **종류**: 중앙 모달(반려 사유 — 필수 입력, 제출 게이트), 우측 슬라이드인 드로어(승인 큐 충돌 미리보기), 오버레이+백드롭.
- **state**: 닫힘(visibility:hidden·transform), 열림, 제출 비활성/활성.
- **쓰이는 화면**: approvals(반려 사유 모달·충돌 드로어)·members(시드 편집·배정 모달).

---

## 공통 셸 (컴포넌트는 아니나 전 화면 공유)
- **좌측 사이드 내비**(240px, 디밍 chrome, aria-current="page" 활성 항목, 섹션 그룹) — login 제외 전 화면.
- **상단바**(페이지 타이틀 + 역할 전환 셀렉터 + 알림 뱃지 + 프로필) — login 제외 전 화면.
- **토스트**(승인/반려/취소 등 상태 변화 피드백) — approvals·requests 등.
