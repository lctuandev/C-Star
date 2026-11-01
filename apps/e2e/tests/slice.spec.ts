import { expect, test } from '@playwright/test';
import { playUntil, startGame, weekHeading } from '../tools/play.js';

/** The game so far, as a player gets it, from the offer to the end of the content. */
test('the whole slice plays through (SCENARIO-035, 036)', async ({ page }) => {
  test.setTimeout(240_000);
  await startGame(page);

  const end = page.getByRole('heading', { name: /Coming Soon/ });
  const closeSlip = page.getByRole('button', { name: /Nhận lương|Cố gắng thông cảm/ });

  await expect
    .poll(
      async () => {
        await playUntil(page, weekHeading(page).or(closeSlip).or(end));
        if (await end.isVisible()) {
          return true;
        }
        if (await closeSlip.isVisible()) {
          await closeSlip.click();
        } else {
          await page.getByRole('button', { name: /Nghỉ ngơi/ }).click();
        }
        return false;
      },
      { timeout: 230_000, intervals: [10] },
    )
    .toBe(true);

  await expect(page.getByText('40,5 tr')).toBeVisible();
});

test('the first day has three seats (SCENARIO-035)', async ({ page }) => {
  await startGame(page);
  const seat = page.getByRole('button', { name: /Ngồi cạnh Uyên/ });
  await playUntil(page, seat);
  await seat.click();
  await expect(page.getByRole('status')).toContainText('Uyên');
});
