const { defineConfig, devices } = require('@playwright/test');

// 작업장 공용 Playwright 설정.
// 각 프로젝트의 흐름/인터랙션 스펙은 projects/<name>/*.spec.js 로 둔다.
// 와이어는 file:// 상대 <a href> 로 동작하므로 webServer 불필요.
module.exports = defineConfig({
  testDir: './projects',
  testMatch: '**/*.spec.js',
  fullyParallel: true,

  // 증빙을 남긴다 — "무엇을 테스트했나 / pass·fail / 화면 모습"이 사람에게 보여야 한다.
  // list = 터미널 요약, html = 브라우저로 보는 리포트(테스트별 pass/fail + 스크린샷 첨부).
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    screenshot: 'on',          // 모든 테스트 끝에 스크린샷 1장 (green이어도 화면을 눈으로 확인)
    trace: 'on',               // 클릭·상태 변화 step-by-step 재생 (무엇을 검증했는지 가장 정확한 증빙)
    video: 'off',
  },

  // 산출물 위치: 리포트는 playwright-report/, 스크린샷·트레이스는 test-results/ (둘 다 루트).
  outputDir: './test-results',

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
