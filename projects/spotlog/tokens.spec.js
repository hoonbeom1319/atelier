// spotlog — 4단계 토큰 대비비(WCAG AA) 자동 게이트. 색을 입히기 전 토큰 값 차원에서 본다.
//   실행: node scripts/test-project.js spotlog projects/spotlog/tokens.spec.js
const path = require('path');
const { test, expect } = require('@playwright/test');
const { defineTokenContrastTest } = require('../../scripts/lib/a11y');

// 다크 단일 — semantic 표준 쌍(text/bg, text/surface, muted, on-primary/primary, primary/bg)을 검사.
defineTokenContrastTest(test, expect, {
  cssPath: path.join(__dirname, 'foundation', 'tokens.css'),
});
