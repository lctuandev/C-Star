import { expect, test } from '@playwright/test';
import { playUntil, startGame, weekHeading } from '../tools/play.js';

test('a round of tickets at the desk (SCENARIO-038)', async ({ page }) => {
  await startGame(page);
  await playUntil(page, weekHeading(page));
  await page.getByRole('button', { name: /Làm task/ }).click();

  for (let number = 1; number <= 4; number += 1) {
    await expect(page.getByText(`Ticket ${number}/4`, { exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'Làm ngay' }).click();
    await expect(page.getByRole('status')).toContainText('việc.');
  }
  await page.getByRole('button', { name: 'Xong việc' }).click();
  await expect(page.getByRole('heading', { name: 'Tuần này còn 2 lượt' })).toBeVisible();
});

test('a reload in the middle of the tickets keeps the round (SCENARIO-038)', async ({ page }) => {
  await startGame(page);
  await playUntil(page, weekHeading(page));
  await page.getByRole('button', { name: /Làm task/ }).click();
  await page.getByRole('button', { name: 'Sprint sau' }).click();
  await expect(page.getByText(/Ticket 2\/4/)).toBeVisible();
  await page.waitForTimeout(150);

  await page.reload();
  await expect(page.getByText(/Ticket 2\/4/)).toBeVisible();
});

test('the dossier shows papers and people (SCENARIO-037, 039)', async ({ page }) => {
  await startGame(page);
  const readContract = page.getByRole('button', { name: 'Đọc hết hợp đồng trước đã' });
  await playUntil(page, readContract);
  await readContract.click();
  await playUntil(page, weekHeading(page));

  await page.getByRole('button', { name: 'Hồ sơ' }).click();
  const sheet = page.getByRole('dialog', { name: 'Hồ sơ' });
  await expect(sheet.getByText('Hợp đồng lao động')).toBeVisible();
  await expect(sheet.getByText('Giấy tờ (1/5)')).toBeVisible();
  await sheet.getByRole('button', { name: 'Đóng' }).click();
  await expect(sheet).toBeHidden();
});

test('the tickets and the dossier fit a small phone', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await startGame(page);
  await playUntil(page, weekHeading(page));

  await page.getByRole('button', { name: 'Hồ sơ' }).click();
  await expect(page.getByRole('button', { name: 'Đóng' })).toBeVisible();
  await page.getByRole('button', { name: 'Đóng' }).click();

  await page.getByRole('button', { name: /Làm task/ }).click();
  await expect(page.getByRole('button', { name: 'Làm ngay' })).toBeInViewport();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});
