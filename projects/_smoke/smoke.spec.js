// 스모크 메타-테스트 — 산출물이 아니라 *검증 도구 자체*를 검증한다.
// "좋은 입력엔 green, 알려진 나쁜 입력엔 정확히 red"를 한 spec 안에서 확인 →
// 도구가 깨지면 이 spec이 빨개진다(도구가 멀쩡하면 전부 green).
const { test, expect } = require('@playwright/test');
const path = require('path');

const { checkReachability } = require('../../scripts/lib/crawl');
const { listInteractive, probeWired } = require('../../scripts/lib/controls');
const { checkTokenContrast } = require('../../scripts/lib/a11y');
const { fileUrl } = require('../../scripts/lib/selectors');

const WIRE = path.join(__dirname, 'wireframe');
const url = fileUrl(WIRE);

// ── crawl.js (1층): 도달성 + 막다른 길 + 고아 ───────────────────────────────
test('crawl: 범위 안 전부 도달 + orphan.html을 고아로 잡는다', () => {
  const r = checkReachability({
    dir: WIRE,
    screens: ['index.html', 'list.html', 'detail.html'], // 범위 안(고아 orphan.html 제외)
  });
  expect(r.missing, '막다른 길은 없어야').toEqual([]);
  expect(r.unreached, '범위 안은 전부 도달해야').toEqual([]);
  expect(r.orphans, 'orphan.html을 고아로 잡아야').toContain('orphan.html');
});

// ── controls.js (2층): 와이어드 판정 + 죽은 컨트롤 적발 + 범위 밖 면제 ──────────
test('controls: 와이어드는 wired, 죽은 버튼은 dead, 범위 밖은 면제', async ({ page }) => {
  const listUrl = url('list.html');
  await page.goto(listUrl);
  const controls = await listInteractive(page);
  const by = (label) => controls.find((c) => c.label.includes(label));

  // 범위 밖 면제 판정
  expect(by('결제'), '범위 밖 컨트롤이 열거돼야').toBeTruthy();
  expect(by('결제').outOfScope, '[범위 밖] 라벨은 면제돼야').toBe(true);

  // 와이어드 3종 + 죽은 1종을 격리 클릭으로 판정
  const verdict = {};
  for (const c of controls) {
    if (c.outOfScope) continue;
    verdict[c.label] = (await probeWired(page, listUrl, c.domIndex)).wired;
  }
  expect(verdict[by('알림 토글').label], '토글=aria 변화→wired').toBe(true);
  expect(verdict[by('담기').label], '카운터=dom 변화→wired').toBe(true);
  expect(verdict[by('상세 보기').label], '링크=nav→wired').toBe(true);
  expect(verdict[by('죽은 버튼').label], '죽은 버튼=변화없음→dead').toBe(false);
});

// ── a11y.js: 토큰 대비비 — 통과쌍은 pass, 미달쌍은 정확히 fail ────────────────
test('a11y: 고대비쌍 pass / 저대비쌍 fail 을 정확히 분류', () => {
  const results = checkTokenContrast({ cssPath: path.join(__dirname, 'foundation', 'tokens.css') });
  const find = (fg, bg) => results.find((r) => r.fg === fg && r.bg === bg);

  const good = find('--color-text', '--color-bg');         // #1a1a1a on #fafafa → 매우 높음
  expect(good && good.pass, 'text on bg는 통과해야').toBe(true);

  const bad = find('--color-text-muted', '--color-bg');    // #cccccc on #fafafa → 미달
  expect(bad && bad.pass, 'muted on bg(저대비)는 미달로 잡아야').toBe(false);
});
