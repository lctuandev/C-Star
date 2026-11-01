import { expect, test } from '@playwright/test';
import { playUntil, startGame, weekHeading } from '../tools/play.js';

// Software WebGL, so the office renders in a headless browser.
test.use({
  launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] },
});

test.describe('with WebGL', () => {
  test('the office draws behind the scene, and the game still works (SCENARIO-052)', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await startGame(page, '3d');

    await expect(page.getByTestId('office-3d').locator('canvas')).toBeVisible();
    await playUntil(page, weekHeading(page));
    await page.getByRole('button', { name: /Nghỉ ngơi/ }).click();
    await expect(page.getByRole('heading', { name: 'Tuần này còn 2 lượt' })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('tapping a place walks there and does the action (SCENARIO-053)', async ({ page }) => {
    await startGame(page, '3d');
    await playUntil(page, weekHeading(page));

    const sofa = page.getByRole('button', { name: 'Ghế nghỉ' });
    await expect(sofa).toBeVisible();
    await sofa.click();
    await expect(page.getByRole('heading', { name: 'Tuần này còn 2 lượt' })).toBeVisible();
    await expect(page.getByRole('status')).not.toBeEmpty();
  });

  test('losing the graphics context never strands the player (SCENARIO-054)', async ({ page }) => {
    await startGame(page, '3d');
    await playUntil(page, weekHeading(page));
    await expect(page.getByTestId('office-3d').locator('canvas')).toBeVisible();

    await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      canvas?.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext();
    });

    await expect(page.getByTestId('office-3d')).toBeHidden();
    await page.getByRole('button', { name: /Nghỉ ngơi/ }).click();
    await expect(page.getByRole('heading', { name: 'Tuần này còn 2 lượt' })).toBeVisible();
  });

  test('keeps to one graphics context (regression)', async ({ page }) => {
    const warnings: string[] = [];
    page.on('console', (message) => {
      if (message.text().includes('Too many active WebGL contexts')) {
        warnings.push(message.text());
      }
    });
    await startGame(page, '3d');
    await playUntil(page, weekHeading(page));
    expect(warnings).toEqual([]);
  });

  test('a locked place cannot be walked to (SCENARIO-053)', async ({ page }) => {
    await startGame(page, '3d');
    await playUntil(page, weekHeading(page));
    await expect(page.getByRole('button', { name: 'Tủ hồ sơ' })).toBeDisabled();
  });

  test('it can be turned off (SCENARIO-054)', async ({ page }) => {
    await startGame(page, '3d');
    await expect(page.getByTestId('office-3d').locator('canvas')).toBeVisible();

    await page.getByRole('link', { name: 'Menu' }).click();
    await page.getByRole('link', { name: 'Cài đặt' }).click();
    await page.getByText('2D', { exact: true }).click();
    await expect(page.getByRole('radio', { name: '2D' })).toBeChecked();
    await page.getByRole('link', { name: 'Quay lại' }).click();
    await page.getByRole('button', { name: 'Tiếp tục' }).click();
    await expect(page.getByRole('status')).toBeVisible();
    await expect(page.getByTestId('office-3d')).toBeHidden();
  });
});

test('without WebGL the game simply has no office (SCENARIO-054)', async ({ page }) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  await startGame(page, '3d');
  await expect(page.getByRole('status')).toContainText('Thứ Hai');
  await expect(page.getByTestId('office-3d')).toBeHidden();
  await playUntil(page, weekHeading(page));
});
