// team-leave — 토큰 대비비 WCAG AA 게이트(4단계). 색 입히기 전 토큰 확정 즉시 검사.
const path = require('path');
const { test, expect } = require('@playwright/test');
const { defineTokenContrastTest } = require('../../scripts/lib/a11y');

const cssPath = path.join(__dirname, 'foundation/tokens.css');

// 기본 쌍(text/surface, muted/bg, on-primary/primary 등) + 프로젝트 상태색/종류색 쌍.
const pairs = [
  { fg: '--color-text', bg: '--color-surface' },
  { fg: '--color-text', bg: '--color-bg' },
  { fg: '--color-text-muted', bg: '--color-surface', large: true },
  { fg: '--color-text-muted', bg: '--color-bg', large: true },
  { fg: '--color-text-subtle', bg: '--color-surface', large: true },
  { fg: '--color-on-primary', bg: '--color-primary' },
  { fg: '--color-primary', bg: '--color-bg', large: true },
  { fg: '--color-primary', bg: '--color-surface', large: true },
  // 상태 태그(색+텍스트) — 진한 텍스트색 on 옅은 상태 배경
  { fg: '--color-success', bg: '--color-success-bg' },
  { fg: '--color-warning', bg: '--color-warning-bg' },
  { fg: '--color-danger', bg: '--color-danger-bg' },
  { fg: '--color-info', bg: '--color-info-bg' },
  // 휴가 종류 색 바(캘린더) — 텍스트 on 옅은 배경
  { fg: '--type-annual-fg', bg: '--type-annual-bg' },
  { fg: '--type-half-fg', bg: '--type-half-bg' },
  { fg: '--type-sick-fg', bg: '--type-sick-bg' },
  { fg: '--type-event-fg', bg: '--type-event-bg' },
];

defineTokenContrastTest(test, expect, { cssPath, pairs, minEvaluated: pairs.length });
