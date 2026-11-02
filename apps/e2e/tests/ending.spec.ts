import { world } from '@cstar/content';
import { beginRun } from '@cstar/game-core';
import type { GameState } from '@cstar/game-core';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { asReturningPlayer } from '../tools/accepted-disclaimer.js';
import { playUntil } from '../tools/play.js';

const SAVE_VERSION = 5;

/** Someone who left in month 4, at the one place an ending asks them something. */
const leaverAnswering = (): GameState => {
  const run = beginRun(7, world);
  return {
    ...run,
    phase: 'scene',
    calendar: { ...run.calendar, month: 4 },
    money: { ...run.money, companyDebt: 30_000_000 },
    story: {
      ...run.story,
      sceneId: 'ending-survivor',
      nodeId: 'huni-reply',
      seenScenes: ['ending-survivor'],
      flags: { quitEarly: true, runOver: true },
    },
  };
};

const loadSave = (page: Page, state: GameState) =>
  page.evaluate(
    ({ saveVersion, save }) =>
      new Promise<void>((resolve, reject) => {
        const open = indexedDB.open('cstar', 1);
        open.onupgradeneeded = () => open.result.createObjectStore('saves');
        open.onerror = () => reject(new Error('no database'));
        open.onsuccess = () => {
          const transaction = open.result.transaction('saves', 'readwrite');
          transaction
            .objectStore('saves')
            .put({ saveVersion, savedAt: '2026-11-02T00:00:00.000Z', state: save }, 'auto');
          transaction.oncomplete = () => {
            open.result.close();
            resolve();
          };
        };
      }),
    { saveVersion: SAVE_VERSION, save: state },
  );

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await asReturningPlayer(page);
  await page.addInitScript(() => {
    const settings = { textSize: 'normal', textSpeed: 'normal', volume: 0, ambience: false };
    localStorage.setItem('cstar.settings', JSON.stringify({ ...settings, graphics: '2d' }));
  });
  await page.goto('/');
  await loadSave(page, leaverAnswering());
  await page.goto('/play');
});

test('an ending can ask something, and still ends (SCENARIO-139)', async ({ page }) => {
  await page.getByRole('button', { name: /Nhắn lại/ }).click();
  await expect(page.getByRole('status')).toContainText('thả một dấu tim');
  await playUntil(page, page.getByText('Tổng đã nhận'));
});

test('the other answer ends it too (SCENARIO-139)', async ({ page }) => {
  await page.getByRole('button', { name: /Để đó/ }).click();
  await expect(page.getByRole('status')).toContainText('trạng thái đã xem');
  await playUntil(page, page.getByText('Tổng đã nhận'));
});

test('a reload at the question keeps it (SCENARIO-139)', async ({ page }) => {
  await expect(page.getByRole('button', { name: /Nhắn lại/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: /Nhắn lại/ })).toBeVisible();
});
