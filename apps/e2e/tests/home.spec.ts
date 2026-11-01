import { expect, test } from '@playwright/test';
import { asReturningPlayer } from '../tools/accepted-disclaimer.js';

test('the static build opens without an error or a sideways scroll', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await asReturningPlayer(page);

  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Công ty C*' })).toBeVisible();
  await expect(page.getByText('Tác phẩm hư cấu')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'vi');

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
  expect(errors).toEqual([]);
});
