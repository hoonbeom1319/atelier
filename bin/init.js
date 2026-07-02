#!/usr/bin/env node
// @hb-kit/atelier 스캐폴더 — 작업장 골격을 대상 폴더에 깐다.
// 사용법: npx @hb-kit/atelier init [dir]   (dir 생략 시 현재 폴더)
'use strict';

const fs = require('fs');
const path = require('path');

const PKG_ROOT = path.join(__dirname, '..');

// npm 패키지에 담겨 함께 배포되는 템플릿 엔트리(= package.json "files"와 한 몸)
const TEMPLATE_ENTRIES = [
  '.claude/skills',
  '.claude/agents',
  '.claude/workflows',
  '.claude/settings.json',
  'CLAUDE.md',
  'GETTING-STARTED.md',
  'README.md',
  'scripts',
  'playwright.config.js',
];

// npm이 .gitignore를 패키지에서 항상 제외하므로 내용을 여기 들고 있다가 생성한다
const GITIGNORE = 'node_modules\n\npackage-lock.json\n\ntest-results\nplaywright-report\n';

function usage() {
  console.log('사용법: npx @hb-kit/atelier init [dir]');
  console.log('  dir 생략 시 현재 폴더에 작업장 골격을 깝니다.');
}

const argv = process.argv.slice(2);
if (argv.includes('--help') || argv.includes('-h')) {
  usage();
  process.exit(0);
}
const positional = argv.filter((a) => !a.startsWith('-'));
if (positional[0] !== 'init') {
  usage();
  process.exit(1);
}
positional.shift();
const targetArg = positional[0] || '.';
const dest = path.resolve(process.cwd(), targetArg);

fs.mkdirSync(dest, { recursive: true });

const copied = [];
const skipped = [];
for (const entry of TEMPLATE_ENTRIES) {
  const src = path.join(PKG_ROOT, entry);
  const out = path.join(dest, entry);
  if (!fs.existsSync(src)) {
    console.warn(`⚠ 패키지에 없음(건너뜀): ${entry}`);
    continue;
  }
  if (fs.existsSync(out)) {
    skipped.push(entry);
    continue;
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.cpSync(src, out, { recursive: true });
  copied.push(entry);
}

// 작업장 자체의 package.json — 이 패키지 것(@hb-kit/atelier)을 복사하면 안 되고 새로 만든다
const pkgPath = path.join(dest, 'package.json');
if (fs.existsSync(pkgPath)) {
  skipped.push('package.json');
} else {
  const self = JSON.parse(fs.readFileSync(path.join(PKG_ROOT, 'package.json'), 'utf8'));
  const name = path.basename(dest).toLowerCase().replace(/[^a-z0-9._-]+/g, '-') || 'atelier';
  const workspacePkg = {
    name,
    version: '0.0.0',
    private: true,
    description:
      '아틀리에 작업장 — 아이디어를 받아 PRD부터 개발에 넘길 디자인까지 (@hb-kit/atelier로 스캐폴드됨)',
    scripts: {
      'test:project': 'node scripts/test-project.js',
      'lint:prd': 'node scripts/lint-prd.js',
      'lint:prd-review': 'node scripts/lint-prd-review.js',
      'lint:verify': 'node scripts/lint-verify.js',
      'lint:handoff': 'node scripts/lint-handoff.js',
    },
    devDependencies: self.devDependencies,
  };
  fs.writeFileSync(pkgPath, JSON.stringify(workspacePkg, null, 2) + '\n');
  copied.push('package.json');
}

const giPath = path.join(dest, '.gitignore');
if (fs.existsSync(giPath)) {
  skipped.push('.gitignore');
} else {
  fs.writeFileSync(giPath, GITIGNORE);
  copied.push('.gitignore');
}

fs.mkdirSync(path.join(dest, 'projects'), { recursive: true });

const rel = path.relative(process.cwd(), dest) || '.';
console.log(`\n@hb-kit/atelier → ${rel}`);
for (const e of copied) console.log(`  ✔ ${e}`);
for (const e of skipped) console.log(`  ↷ ${e} (이미 있음 — 건너뜀)`);
console.log('\n다음 단계:');
if (rel !== '.') console.log(`  cd ${rel}`);
console.log('  npm install                       # Playwright 등 의존성');
console.log('  npx playwright install chromium   # 검증용 브라우저 (1회)');
console.log('  claude                            # Claude Code 실행 후 /forge 또는 /plan');
