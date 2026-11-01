import { expect, test } from '@playwright/test';
import { asReturningPlayer } from '../tools/accepted-disclaimer.js';
import { playUntil, startGame, weekHeading } from '../tools/play.js';

const SCREENS = [
  { name: 'small phone', width: 360, height: 640 },
  { name: 'phone on its side', width: 844, height: 390 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'tablet on its side', width: 1024, height: 768 },
  { name: 'laptop', width: 1280, height: 720 },
  { name: 'desktop', width: 1920, height: 1080 },
] as const;

test.describe('every screen size is a real layout (FEAT-033)', () => {
  // The test sets the size: one project is enough.
  test.beforeEach(({ page: _ }, info) => {
    test.skip(info.project.name !== 'laptop');
  });

  for (const size of SCREENS) {
    test(`the game fits a ${size.name}`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await startGame(page);
      await expect(page.getByRole('status')).toBeVisible();
      await playUntil(page, weekHeading(page));

      const width = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(width).toBeLessThanOrEqual(size.width);

      // Whatever does not fit scrolls inside its panel: nothing is ever out of reach.
      const actions = page.getByRole('button', { name: /Nghỉ ngơi|Làm task|Lưu giấy tờ/ });
      for (const action of await actions.all()) {
        await action.scrollIntoViewIfNeeded();
        const box = await action.boundingBox();
        expect(box?.y).toBeGreaterThanOrEqual(0);
        expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(size.height);
      }
      await page.getByRole('button', { name: /Nghỉ ngơi/ }).click();
      await expect(page.getByRole('heading', { name: 'Tuần này còn 2 lượt' })).toBeVisible();
    });

    test(`the menu fits a ${size.name}`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await asReturningPlayer(page);
      await page.goto('/');
      await expect(page.getByRole('button', { name: 'Game mới' })).toBeVisible();
      const box = await page.getByRole('link', { name: 'Về game' }).boundingBox();
      expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(size.width);
    });
  }
});

test.describe('the art is part of the game', () => {
  test('every picture the screens ask for exists', async ({ page }) => {
    const missing: string[] = [];
    page.on('response', (response) => {
      if (response.url().includes('/art/') && !response.ok()) {
        missing.push(response.url());
      }
    });
    await startGame(page);
    await playUntil(page, weekHeading(page));
    expect(missing).toEqual([]);
  });
});
