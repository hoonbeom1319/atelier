// collab-kanban — C-4 게이트: 토큰 대비비 WCAG AA (라이트 + 다크 양 모드).
// a11y.js의 resolveTokens는 파일 내 마지막 정의를 채택하므로(다크가 라이트를 덮음),
// 모드별로 CSS를 분리해 *양쪽 다* 검사한다 — 한 모드만 보고 green 되는 구멍 방지.
//   실행: node scripts/test-project.js collab-kanban projects/collab-kanban/tokens.spec.js
const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');
const { resolveTokens, parseColor, contrast, DEFAULT_PAIRS } = require('../../scripts/lib/a11y');

const CSS = fs.readFileSync(path.join(__dirname, 'foundation', 'tokens.css'), 'utf8');
const darkBlockRe = /:root\[data-theme="dark"\]\s*\{[\s\S]*?\}/;
const lightCss = CSS.replace(darkBlockRe, '');   // 다크 제거 → semantic = 라이트
const darkCss = CSS;                             // 다크가 마지막 → semantic = 다크

function checkMode(css) {
  const tokens = resolveTokens(css);
  const fails = [];
  let evaluated = 0;
  for (const p of DEFAULT_PAIRS) {
    const fg = parseColor(tokens[p.fg]);
    const bg = parseColor(tokens[p.bg]);
    if (!fg || !bg) continue;
    evaluated++;
    const ratio = contrast(fg, bg);
    const min = p.large ? 3.0 : 4.5;
    if (ratio < min) fails.push(`${p.fg} on ${p.bg}: ${ratio.toFixed(2)} < ${min}`);
  }
  return { fails, evaluated };
}

for (const [mode, css] of [['light', lightCss], ['dark', darkCss]]) {
  test(`자동 a11y: 토큰 대비비 WCAG AA — ${mode} 모드`, () => {
    const { fails, evaluated } = checkMode(css);
    expect(evaluated, `${mode}: 검사된 쌍이 부족 — semantic 토큰명 확인`).toBeGreaterThanOrEqual(4);
    expect(fails, `${mode} 대비 미달: ${fails.join(' / ')}`).toEqual([]);
  });
}
