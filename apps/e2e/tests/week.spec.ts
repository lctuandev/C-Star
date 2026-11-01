import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { doTask, playUntil, startGame, weekHeading } from '../tools/play.js';

const rest = (page: Page) => page.getByRole('button', { name: /Nghỉ ngơi/ }).click();
const slipTitle = (page: Page, month: number) =>
  page.getByRole('heading', { name: `PHIẾU LƯƠNG THÁNG ${month}` });

test('a week of actions (SCENARIO-024)', async ({ page }) => {
  await startGame(page);
  await playUntil(page, weekHeading(page));

  await expect(page.getByText('Tháng 1 · Tuần 1')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Tuần này còn 3 lượt' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Nhận việc ngoài/ })).toBeHidden();

  await rest(page);
  await expect(page.getByRole('heading', { name: 'Tuần này còn 2 lượt' })).toBeVisible();
  await expect(page.getByRole('status')).not.toBeEmpty();
  await rest(page);
  await rest(page);
  await expect(page.getByText('Tháng 1 · Tuần 2')).toBeVisible();
});

test('payday writes the slip and the company’s debt (SCENARIO-026, 029)', async ({ page }) => {
  await startGame(page);

  for (const month of [1, 2]) {
    for (let action = 0; action < 12; action += 1) {
      await playUntil(page, weekHeading(page));
      await rest(page);
    }
    await playUntil(page, slipTitle(page, month));
    await expect(page.getByText('Tiền nhà')).toBeVisible();
    if (month === 2) {
      await expect(page.getByText('15.000.000 đ').nth(1)).toBeVisible();
      await page.getByRole('button', { name: 'Cố gắng thông cảm' }).click();
    } else {
      await page.getByRole('button', { name: 'Nhận lương' }).click();
    }
  }

  await expect(page.getByText('15 tr')).toBeVisible();
});

test('the week and the slip fit a small phone', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await startGame(page);
  await playUntil(page, weekHeading(page));

  const overflow = () =>
    page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
  expect(await overflow()).toBe(0);

  for (let action = 0; action < 12; action += 1) {
    await playUntil(page, weekHeading(page));
    await rest(page);
  }
  await playUntil(page, slipTitle(page, 1));
  await expect(page.getByRole('button', { name: 'Nhận lương' })).toBeVisible();
  expect(await overflow()).toBe(0);
});

test('the HUD shows the moods moving (SCENARIO-028)', async ({ page }) => {
  await startGame(page);
  await playUntil(page, weekHeading(page));
  const energy = page.getByRole('meter', { name: 'Sức' });
  await expect(energy).toHaveAttribute('aria-valuenow', '80');
  await doTask(page);
  await expect(energy).toHaveAttribute('aria-valuenow', '65');
});
