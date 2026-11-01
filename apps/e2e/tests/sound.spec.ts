import { disclaimer } from '@cstar/content';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { asReturningPlayer } from '../tools/accepted-disclaimer.js';
import { playUntil, submitApplication, weekHeading } from '../tools/play.js';

/** Listens to what really reaches the speakers: the page's context is given a tap on its output. */
const tapTheOutput = () => {
  class TappedContext extends AudioContext {
    private readonly tap = this.createAnalyser();

    constructor() {
      super();
      this.tap.fftSize = 2048;
      this.tap.connect(super.destination);
      const samples = new Float32Array(this.tap.fftSize);
      (window as unknown as Listening).cstarLevels = () => {
        this.tap.getFloatTimeDomainData(samples);
        return Math.max(...samples.map(Math.abs));
      };
    }

    override get destination() {
      return this.tap as unknown as AudioDestinationNode;
    }
  }
  window.AudioContext = TappedContext;
};

interface Listening {
  cstarLevels?: () => number;
}

const loudest = (page: Page, seconds: number) =>
  page.evaluate(async (limit) => {
    let peak = 0;
    const end = performance.now() + limit * 1000;
    while (performance.now() < end) {
      peak = Math.max(peak, (window as unknown as Listening).cstarLevels?.() ?? 0);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    return peak;
  }, seconds);

const withSound = async (page: Page, volume: number) => {
  await page.addInitScript(tapTheOutput);
  await asReturningPlayer(page);
  await page.addInitScript((level) => {
    const settings = {
      textSize: 'normal',
      textSpeed: 'normal',
      volume: level,
      ambience: false,
      music: true,
      typing: true,
      graphics: '2d',
    };
    localStorage.setItem('cstar.settings', JSON.stringify(settings));
  }, volume);
  await page.goto('/');
};

test('music plays after the first tap, loud enough and without clipping (SCENARIO-088)', async ({
  page,
}) => {
  await withSound(page, 0.7);
  await page.getByRole('button', { name: 'Game mới' }).click();
  const peak = await loudest(page, 4);
  expect(peak).toBeGreaterThan(0.01);
  expect(peak).toBeLessThan(1);
});

test('nothing plays before a gesture (SCENARIO-088)', async ({ page }) => {
  await withSound(page, 0.7);
  expect(await page.evaluate(() => 'cstarLevels' in window)).toBe(false);
});

test('at no volume there is no sound at all', async ({ page }) => {
  await withSound(page, 0);
  await page.getByRole('button', { name: 'Game mới' }).click();
  expect(await loudest(page, 1.5)).toBeLessThan(0.0005);
});

test('every recording loads, and the game plays on with sound on (SCENARIO-087)', async ({
  page,
}) => {
  const failed: string[] = [];
  page.on('response', (response) => {
    if (response.url().includes('/audio/') && !response.ok()) {
      failed.push(response.url());
    }
  });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await withSound(page, 0.7);
  await page.getByRole('button', { name: 'Game mới' }).click();
  await page.getByRole('button', { name: disclaimer.confirmLabel }).click();
  await submitApplication(page, 'Hoa');
  // The first line types itself out, with its ticks. The rest are skipped through.
  await expect(page.getByRole('button', { name: 'Đọc tiếp' })).toBeVisible({ timeout: 15_000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await playUntil(page, weekHeading(page));
  await page.getByRole('button', { name: /Nghỉ ngơi/ }).click();
  await expect(page.getByRole('heading', { name: 'Tuần này còn 2 lượt' })).toBeVisible();
  expect(failed).toEqual([]);
  expect(errors).toEqual([]);
});
