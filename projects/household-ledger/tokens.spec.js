// household-ledger — 토큰 대비비 a11y 게이트 (4단계). 색 확정 즉시 검사.
const { test, expect } = require('@playwright/test');
const path = require('path');
const { defineTokenContrastTest } = require('../../scripts/lib/a11y');

defineTokenContrastTest(test, expect, {
  cssPath: path.join(__dirname, 'foundation', 'tokens.css'),
});
