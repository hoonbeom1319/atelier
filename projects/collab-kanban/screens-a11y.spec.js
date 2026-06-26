// collab-kanban — 6단계 렌더 a11y 회귀: axe로 실제 렌더(라이트+다크)의 대비·역할·포커스 검사.
// 토큰 값 대비(tokens.spec.js)와 별개로, 색을 입힌 *실제 화면*의 회귀를 잡는다.
//   실행: node scripts/test-project.js collab-kanban projects/collab-kanban/screens-a11y.spec.js
const path = require('path');
const { test, expect } = require('@playwright/test');
const { fileUrl } = require('../../scripts/lib/selectors');

// chosen 폴더(screens 또는 screens-bold)는 환경변수로 전환(메인 게이트가 STATUS의 (chosen)을 보고 넘긴다). 기본 screens.
const DIRNAME = process.env.CK_DIR || 'screens';
const url = fileUrl(path.join(__dirname, DIRNAME));

async function axeSerious(page) {
  let AxeBuilder;
  try { AxeBuilder = require('@axe-core/playwright').default; }
  catch { test.skip(true, '@axe-core/playwright 미설치'); return []; }
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  return violations.filter((v) => ['serious', 'critical'].includes(v.impact));
}

for (const screen of ['index.html', 'board.html']) {
  test(`axe(라이트): ${screen}`, async ({ page }) => {
    await page.goto(url(screen));
    await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
    await page.reload();
    const s = await axeSerious(page);
    expect(s.map((v) => v.id), `axe 위반(serious+): ${s.map((v) => v.id).join(', ')}`).toEqual([]);
  });

  test(`axe(다크): ${screen}`, async ({ page }) => {
    await page.goto(url(screen));
    await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
    await page.reload();
    await page.getByRole('button', { name: '테마 전환' }).click(); // light → dark
    await expect(page.getByRole('button', { name: '테마 전환' })).toHaveAttribute('aria-pressed', 'true');
    const s = await axeSerious(page);
    expect(s.map((v) => v.id), `axe 위반(serious+, 다크): ${s.map((v) => v.id).join(', ')}`).toEqual([]);
  });
}
