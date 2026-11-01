import { disclaimer } from '@cstar/content';
import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { asReturningPlayer } from './accepted-disclaimer.js';

/**
 * From the menu into a new run, with text shown at once. In 2D unless a spec is about the office:
 * software WebGL would slow everything else down by minutes.
 */
export const startGame = async (page: Page, graphics: '2d' | '3d' = '2d', name = '') => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await asReturningPlayer(page);
  await page.addInitScript((value) => {
    const settings = { textSize: 'normal', textSpeed: 'normal', volume: 0, ambience: false };
    localStorage.setItem('cstar.settings', JSON.stringify({ ...settings, graphics: value }));
  }, graphics);
  await page.goto('/');
  await page.getByRole('button', { name: 'Game mới' }).click();
  await page.getByRole('button', { name: disclaimer.confirmLabel }).click();
  await submitApplication(page, name);
  await expect(page).toHaveURL(/\/play$/);
};

/** The form between the disclaimer and the first scene. */
export const submitApplication = async (page: Page, name = '') => {
  await page.getByLabel('Tên của bạn').fill(name);
  await page.getByRole('button', { name: 'Nộp hồ sơ' }).click();
};

/**
 * Reads through scenes until `target` shows, always taking the first choice open, or the last.
 * Never a choice to quit or to leave, which ends the run.
 */
export const playUntil = async (page: Page, target: Locator, pick: 'first' | 'last' = 'first') => {
  const box = page.getByRole('button', { name: 'Đọc tiếp' });
  const choices = page.getByRole('group', { name: 'Lựa chọn' }).getByRole('button');

  await expect
    .poll(
      async () => {
        if (await target.isVisible()) {
          return true;
        }
        if ((await choices.count()) > 0) {
          const open = choices
            .and(page.locator(':enabled'))
            .filter({ hasNotText: /Nghỉ việc|Rời đi ngay/ });
          await (pick === 'first' ? open.first() : open.last()).click();
        } else if (await box.isVisible()) {
          await box.click();
        }
        return false;
      },
      { timeout: 20_000, intervals: [10] },
    )
    .toBe(true);
};

/** The heading of the week screen. */
export const weekHeading = (page: Page) => page.getByRole('heading', { name: /Tuần này còn/ });

/** The desk task: "Làm cho có" skips the tickets. */
export const doTask = async (page: Page) => {
  await page.getByRole('button', { name: /Làm task/ }).click();
  await page.getByRole('button', { name: 'Làm cho có' }).click();
};
