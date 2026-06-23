const { defineConfig, devices } = require('@playwright/test');

// 작업장 공용 Playwright 설정.
// 각 프로젝트의 흐름/인터랙션 스펙은 projects/<name>/*.spec.js 로 둔다.
// 와이어는 file:// 상대 <a href> 로 동작하므로 webServer 불필요.
module.exports = defineConfig({
  testDir: './projects',
  testMatch: '**/*.spec.js',
  fullyParallel: true,
  reporter: [['list']],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
