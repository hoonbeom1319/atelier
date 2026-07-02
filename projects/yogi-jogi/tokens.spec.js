// 요기조기 — 토큰 대비비 게이트 (4단계: 토큰 확정 즉시 WCAG AA).
const { test, expect } = require('@playwright/test');
const path = require('path');
const { defineTokenContrastTest } = require('../../scripts/lib/a11y');

const CSS = path.join(__dirname, 'foundation', 'tokens.css');

// 표준 쌍 + 요기조기 보조 텍스트/secondary 쌍.
defineTokenContrastTest(test, expect, {
  cssPath: CSS,
  pairs: [
    { fg: '--color-text', bg: '--color-bg' },
    { fg: '--color-text', bg: '--color-surface' },
    { fg: '--color-text-secondary', bg: '--color-bg' },
    { fg: '--color-text-secondary', bg: '--color-surface' },
    { fg: '--color-text-muted', bg: '--color-bg', large: true },
    { fg: '--color-text-muted', bg: '--color-surface', large: true },
    { fg: '--color-on-primary', bg: '--color-primary' },
    { fg: '--color-primary', bg: '--color-bg', large: true },
    { fg: '--color-on-danger', bg: '--color-danger' },
  ],
  minEvaluated: 8,
});
