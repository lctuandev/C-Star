import { disclaimer } from '@cstar/content';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { asReturningPlayer } from '../tools/accepted-disclaimer.js';
import { playUntil, startGame as playStartGame, submitApplication } from '../tools/play.js';

const startGame = async (page: Page) => {
  await asReturningPlayer(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Game mới' }).click();
  await page.getByRole('button', { name: disclaimer.confirmLabel }).click();
  await submitApplication(page);
  await expect(page).toHaveURL(/\/play$/);
};

/** One tap to show the line, one to move on. */
const readLine = async (page: Page) => {
  await page.getByRole('button', { name: 'Hiện hết câu' }).click();
  await page.getByRole('button', { name: 'Đọc tiếp' }).click();
};

test('reads a scene with one finger and takes a choice (SCENARIO-019, 020)', async ({ page }) => {
  await startGame(page);
  await expect(page.getByRole('status')).toContainText('Thứ Hai, 7 giờ 12 phút');

  await readLine(page);
  await readLine(page);
  await readLine(page);
  await page.getByRole('button', { name: 'Hiện hết câu' }).click();
  await page.getByRole('button', { name: 'Đọc hết hợp đồng trước đã' }).click();

  await expect(page.getByRole('status')).toContainText('Trang 14, cỡ chữ 6');
});

test('the history brings back what was skipped (SCENARIO-021)', async ({ page }) => {
  await startGame(page);
  await readLine(page);
  await page.getByRole('button', { name: 'Vừa rồi' }).click();
  await expect(page.getByRole('dialog').getByText(/Thứ Hai, 7 giờ 12 phút/)).toBeVisible();
  await page.getByRole('button', { name: 'Đóng' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('the keyboard plays the game on a laptop (SCENARIO-023)', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'laptop', 'A keyboard.');
  await startGame(page);
  await expect(page.getByRole('status')).toContainText('Thứ Hai');
  await page.keyboard.press('Space');
  await page.keyboard.press('Space');
  await expect(page.getByRole('status')).toContainText('còn đúng 9 triệu');
});

test('reads well on a small phone', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await startGame(page);
  await readLine(page);
  await readLine(page);
  await readLine(page);
  await page.getByRole('button', { name: 'Hiện hết câu' }).click();

  const choice = page.getByRole('button', { name: 'Đọc hết hợp đồng trước đã' });
  await expect(choice).toBeInViewport();
  expect((await choice.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  const fontSize = await page
    .getByRole('button', { name: 'Đọc tiếp' })
    .locator('span.invisible')
    .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
  expect(fontSize).toBeGreaterThanOrEqual(16);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

test('reduced motion shows the line at once (SCENARIO-022)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await startGame(page);
  await expect(page.getByRole('button', { name: 'Đọc tiếp' })).toBeVisible();
});

test('the name on the form is the name the story uses, after a reload too (SCENARIO-075)', async ({
  page,
}) => {
  await playStartGame(page, '2d', 'Hoa');
  await playUntil(page, page.getByRole('status').filter({ hasText: 'Chào mừng Hoa' }));
  await page.reload();
  await expect(page.getByRole('status')).toContainText('Chào mừng Hoa');
});

test('a stray link to the form leads back to the menu (SCENARIO-075)', async ({ page }) => {
  await asReturningPlayer(page);
  await page.goto('/apply');
  await expect(page.getByRole('button', { name: 'Game mới' })).toBeVisible();
});
