import { world } from '@cstar/content';
import { beginRun } from '@cstar/game-core';
import type { GameState } from '@cstar/game-core';
import { test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { asReturningPlayer } from '../tools/accepted-disclaimer.js';

/**
 * Not a test: screenshots of every place in the game, to judge the art with eyes. Lands straight on
 * a crafted save. Run with `pnpm --filter @cstar/e2e shots`, against any running server.
 */
const SHOTS_DIR = process.env.SHOTS_DIR ?? 'test-results/shots';
const LABEL = process.env.SHOTS_LABEL ?? 'shot';
const SAVE_VERSION = 5;

const firstScene = (place: string) => {
  const scene = Object.values(world.story.scenes).find((candidate) => candidate.place === place);
  if (!scene) {
    throw new Error(`No scene at ${place}`);
  }
  return scene.id;
};

const sceneAt = (place: string, month: number): GameState => {
  const run = beginRun(7, world);
  const sceneId = firstScene(place);
  return {
    ...run,
    phase: 'scene',
    calendar: { ...run.calendar, month },
    story: { ...run.story, sceneId, nodeId: world.story.scenes[sceneId]?.start ?? null },
  };
};

const spokenBy = (node: unknown) => (node as { speaker?: string }).speaker !== undefined;

/** The first line someone says at this place: the dialogue box with a portrait. */
const speechAt = (place: string, month: number): GameState => {
  const state = sceneAt(place, month);
  const scene = Object.values(world.story.scenes).find(
    (candidate) => candidate.place === place && Object.values(candidate.nodes).some(spokenBy),
  );
  const nodeId = Object.entries(scene?.nodes ?? {}).find(([, node]) => spokenBy(node))?.[0];
  return {
    ...state,
    story: { ...state.story, sceneId: scene?.id ?? null, nodeId: nodeId ?? null },
  };
};

const weekAt = (month: number): GameState => {
  const run = beginRun(7, world);
  return {
    ...run,
    phase: 'week',
    calendar: { ...run.calendar, month, actionsLeft: 3 },
    story: { ...run.story, sceneId: null, nodeId: null },
  };
};

const payslipAt = (month: number): GameState => {
  const run = weekAt(month);
  return {
    ...run,
    phase: 'payslip',
    payslip: {
      month,
      salaryDue: 15_000_000,
      salaryPaid: 0,
      bills: [
        { label: 'Tiền nhà', amount: 3_500_000 },
        { label: 'Ăn uống', amount: 2_500_000 },
      ],
      arrears: 0,
      cash: 3_000_000,
      loans: 0,
      companyDebt: 30_000_000,
      kpi: { points: 6, target: 8 },
    },
  };
};

/** A run seven months in, with a payroll worth reading. */
const settledAt = (month: number): GameState => ({
  ...weekAt(month),
  money: { cash: 1_200_000, arrears: 0, loans: 8_000_000, companyDebt: 62_500_000 },
  paidByMonth: { '1': 15_000_000, '3': 10_000_000, '5': 5_000_000, '7': 5_000_000 },
  outlook: { trust: 34, awareness: 58 },
  evidence: ['contract', 'demand-mail'],
  relations: { uyen: 30, dan: 15, khoa: 12, boss: -20 },
});

/** On the last line of an ending: the next tap lands on the summary, as it does when playing. */
const lastLineOf = (scene: string, nodeId: string): GameState => {
  const run = settledAt(8);
  return {
    ...run,
    phase: 'scene',
    story: {
      ...run.story,
      sceneId: scene,
      nodeId,
      seenScenes: [scene],
      flags: { choseLeave: true, runOver: true },
    },
  };
};

const SHOTS: readonly { name: string; state: GameState }[] = [
  { name: 'week-m1', state: weekAt(1) },
  { name: 'week-m3', state: weekAt(3) },
  { name: 'week-m4', state: weekAt(4) },
  { name: 'payslip', state: payslipAt(2) },
  { name: 'week-m8', state: weekAt(8) },
  { name: 'speech-office', state: speechAt('office', 1) },
  { name: 'speech-meeting', state: speechAt('meeting', 3) },
  { name: 'scene-office', state: sceneAt('office', 1) },
  { name: 'scene-desk', state: sceneAt('desk', 2) },
  { name: 'scene-meeting', state: sceneAt('meeting', 3) },
  { name: 'scene-hallway', state: sceneAt('hallway', 4) },
  { name: 'scene-home', state: sceneAt('home', 2) },
];

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
            .put({ saveVersion, savedAt: '2026-11-01T00:00:00.000Z', state: save }, 'auto');
          transaction.oncomplete = () => {
            open.result.close();
            resolve();
          };
        };
      }),
    { saveVersion: SAVE_VERSION, save: state },
  );

test.use({
  launchOptions: {
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  },
});

for (const graphics of ['3d', '2d'] as const) {
  for (const { name, state } of SHOTS) {
    test(`${graphics} ${name}`, async ({ page }, info) => {
      test.setTimeout(120_000);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await asReturningPlayer(page);
      await page.addInitScript((value) => {
        const settings = { textSize: 'normal', textSpeed: 'normal', volume: 0, ambience: false };
        localStorage.setItem('cstar.settings', JSON.stringify({ ...settings, graphics: value }));
      }, graphics);
      await page.goto('/');
      await loadSave(page, state);
      await page.goto('/play');
      await page.waitForTimeout(graphics === '3d' ? 9000 : 1500);
      await page.screenshot({
        path: `${SHOTS_DIR}/${LABEL}-${info.project.name}-${graphics}-${name}.png`,
      });
    });
  }
}

test('dossier', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await asReturningPlayer(page);
  await page.addInitScript(() => {
    const settings = { textSize: 'normal', textSpeed: 'normal', volume: 0, ambience: false };
    localStorage.setItem('cstar.settings', JSON.stringify({ ...settings, graphics: '2d' }));
  });
  await page.goto('/');
  await loadSave(page, settledAt(8));
  await page.goto('/play');
  await page.getByRole('button', { name: /Hồ sơ/ }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${SHOTS_DIR}/${LABEL}-${info.project.name}-dossier.png` });
});

test('ending summary', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await asReturningPlayer(page);
  await page.addInitScript(() => {
    const settings = { textSize: 'normal', textSpeed: 'normal', volume: 0, ambience: false };
    localStorage.setItem('cstar.settings', JSON.stringify({ ...settings, graphics: '2d' }));
  });
  await page.goto('/');
  await loadSave(page, lastLineOf('ending-survivor', 'year-uyen'));
  await page.goto('/play');
  await page.waitForTimeout(800);
  await page.getByText('Chạm để đọc tiếp').click();
  await page.getByText('Tổng đã nhận').waitFor();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${SHOTS_DIR}/${LABEL}-${info.project.name}-ending.png` });
});

test('menu', async ({ page }, info) => {
  await asReturningPlayer(page);
  await page.goto('/');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${SHOTS_DIR}/${LABEL}-${info.project.name}-menu.png` });
});
