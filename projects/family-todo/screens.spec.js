// family-todo 하이파이(chosen final) 인터랙션 검증 — 6단계 자동(2층).
// wire.spec.js의 2층 기능 spec을 그대로 이식. 차이: S3가 별도 페이지 → 바텀시트(URL 불변, 시트 노출).
// 셀렉터는 role/aria/텍스트 중심(+ 계약 클래스 .item/.skel/#offline/#date) → 동작 회귀 가드.
const { test, expect } = require('@playwright/test');
const { pathToFileURL } = require('url');
const path = require('path');
const fs = require('fs');

const DIR = path.join(__dirname, 'screens');
const url = (f) => pathToFileURL(path.join(DIR, f)).href;

test.use({ viewport: { width: 390, height: 844 } });
// 매 테스트 깨끗한 시드: localStorage 초기화 → list.html이 데모 시드 재생성
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { try { localStorage.clear(); } catch (e) {} });
});

// ───────────────────────── 1층: 내비게이션 · 도달성 ─────────────────────────

test('1층: 하이파이 화면 존재 + 링크 대상 존재(막다른 링크 0)', async () => {
  for (const f of ['index.html', 'list.html', 'app.css']) {
    expect(fs.existsSync(path.join(DIR, f)), `${f} 존재`).toBeTruthy();
  }
  for (const f of ['index.html', 'list.html']) {
    const html = fs.readFileSync(path.join(DIR, f), 'utf8');
    const hrefs = [...html.matchAll(/href="([^"#]+\.html)[^"]*"/g)].map((m) => m[1]);
    for (const h of hrefs) {
      expect(fs.existsSync(path.join(DIR, h)), `${f} → ${h} 링크 대상 존재`).toBeTruthy();
    }
  }
});

test('1층: S1 → S2 → 항목 탭(시트) → 닫기 (핵심 경로)', async ({ page }) => {
  await page.goto(url('index.html'));
  await page.getByLabel(/새 PIN|PIN/).fill('1234');
  await page.getByRole('button', { name: /입장|시작/ }).click();
  await page.waitForURL(/list\.html/);
  await expect(page.getByText('우리집')).toBeVisible();

  await page.getByText('기저귀 주문하기').click();              // 항목 탭 → 시트
  await expect(page.getByText('할 일 편집')).toBeVisible();      // 시트 열림(URL 불변)
  await page.locator('#scrim').click();                          // 스크림 → 닫기
  await expect(page.getByText('할 일 편집')).toBeHidden();
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
  await page.addInitScript(() => localStorage.setItem('ft_pin', '1234'));
  await page.goto(url('index.html'));
  await page.getByLabel(/PIN/).fill('9999');
  await page.getByRole('button', { name: /입장/ }).click();
  await expect(page.getByText(/틀려요/)).toBeVisible();
  await expect(page).toHaveURL(/index\.html/);
  await page.getByLabel(/PIN/).fill('1234');
  await page.getByRole('button', { name: /입장/ }).click();
  await expect(page).toHaveURL(/list\.html/);
});

test('2층 S2: 빠른 추가 → 항목 +1 (상태 변함)', async ({ page }) => {
  await page.goto(url('list.html'));
  await expect(page.getByText(/진행 중 2 · 완료됨 1/)).toBeVisible();
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
  await expect(page.getByText(/진행 중 1 · 완료됨 2/)).toBeVisible();
  await page.getByRole('button', { name: /완료됨/ }).click();
  const doneCb = page.locator('.item', { hasText: '기저귀 주문하기' }).getByRole('checkbox');
  await expect(doneCb).toHaveAttribute('aria-checked', 'true');
});

test('2층 S2: 완료 항목 체크 해제 → 진행 중 복귀', async ({ page }) => {
  await page.goto(url('list.html'));
  await page.getByRole('button', { name: /완료됨/ }).click();
  const row = page.locator('.item', { hasText: '분리수거 내놓기' });
  await row.getByRole('checkbox').click();
  await expect(page.getByText(/진행 중 3 · 완료됨 0/)).toBeVisible();
});

test('2층 S2: 완료됨 기본 접힘 → 펼치기 → 완료 비우기(정리)', async ({ page }) => {
  await page.goto(url('list.html'));
  await expect(page.getByText('분리수거 내놓기')).toHaveCount(0);
  await page.getByRole('button', { name: /완료됨/ }).click();
  await expect(page.getByText('분리수거 내놓기')).toBeVisible();
  await page.getByRole('button', { name: '완료 비우기' }).click();
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

test('2층 S3(시트): 항목 편집에서 날짜 붙이기 → 목록에 날짜 배지', async ({ page }) => {
  await page.goto(url('list.html'));
  await page.getByText('기저귀 주문하기').click();             // 날짜 없는 항목 → 시트
  await expect(page.getByText('할 일 편집')).toBeVisible();
  const ta = page.getByPlaceholder('무엇을 할까요?');
  await ta.fill('');
  await expect(page.getByRole('button', { name: '저장' })).toBeDisabled();  // 빈 내용 → 저장 막힘
  await ta.fill('기저귀 주문하기');
  const toggle = page.getByRole('button', { name: '날짜 추가' });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#date').fill('2026-07-01');
  await page.getByRole('button', { name: '저장' }).click();
  await expect(page.getByText('할 일 편집')).toBeHidden();      // 시트 닫힘
  const row = page.locator('.item', { hasText: '기저귀 주문하기' });
  await expect(row.getByText('2026-07-01')).toBeVisible();      // 날짜형 공존
});

test('2층 S3(시트): 기존 항목 편집 → 목록 반영', async ({ page }) => {
  await page.goto(url('list.html'));
  await page.getByText('기저귀 주문하기').click();
  await expect(page.getByText('할 일 편집')).toBeVisible();
  const ta = page.getByPlaceholder('무엇을 할까요?');
  await ta.fill('기저귀·물티슈 주문');
  await page.getByRole('button', { name: '저장' }).click();
  await expect(page.getByText('할 일 편집')).toBeHidden();
  await expect(page.getByText('기저귀·물티슈 주문')).toBeVisible();
});
