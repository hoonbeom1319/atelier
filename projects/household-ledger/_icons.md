# 공유 아이콘 세트 (리디자인용) — 단색 라인 픽토그램

토스/N26 톤: 멀티컬러 이모지 대신 `stroke="currentColor"` 라인 아이콘. 모두 `viewBox="0 0 24 24"`, `fill="none"`, `stroke-width="1.8"`, `stroke-linecap="round"`, `stroke-linejoin="round"`. 크기는 부모에서 width/height로(예: 20px·24px). `currentColor`라 텍스트색을 상속 → 카테고리 타일/행은 글자색, 하단탭은 활성=primary·비활성=muted.

사용법: 이모지를 지우고 해당 `<svg>`를 인라인. 카테고리 타일·행 아이콘은 `.ico` 컨테이너 안에, 하단탭은 라벨 위에. 접근성: 장식 아이콘은 `aria-hidden="true"`, 옆 텍스트가 의미 전달.

## 카테고리
- 식비 `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3v7a2 2 0 0 0 4 0V3M8 10v11"/><path d="M16 3c-1.5 0-2.5 1.8-2.5 4.5S15 12 16 12s2.5-1.8 2.5-4.5S17.5 3 16 3zM16 12v9"/></svg>`
- 카페 `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h12v5a5 5 0 0 1-10 0z"/><path d="M16 9h2.5a2.5 2.5 0 0 1 0 5H16"/><path d="M6 3v2M10 3v2M14 3v2"/></svg>`
- 교통 `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="3" width="12" height="14" rx="3"/><path d="M6 11h12"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/><path d="M8 21l1.5-2M16 21l-1.5-2"/></svg>`
- 주거 `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11l8-6 8 6"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/></svg>`
- 통신 `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/></svg>`
- 생활 `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9z"/></svg>`
- 쇼핑 `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8h12l-1 12H7z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>`
- 건강 `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 4.6-7 9-7 9z"/></svg>`
- 문화 `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M10 9l5 3-5 3z"/></svg>`
- 구독 `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 0 1 13.7-5.6L20 8"/><path d="M20 4v4h-4"/><path d="M20 12a8 8 0 0 1-13.7 5.6L4 16"/><path d="M4 20v-4h4"/></svg>`
- 모임 `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="9" width="16" height="5" rx="1"/><path d="M5 14v6h14v-6"/><path d="M12 9v11"/><path d="M12 9C9 9 7 7.5 7 6s2-2 3 0 2 3 2 3zM12 9c3 0 5-1.5 5-3s-2-2-3 0-2 3-2 3z"/></svg>`
- 교육 `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 6L3 9l9 3 9-3z"/><path d="M7 11v4c0 1.5 2.5 3 5 3s5-1.5 5-3v-4"/></svg>`
- 기타 `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18" cy="12" r="1.4"/></svg>`
- 수입/월급(지갑) `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18"/><circle cx="16.5" cy="14" r="1.2"/></svg>`

## 하단탭
- 홈 `<svg class="t" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11l8-6 8 6"/><path d="M6 10v9h12v-9"/></svg>`
- 내역 `<svg class="t" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>`
- 통계 `<svg class="t" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M12 3v6.5"/></svg>`
- 반복 `<svg class="t" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h11l-2-2M19 16H8l2 2"/></svg>`

## 배지·기타
- 반복배지(작게) `<svg class="b" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h11l-2-2M19 16H8l2 2"/></svg>`
- FAB 플러스 `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`

## stats 도넛 카테고리 색 (hue 분리 — 채도 절제, 6슬라이스)
범례 색칩과 도넛 슬라이스가 1:1 매칭되도록 아래를 인라인 변수로 정의해 쓰라(토큰엔 제품 전용이라 넣지 않고 stats 컴포넌트 안에):
```
--cat-1:#1b64da; /* 주거 - 블루(primary 계열) */
--cat-2:#12b886; /* 식비 - 틸 */
--cat-3:#f59f00; /* 교통 - 앰버 */
--cat-4:#7048e8; /* 쇼핑 - 바이올렛 */
--cat-5:#868e96; /* 기타 - 회색 */
```
채도는 절제하되 hue는 분리(색만으로 구분 금지 규칙은 아이콘·라벨·% 병행으로 충족, 단 도넛은 색 구분이 가능해야 함).
