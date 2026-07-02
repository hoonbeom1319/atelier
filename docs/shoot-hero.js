#!/usr/bin/env node
// README 히어로 배너 렌더러 — docs/hero.html → docs/hero.png (1600×840 @2x)
'use strict';

const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1600, height: 840 },
    deviceScaleFactor: 2,
  });
  await page.goto(pathToFileURL(path.join(__dirname, 'hero.html')).href);
  await page.waitForTimeout(300); // 폰트 렌더 안정화
  await page.screenshot({ path: path.join(__dirname, 'hero.png') });
  await browser.close();
  console.log('✔ docs/hero.png');
})();
