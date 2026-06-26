# _smoke — 진행 상태 (도구 검증용 더미)

현재 단계: 7-handoff

- [x] 1. 인테이크
- [x] 2. 와이어프레임
- [x] 3. 흐름·기능 검증
- [x] 4. 디자인 시스템
- [x] 5. 하이파이
- [ ] 5.5 리디자인 (선택 — 건너뜀)
- [x] 6. 인터랙션 검증
- [x] 7. handoff

후보 / chosen final:
- screens/ (원본) — (chosen)

메모: **영구 회귀 픽스처** — `scripts/lib/*`(crawl·controls·a11y·selectors)와 `lint-prd`/`lint-verify`/`lint-handoff`가
의도대로(좋은 입력 green / 나쁜 입력 red) 동작하는지 지킨다. `_` 접두사라 대시보드에서 제외됨.
도구를 건드린 뒤 검증: `node scripts/test-project.js _smoke projects/_smoke/smoke.spec.js` + `node scripts/lint-prd.js _smoke` + `node scripts/lint-verify.js _smoke` + `node scripts/lint-handoff.js _smoke`.
(`design-verify.md`는 lint-verify의 good 픽스처 — 별도 Agent가 render-check한 산출물 형태.)
