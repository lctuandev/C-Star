import { readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { asReturningPlayer } from '../tools/accepted-disclaimer.js';
import { doTask, playUntil, startGame, weekHeading } from '../tools/play.js';

const continueButton = (page: Page) => page.getByRole('button', { name: 'Tiếp tục' });
const newGame = (page: Page) => page.getByRole('button', { name: 'Game mới' });
const rest = (page: Page) => page.getByRole('button', { name: /Nghỉ ngơi/ }).click();

/** Writes straight into the store the game reads. */
const putInStorage = (page: Page, slot: string, value: unknown) =>
  page.evaluate(
    async ([key, data]) => {
      const database = await new Promise<IDBDatabase>((resolve) => {
        const request = indexedDB.open('cstar', 1);
        request.onupgradeneeded = () => request.result.createObjectStore('saves');
        request.onsuccess = () => resolve(request.result);
      });
      await new Promise((resolve) => {
        const transaction = database.transaction('saves', 'readwrite');
        transaction.objectStore('saves').put(data, key as string);
        transaction.oncomplete = resolve;
      });
      database.close();
    },
    [slot, value],
  );

/** The state on the disk: an autosave lands a few milliseconds after the action. */
const savedState = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<{
        story: { nodeId: string | null };
        calendar: { actionsLeft: number };
        phase: string;
      } | null>((resolve) => {
        const request = indexedDB.open('cstar', 1);
        request.onsuccess = () => {
          const get = request.result.transaction('saves').objectStore('saves').get('auto');
          get.onsuccess = () => {
            request.result.close();
            resolve((get.result as { state: never } | undefined)?.state ?? null);
          };
        };
      }),
  );

const hudOf = async (page: Page) => ({
  time: await page.getByText(/Tháng \d · Tuần \d/).textContent(),
  energy: await page.getByRole('meter', { name: 'Sức' }).getAttribute('aria-valuenow'),
  stress: await page.getByRole('meter', { name: 'Căng' }).getAttribute('aria-valuenow'),
});

test('a reload in the middle of a line loses nothing (SCENARIO-030)', async ({ page }) => {
  await startGame(page);
  await page.getByRole('button', { name: 'Đọc tiếp' }).click();
  await expect(page.getByRole('status')).toContainText('Vị trí: Chuyên viên');
  await expect.poll(async () => (await savedState(page))?.story.nodeId).toBe('offer');

  await page.reload();
  await expect(page.getByRole('status')).toContainText('Vị trí: Chuyên viên');
});

test('a reload in the week keeps the count and doubles nothing (SCENARIO-030)', async ({
  page,
}) => {
  await startGame(page);
  await playUntil(page, weekHeading(page));
  await doTask(page);
  await expect(page.getByRole('heading', { name: 'Tuần này còn 2 lượt' })).toBeVisible();
  const before = await hudOf(page);
  await expect.poll(async () => (await savedState(page))?.calendar.actionsLeft).toBe(2);

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Tuần này còn 2 lượt' })).toBeVisible();
  expect(await hudOf(page)).toEqual(before);
});

test('a reload on the payslip shows the same slip (SCENARIO-030)', async ({ page }) => {
  await startGame(page);
  for (let action = 0; action < 12; action += 1) {
    await playUntil(page, weekHeading(page));
    await rest(page);
  }
  const slip = page.getByRole('heading', { name: 'PHIẾU LƯƠNG THÁNG 1' });
  await playUntil(page, slip);
  const money = await page.getByText('Còn lại trong ví').locator('..').textContent();
  await expect.poll(async () => (await savedState(page))?.phase).toBe('payslip');

  await page.reload();
  await expect(slip).toBeVisible();
  expect(await page.getByText('Còn lại trong ví').locator('..').textContent()).toBe(money);
});

test('the menu offers to go on, with no disclaimer in between (SCENARIO-030)', async ({ page }) => {
  await startGame(page);
  await playUntil(page, weekHeading(page));
  await page.getByRole('link', { name: 'Menu' }).click();
  await continueButton(page).click();
  await expect(weekHeading(page)).toBeVisible();
});

test('a new game over a run asks first (SCENARIO-031)', async ({ page }) => {
  await startGame(page);
  await playUntil(page, weekHeading(page));
  await page.getByRole('link', { name: 'Menu' }).click();

  await newGame(page).click();
  await expect(page.getByText(/sẽ bị thay thế/)).toBeVisible();
  await page.getByRole('button', { name: 'Để sau' }).click();
  await continueButton(page).click();
  await expect(weekHeading(page)).toBeVisible();
});

test('a broken save is reported, kept, and can be taken out (SCENARIO-032)', async ({ page }) => {
  await asReturningPlayer(page);
  await page.goto('/');
  await putInStorage(page, 'auto', { broken: 'yes' });
  await page.reload();

  await expect(page.getByText(/Không đọc được save/)).toBeVisible();
  await expect(continueButton(page)).toBeHidden();

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Lưu file save' }).click(),
  ]);
  const saved = JSON.parse(await readFile(await download.path(), 'utf8')) as unknown;
  expect(saved).toEqual({ broken: 'yes' });

  await newGame(page).click();
  await page.getByRole('button', { name: /Tôi đã hiểu/ }).click();
  await expect(page).toHaveURL(/\/play$/);

  const kept = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const request = indexedDB.open('cstar', 1);
        request.onsuccess = () => {
          const get = request.result.transaction('saves').objectStore('saves').get('broken');
          get.onsuccess = () => resolve(get.result);
        };
      }),
  );
  expect(kept).toEqual({ broken: 'yes' });
});

test('a direct link never overwrites a broken save (SCENARIO-032)', async ({ page }) => {
  await asReturningPlayer(page);
  await page.goto('/');
  await putInStorage(page, 'auto', { broken: 'yes' });
  await page.goto('/play');
  await expect(page.getByText(/Không đọc được save/)).toBeVisible();
});

test('a save travels by file (SCENARIO-033)', async ({ page, context }) => {
  await startGame(page);
  await playUntil(page, weekHeading(page));
  await doTask(page);
  await expect.poll(async () => (await savedState(page))?.calendar.actionsLeft).toBe(2);

  await page.goto('/about');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Xuất save' }).click(),
  ]);
  const file = path.join(tmpdir(), `cstar-e2e-${Date.now()}.json`);
  await download.saveAs(file);

  const other = await context.browser()!.newContext({ baseURL: page.url() });
  const phone = await other.newPage();
  await asReturningPlayer(phone);
  await phone.goto('/about');
  await phone.getByLabel('Chọn file save').setInputFiles(file);
  await expect(phone.getByRole('status')).toContainText('Đã nhập save');
  await phone.getByRole('link', { name: 'Quay lại' }).click();
  await continueButton(phone).click();
  await expect(phone.getByRole('heading', { name: 'Tuần này còn 2 lượt' })).toBeVisible();
  await other.close();
});

test('a strange file is refused (SCENARIO-033)', async ({ page }) => {
  await asReturningPlayer(page);
  await page.goto('/about');
  const file = path.join(tmpdir(), `cstar-e2e-bad-${Date.now()}.json`);
  await writeFile(file, '{"not":"a save"}');
  await page.getByLabel('Chọn file save').setInputFiles(file);
  await expect(page.getByRole('status')).toContainText('không phải save');
});

test('blocked storage still plays, and says so (SCENARIO-034)', async ({ page }) => {
  await page.addInitScript(() => {
    IDBFactory.prototype.open = () => {
      throw new DOMException('blocked', 'SecurityError');
    };
  });
  await startGame(page);
  await expect(page.getByText(/chưa được lưu/)).toBeVisible();
  await playUntil(page, weekHeading(page));
  await rest(page);
  await expect(page.getByRole('heading', { name: 'Tuần này còn 2 lượt' })).toBeVisible();
});
