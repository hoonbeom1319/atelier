// spotlog — 6단계 렌더 a11y: axe로 실제 렌더(다크 단일)의 대비·역할·포커스 검사.
// 토큰 값 대비(tokens.spec.js)와 별개로, 색을 입힌 *실제 화면*의 회귀를 잡는다.
//   실행: node scripts/test-project.js spotlog projects/spotlog/screens-a11y.spec.js
const path = require('path');
const { test, expect } = require('@playwright/test');
const { fileUrl } = require('../../scripts/lib/selectors');

const url = fileUrl(path.join(__dirname, 'screens'));
const SCREENS = [
  'index.html', 'upload-select.html', 'upload-group.html', 'map-pin.html',
  'upload-publish.html', 'card-detail.html', 'explore.html', 'profile.html',
];

async function axeSerious(page) {
  let AxeBuilder;
  try { AxeBuilder = require('@axe-core/playwright').default; }
  catch { test.skip(true, '@axe-core/playwright 미설치'); return []; }
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  return violations.filter((v) => ['serious', 'critical'].includes(v.impact));
}

for (const screen of SCREENS) {
  test(`axe(다크): ${screen}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 840 });
    await page.goto(url(screen));
    const s = await axeSerious(page);
    expect(s.map((v) => v.id), `axe 위반(serious+): ${s.map((v) => `${v.id}(${v.nodes.length})`).join(', ')}`).toEqual([]);
  });
}
