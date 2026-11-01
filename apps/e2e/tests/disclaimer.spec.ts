import { disclaimer } from '@cstar/content';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { asReturningPlayer } from '../tools/accepted-disclaimer.js';

const KEY = 'cstar.disclaimer-accepted-version';
const text = (page: Page) => page.getByText(disclaimer.body);
const confirm = (page: Page) => page.getByRole('button', { name: disclaimer.confirmLabel });
const menu = (page: Page) => page.getByRole('button', { name: 'Game mới' });

test('a first visit stops at the disclaimer (SCENARIO-006)', async ({ page }) => {
  await page.goto('/');
  await expect(text(page)).toBeVisible();
  await expect(menu(page)).toBeHidden();

  await confirm(page).click();
  await expect(menu(page)).toBeVisible();
  await expect(text(page)).toBeHidden();
});

test('a returning player goes straight to the menu (SCENARIO-007)', async ({ page }) => {
  await page.goto('/');
  await confirm(page).click();
  await page.reload();
  await expect(menu(page)).toBeVisible();
  await expect(text(page)).toBeHidden();
  await expect(page.getByText(disclaimer.reminder)).toBeVisible();
});

test('a new game asks again, then starts (SCENARIO-008)', async ({ page }) => {
  await asReturningPlayer(page);
  await page.goto('/');
  await menu(page).click();
  await expect(text(page)).toBeVisible();
  await confirm(page).click();
  await expect(page).toHaveURL(/\/play$/);
  await expect(text(page)).toBeHidden();
});

test('a direct link cannot go around it (SCENARIO-009)', async ({ page }) => {
  await page.goto('/play');
  await expect(text(page)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Văn phòng đang được dọn dẹp' })).toBeHidden();

  await page.reload();
  await expect(text(page)).toBeVisible();

  await confirm(page).click();
  await expect(page.getByRole('heading', { name: 'Văn phòng đang được dọn dẹp' })).toBeVisible();
});

test('a changed text is asked again (SCENARIO-010)', async ({ page }) => {
  await page.addInitScript(
    ([key, version]) => localStorage.setItem(key!, version!),
    [KEY, String(disclaimer.version - 1)],
  );
  await page.goto('/');
  await expect(text(page)).toBeVisible();
});

test('a browser that blocks storage still gets in (SCENARIO-011)', async ({ page }) => {
  await page.addInitScript(() => {
    const blocked = () => {
      throw new DOMException('blocked', 'SecurityError');
    };
    Storage.prototype.getItem = blocked;
    Storage.prototype.setItem = blocked;
  });
  await page.goto('/');
  await confirm(page).click();
  await expect(menu(page)).toBeVisible();

  await page.reload();
  await expect(text(page)).toBeVisible();
});

test('the full text stays one tap away', async ({ page }) => {
  await asReturningPlayer(page);
  await page.goto('/');
  await page.getByRole('link', { name: 'Về game' }).click();
  await expect(text(page)).toBeVisible();
  await page.getByRole('link', { name: 'Quay lại' }).click();
  await expect(menu(page)).toBeVisible();
});

test('it fits a small phone', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto('/');
  await expect(confirm(page)).toBeInViewport();
  const box = await confirm(page).boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});
