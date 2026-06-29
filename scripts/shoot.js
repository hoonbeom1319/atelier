#!/usr/bin/env node
// hi-fi 렌더 스크린샷 — design-verifier·design-trend-expert가 *소스가 아니라 픽셀*을 보게 한다.
//
//   node scripts/shoot.js <project> <relDir> [WxH]
//   예: node scripts/shoot.js collab-kanban screens 1280x900
//
// 배경(design 고도화 D1): 검증·트렌드 에이전트는 지금까지 HTML *소스*만 읽어 "와이어풍"을
// 놓쳤다(픽셀맹). 이 스크립트가 각 화면을 헤드리스 크로미움으로 *실제 렌더*해 PNG로 떨군다.
// 그 PNG를 에이전트의 Read(이미지 인식)로 넘기면 비로소 렌더된 픽셀을 보고 판정할 수 있다.
//
// projects/<project>/<relDir>/*.html 을 렌더 → projects/<project>/_shots/<relDir>/<name>.png.
// 찍은 PNG의 repo-상대 경로를 한 줄에 하나씩 출력(에이전트가 파싱).  _shots/ 는 .gitignore 대상.
const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

async function main() {
  const project = process.argv[2];
  const relDir = process.argv[3];
  const vp = process.argv[4] || '1280x900';
  if (!project || !relDir || project.startsWith('-')) {
    console.error('사용법: node scripts/shoot.js <project> <relDir> [WxH]');
    process.exit(1);
  }
  const ROOT = path.resolve(__dirname, '..');
  const srcDir = path.join(ROOT, 'projects', project, relDir);
  if (!fs.existsSync(srcDir)) { console.error(`폴더 없음: ${srcDir}`); process.exit(1); }

  const [pw, ph] = vp.split(/[x×*]/i).map((n) => parseInt(n, 10));
  const width = pw > 0 ? pw : 1280;
  const height = ph > 0 ? ph : 900;

  const files = fs.readdirSync(srcDir).filter((f) => f.endsWith('.html'));
  if (!files.length) { console.error(`html 없음: ${srcDir}`); process.exit(1); }

  const outDir = path.join(ROOT, 'projects', project, '_shots', relDir);
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  for (const f of files) {
    const fileUrl = 'file://' + path.join(srcDir, f).replace(/\\/g, '/');
    try {
      await page.goto(fileUrl, { waitUntil: 'load', timeout: 15000 });
    } catch (e) {
      // load 타임아웃(인라인 타이머 등)에도 일단 현재 상태를 찍는다.
    }
    await page.waitForTimeout(400); // 폰트·전환 정착
    const out = path.join(outDir, f.replace(/\.html$/i, '.png'));
    await page.screenshot({ path: out, fullPage: true });
    console.log(path.relative(ROOT, out).replace(/\\/g, '/'));
  }
  await browser.close();
}
main().catch((e) => { console.error(e && e.message ? e.message : e); process.exit(1); });
