// family-todo 와이어 검증 — 00-flow.md §플로우 + §구성요소·상태 + §인터랙션 모델에서 파생.
// 셀렉터는 role/aria/텍스트 (클래스·구조 X) → 같은 spec이 6단계 hi-fi에도 이식된다.
const { test, expect } = require('@playwright/test');
const { pathToFileURL } = require('url');
const path = require('path');
const fs = require('fs');

const WIRE = path.join(__dirname, 'wireframe');
const url = (f) => pathToFileURL(path.join(WIRE, f)).href;

test.use({ viewport: { width: 390, height: 800 } }); // 모바일 (00-flow 대상 뷰포트)

// ───────────────────────── 1층: 내비게이션 · 도달성 ─────────────────────────

test('1층: 와이어 3화면이 모두 존재(막다른 링크 0)', async () => {
  for (const f of ['index.html', 'list.html', 'edit.html']) {
    expect(fs.existsSync(path.join(WIRE, f)), `${f} 존재`).toBeTruthy();
  }
  // 각 화면의 <a href> 타깃(같은 폴더 상대 .html)이 실제 파일로 존재하는지
  for (const f of ['index.html', 'list.html', 'edit.html']) {
    const html = fs.readFileSync(path.join(WIRE, f), 'utf8');
    const hrefs = [...html.matchAll(/href="([^"#]+\.html)[^"]*"/g)].map((m) => m[1]);
    for (const h of hrefs) {
      expect(fs.existsSync(path.join(WIRE, h)), `${f} → ${h} 링크 대상 존재`).toBeTruthy();
    }
  }
});

test('1층: S1 → S2 → S3 → S2 도달 (핵심 경로)', async ({ page }) => {
  await page.goto(url('index.html'));                 // S1 (최초 = PIN 설정)
  await page.getByLabel(/새 PIN|PIN/).fill('1234');
  await page.getByRole('button', { name: /입장|시작/ }).click();
  await page.waitForURL(/list\.html/);                // → S2
  await expect(page.getByText('우리집')).toBeVisible();

  await page.getByText('기저귀 주문하기').click();      // 항목 탭 → S3 (편집)
  await page.waitForURL(/edit\.html\?id=/);            // → S3
  await expect(page.getByText('할 일 편집')).toBeVisible();

  await page.getByRole('link', { name: '취소' }).click();
  await page.waitForURL(/list\.html/);                // → S2 복귀
});

// ───────────────────────── 2층: 기능 완결성 ─────────────────────────

test('2층 S1: 최초 PIN 설정 → 입장', async ({ page }) => {
  await page.goto(url('index.html'));
  await expect(page.locator('#sub')).toHaveText(/새로 정해/);
  await page.getByLabel(/새 PIN|PIN/).fill('4321');
  await page.getByRole('button', { name: /시작|입장/ }).click();
  await expect(page).toHaveURL(/list\.html/);
});

test('2층 S1: 틀린 PIN → 에러 분기, 올바른 PIN → 입장', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ft_pin', '1234')); // 입력 모드로 만들기
  await page.goto(url('index.html'));
  await page.getByLabel(/PIN/).fill('9999');
  await page.getByRole('button', { name: /입장/ }).click();
  await expect(page.getByText(/틀려요/)).toBeVisible();          // 분기: 에러
  await expect(page).toHaveURL(/index\.html/);                  // 같은 화면 재시도
  await page.getByLabel(/PIN/).fill('1234');
  await page.getByRole('button', { name: /입장/ }).click();
  await expect(page).toHaveURL(/list\.html/);                   // 분기: 입장
});

test('2층 S2: 빠른 추가 → 항목 +1 (상태 변함)', async ({ page }) => {
  await page.goto(url('list.html'));
  await expect(page.getByText(/진행 중 2 · 완료됨 1/)).toBeVisible(); // 시드
  await page.getByLabel('할 일 빠른 추가').fill('어린이집 준비물');
  await page.getByRole('button', { name: '추가' }).click();
  await expect(page.getByText('어린이집 준비물')).toBeVisible();
  await expect(page.getByText(/진행 중 3 · 완료됨 1/)).toBeVisible();
});

test('2층 S2: 체크 → 완료됨으로 이동 (카운터 + 접힌 흔적에 보존)', async ({ page }) => {
  await page.goto(url('list.html'));
  const cb = page.locator('.item', { hasText: '기저귀 주문하기' }).getByRole('checkbox');
  await expect(cb).toHaveAttribute('aria-checked', 'false');
  await cb.click();
  await expect(page.getByText(/진행 중 1 · 완료됨 2/)).toBeVisible();   // 완료로 이동 (접힘 → 시야에서 사라짐)
  await page.getByRole('button', { name: /완료됨/ }).click();           // 흔적 펼치기
  const doneCb = page.locator('.item', { hasText: '기저귀 주문하기' }).getByRole('checkbox');
  await expect(doneCb).toHaveAttribute('aria-checked', 'true');         // 흔적에 보존(토글 뒤집힘)
});

test('2층 S2: 완료 항목 체크 해제 → 진행 중 복귀', async ({ page }) => {
  await page.goto(url('list.html'));
  await page.getByRole('button', { name: /완료됨/ }).click();           // 접힌 완료됨 펼치기
  const row = page.locator('.item', { hasText: '분리수거 내놓기' });    // 시드 완료 항목
  await row.getByRole('checkbox').click();
  await expect(page.getByText(/진행 중 3 · 완료됨 0/)).toBeVisible();
});

test('2층 S2: 완료됨 기본 접힘 → 펼치기 → 완료 비우기(정리)', async ({ page }) => {
  await page.goto(url('list.html'));
  await expect(page.getByText('분리수거 내놓기')).toHaveCount(0);       // 기본 접힘(시야에 없음)
  await page.getByRole('button', { name: /완료됨/ }).click();           // 펼치기
  await expect(page.getByText('분리수거 내놓기')).toBeVisible();
  await page.getByRole('button', { name: '완료 비우기' }).click();      // 흔적 정리
  await expect(page.getByText(/진행 중 2 · 완료됨 0/)).toBeVisible();
});

test('2층 S2: 삭제 → 목록에서 제거 (수 −1)', async ({ page }) => {
  await page.goto(url('list.html'));
  const row = page.locator('.item', { hasText: '관리비 납부' });
  await row.getByRole('button', { name: '삭제' }).click();
  await expect(page.getByText('관리비 납부')).toHaveCount(0);
  await expect(page.getByText(/진행 중 1 · 완료됨 1/)).toBeVisible();
});

test('2층 S2: 빈 상태 도달 (따뜻한 카피)', async ({ page }) => {
  await page.goto(url('list.html'));
  await page.getByRole('button', { name: /전체비우기/ }).click();
  await expect(page.getByText(/아직 우리집 할 일이 없어요/)).toBeVisible();
});

test('2층 S2: 상태 — 로딩/오프라인 표현 존재', async ({ page }) => {
  await page.goto(url('list.html'));
  await page.getByRole('button', { name: '로딩' }).click();
  await expect(page.locator('.skel')).toBeVisible();
  await page.getByRole('button', { name: '오프라인' }).click();
  await expect(page.locator('#offline')).toBeVisible();
  await expect(page.locator('#offline')).toContainText(/연결되면 자동으로/);
});

test('2층 S3: 항목 편집에서 날짜 붙이기 → 목록에 날짜 배지', async ({ page }) => {
  await page.goto(url('list.html'));                  // 시드
  await page.getByText('기저귀 주문하기').click();      // 날짜 없는 항목 → 편집
  await page.waitForURL(/edit\.html\?id=/);
  const ta = page.getByPlaceholder('무엇을 할까요?');
  await ta.fill('');                                  // 내용 비우면
  await expect(page.getByRole('button', { name: '저장' })).toBeDisabled(); // 저장 막힘(검증)
  await ta.fill('기저귀 주문하기');
  const toggle = page.getByRole('button', { name: '날짜 추가' });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');     // 날짜 옵션 on
  await page.locator('#date').fill('2026-07-01');
  await page.getByRole('button', { name: '저장' }).click();
  await page.waitForURL(/list\.html/);
  const row = page.locator('.item', { hasText: '기저귀 주문하기' });
  await expect(row.getByText('2026-07-01')).toBeVisible();          // 날짜형 공존
});

test('2층 S3: 기존 항목 편집 → 목록 반영', async ({ page }) => {
  await page.goto(url('list.html'));                  // 시드 보장
  await page.getByText('기저귀 주문하기').click();      // 탭 → 편집
  await page.waitForURL(/edit\.html\?id=/);
  await expect(page.getByText('할 일 편집')).toBeVisible();
  const ta = page.getByPlaceholder('무엇을 할까요?');
  await ta.fill('기저귀·물티슈 주문');
  await page.getByRole('button', { name: '저장' }).click();
  await page.waitForURL(/list\.html/);
  await expect(page.getByText('기저귀·물티슈 주문')).toBeVisible();
});
