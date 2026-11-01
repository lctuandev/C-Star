import { disclaimer } from '@cstar/content';
import { expect, test } from '@playwright/test';
import { playUntil, startGame, weekHeading } from '../tools/play.js';

/** The whole game as a player gets it: from the offer to the end, and around again. */
test('a whole run, doing nothing, ends in the loop (SCENARIO-047, 048)', async ({ page }, info) => {
  test.skip(info.project.name !== 'phone-portrait', 'One full run is enough.');
  test.setTimeout(300_000);
  await startGame(page);

  const end = page.getByRole('heading', { name: 'CONGRATULATIONS!' });
  const closeSlip = page.getByRole('button', { name: /Nhận lương|Cố gắng thông cảm/ });

  await expect
    .poll(
      async () => {
        await playUntil(page, weekHeading(page).or(closeSlip).or(end), 'last');
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
      { timeout: 280_000, intervals: [10] },
    )
    .toBe(true);

  await expect(page.getByText('The Empty Promise')).toBeVisible();
  await expect(page.getByText(disclaimer.reminder)).toBeVisible();

  await page.getByRole('button', { name: 'Tiếp tục cống hiến' }).click();
  await expect(page.getByRole('status')).toContainText('tự động gia hạn');
  await expect(page.getByText('Tháng 1 · Tuần 1')).toBeVisible();

  await page.getByRole('link', { name: 'Menu' }).click();
  await page.getByRole('link', { name: 'Các kết thúc' }).click();
  await expect(page.getByRole('heading', { name: 'Đã mở 1/6' })).toBeVisible();
  await expect(page.getByText('The Empty Promise')).toBeVisible();
  await expect(page.getByText('The Good Ending')).toBeHidden();
});

test('the first day has three seats (SCENARIO-035)', async ({ page }) => {
  await startGame(page);
  const seat = page.getByRole('button', { name: /Ngồi cạnh Uyên/ });
  await playUntil(page, seat);
  await seat.click();
  await expect(page.getByRole('status')).toContainText('Uyên');
});
