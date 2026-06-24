#!/usr/bin/env node
// 프로젝트별 Playwright 실행기 — 증빙을 projects/<name>/ 안에 남긴다.
//
//   node scripts/test-project.js <project> [추가 playwright 인자...]
//
// 예) node scripts/test-project.js family-todo projects/family-todo/wire.spec.js
//     node scripts/test-project.js family-todo            ← projects/family-todo 전체
//
// 리포트 열기:  npx playwright show-report projects/<project>/playwright-report
const { spawnSync } = require('child_process');

const project = process.argv[2];
if (!project || project.startsWith('-')) {
  console.error('사용법: node scripts/test-project.js <project> [playwright 인자...]');
  console.error('예)    node scripts/test-project.js family-todo projects/family-todo/wire.spec.js');
  process.exit(1);
}

// 추가 인자가 없으면 그 프로젝트 폴더 전체를 대상으로.
const rest = process.argv.slice(3);
const args = rest.length ? rest : [`projects/${project}`];

const res = spawnSync('npx', ['playwright', 'test', ...args], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, ATELIER_PROJECT: project }, // ← config가 이 값으로 출력 경로를 라우팅
});

if (res.status === 0) {
  console.log(`\n증빙: projects/${project}/playwright-report  ·  열기: npx playwright show-report projects/${project}/playwright-report`);
}
process.exit(res.status == null ? 1 : res.status);
