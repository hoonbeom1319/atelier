// 재사용 골격 ④ — 자동 시각 a11y: 토큰 대비비(contrast) 검사.
//
// 대비·포커스 가시성은 그동안 100% 사람 몫이었지만, 토큰 수준 대비비는 자동이 싸고 정확하게 잡는다.
// 특히 4단계(토큰 확정)와 6단계(리디자인 후) — 색을 갈아엎을 때 대비 회귀가 제일 잘 난다.
//
// tokens.css의 semantic 쌍(텍스트색 on 배경색)을 파싱·해석해 WCAG 대비비를 계산한다.
// 순수 Node — 외부 의존성 없음(산출물 금지 규칙과 무관하게, 검증 코드라 어차피 써도 되지만 안 쓴다).
//
//   const { checkTokenContrast, defineTokenContrastTest } = require('../../scripts/lib/a11y');
const fs = require('fs');

// --- 색 파싱: #rgb · #rrggbb · #rrggbbaa · rgb()/rgba(). hsl 등은 미지원(null → 검사 건너뜀).
function parseColor(v) {
  if (!v) return null;
  v = v.trim();
  let m = v.match(/^#([0-9a-f]{3,8})$/i);
  if (m) {
    let h = m[1];
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    if (h.length === 4) h = h.split('').map((c) => c + c).join('');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  m = v.match(/^rgba?\(([^)]+)\)$/i);
  if (m) {
    const p = m[1].split(/[,\s/]+/).filter(Boolean).slice(0, 3).map(Number);
    if (p.length === 3 && p.every((n) => !Number.isNaN(n))) return p;
  }
  return null;
}

// tokens.css에서 `--name: value;`를 모으고, var(--x) 체인을 색 리터럴까지 해석한다.
function resolveTokens(css) {
  const raw = {};
  for (const m of css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) raw[m[1]] = m[2].trim();
  const cache = {};
  function resolve(name, seen = new Set()) {
    if (name in cache) return cache[name];
    if (seen.has(name) || !(name in raw)) return null;
    seen.add(name);
    let val = raw[name];
    const vm = val.match(/var\(\s*(--[\w-]+)\s*(?:,\s*([^)]+))?\)/);
    if (vm) {
      const r = resolve(vm[1], seen);
      val = r != null ? r : (vm[2] ? vm[2].trim() : null);
    }
    return (cache[name] = val);
  }
  const out = {};
  for (const k of Object.keys(raw)) out[k] = resolve(k);
  return out;
}

// 상대 휘도 → WCAG 대비비.
function luminance([r, g, b]) {
  const a = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
function contrast(c1, c2) {
  const L1 = luminance(c1), L2 = luminance(c2);
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

// 검사할 전경/배경 semantic 쌍. 토큰이 없으면 조용히 건너뛴다(프로젝트마다 토큰명이 다를 수 있어 관대하게).
// large=true는 큰 글씨(18.66px bold / 24px+)라 AA 기준이 3.0.
const DEFAULT_PAIRS = [
  { fg: '--color-text', bg: '--color-bg' },
  { fg: '--color-text', bg: '--color-surface' },
  { fg: '--color-text-muted', bg: '--color-bg', large: true },
  { fg: '--color-text-muted', bg: '--color-surface', large: true },
  { fg: '--color-on-primary', bg: '--color-primary' },
  { fg: '--color-primary', bg: '--color-bg', large: true },
];

// cssPath의 토큰으로 각 쌍의 대비비를 계산. AA(일반 4.5 / 큰글씨 3.0) 통과 여부.
function checkTokenContrast({ cssPath, pairs = DEFAULT_PAIRS }) {
  const tokens = resolveTokens(fs.readFileSync(cssPath, 'utf8'));
  const results = [];
  for (const p of pairs) {
    const fg = parseColor(tokens[p.fg]);
    const bg = parseColor(tokens[p.bg]);
    if (!fg || !bg) { results.push({ ...p, skipped: true, reason: !tokens[p.fg] ? `${p.fg} 없음` : !tokens[p.bg] ? `${p.bg} 없음` : '색 해석 실패' }); continue; }
    const ratio = contrast(fg, bg);
    const min = p.large ? 3.0 : 4.5;
    results.push({ ...p, ratio: Math.round(ratio * 100) / 100, min, pass: ratio >= min });
  }
  return results;
}

// 보일러플레이트 없이 토큰 대비 검사를 건다.
//   defineTokenContrastTest(test, expect, { cssPath: path.join(__dirname, 'foundation/tokens.css') });
function defineTokenContrastTest(test, expect, opts) {
  test(`자동 a11y: 토큰 대비비 WCAG AA`, () => {
    const results = checkTokenContrast(opts);
    const failed = results.filter((r) => r.pass === false)
      .map((r) => `${r.fg} on ${r.bg}: ${r.ratio} < ${r.min}`);
    expect(failed, `대비 미달(WCAG AA): ${failed.join(' / ')}`).toEqual([]);
  });
}

// (선택) 렌더된 화면의 a11y(포커스 가시성·실제 대비·역할 누락)는 axe-core로.
// @axe-core/playwright가 설치돼 있을 때만 동작 — 없으면 안내만 하고 통과 처리.
//   defineAxeTest(test, expect, { url: url('list.html'), name: 'S2' });
function defineAxeTest(test, expect, { url, name = '' }) {
  test(`자동 a11y(axe): ${name || url}`, async ({ page }) => {
    let AxeBuilder;
    try { AxeBuilder = require('@axe-core/playwright').default; }
    catch { test.skip(true, '@axe-core/playwright 미설치 — `npm i -D @axe-core/playwright` 후 사용'); return; }
    await page.goto(url);
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa']).analyze();
    const serious = violations.filter((v) => ['serious', 'critical'].includes(v.impact));
    expect(serious.map((v) => v.id), `axe 위반(serious+): ${serious.map((v) => v.id).join(', ')}`).toEqual([]);
  });
}

module.exports = { checkTokenContrast, defineTokenContrastTest, defineAxeTest, contrast, resolveTokens, parseColor, DEFAULT_PAIRS };
