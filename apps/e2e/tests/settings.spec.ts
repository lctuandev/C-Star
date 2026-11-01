import { expect, test } from '@playwright/test';
import { asReturningPlayer } from '../tools/accepted-disclaimer.js';

test('large text reaches the game and stays (SCENARIO-051)', async ({ page }) => {
  await asReturningPlayer(page);
  await page.goto('/');
  await page.getByRole('link', { name: 'Cài đặt' }).click();
  await page.getByText('Lớn', { exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-text-size', 'large');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-text-size', 'large');

  const size = await page.evaluate(() =>
    Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
  );
  expect(size).toBeGreaterThan(16);
});

test('large text keeps a small phone free of a sideways scroll', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await asReturningPlayer(page);
  await page.goto('/settings');
  await page.getByText('Lớn', { exact: true }).click();
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Game mới' })).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

test('the sound never throws, before or after a gesture (SCENARIO-050)', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await asReturningPlayer(page);
  await page.goto('/');
  await page.getByRole('link', { name: 'Cài đặt' }).click();
  await page.getByRole('slider').fill('30');
  await page.getByRole('checkbox', { name: 'Tiếng văn phòng' }).click();
  await page.getByRole('checkbox', { name: 'Tiếng văn phòng' }).click();
  expect(errors).toEqual([]);
});
