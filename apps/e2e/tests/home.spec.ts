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

test('keeps the promises of the policy: no cookies, nothing fetched elsewhere', async ({
  page,
  context,
  baseURL,
}) => {
  const elsewhere: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.protocol.startsWith('http') && url.origin !== new URL(baseURL ?? '').origin) {
      elsewhere.push(request.url());
    }
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.goto('/policy');
  await page.waitForLoadState('networkidle');
  expect(elsewhere).toEqual([]);
  expect(await context.cookies()).toEqual([]);
});

test('the coffee fits a small phone, and the QR can be scanned', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await asReturningPlayer(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Mời tác giả ly cà phê' }).click();
  const qr = page.getByRole('img', { name: /VietQR/ });
  await qr.scrollIntoViewIfNeeded();
  await expect(qr).toBeVisible();
  await expect
    .poll(() => qr.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);
  await expect(page.getByRole('button', { name: 'Đóng' })).toBeInViewport();
});
