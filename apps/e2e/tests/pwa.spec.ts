import { spawn } from 'node:child_process';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { chromium, devices, expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { startReleaseServer, WEB_OUT } from '../tools/release-server.js';

const RELEASE_PORT = Number(process.env.E2E_RELEASE_PORT ?? 5301);
const heading = (page: Page) => page.getByRole('heading', { name: 'Công ty C*' });

/** Plays the player in the page: waits for the offer, accepts it, says what happened after. */
const UPDATE_ON_ITS_OWN = `(async () => {
  const report = (message) => fetch('/__report?message=' + encodeURIComponent(message));
  const until = async (found) => {
    for (;;) {
      const value = await found();
      if (value) return value;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  };
  const button = () =>
    [...document.querySelectorAll('button')].find((item) => item.textContent === 'Cập nhật');

  if (sessionStorage.getItem('clicked')) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const keys = await caches.keys();
    await report('reloaded on ' + JSON.stringify(keys) + (button() ? ' with' : ' with no') + ' button');
    return;
  }
  await until(() => navigator.serviceWorker.controller);
  await fetch('/__next-release');
  const registration = await navigator.serviceWorker.getRegistration();
  await registration.update();
  const offer = await until(button);
  sessionStorage.setItem('clicked', '1');
  await report('clicked');
  offer.click();
})();`;

/** The worker has finished installing and controls this page. */
const untilOfflineReady = async (page: Page) => {
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
};

test('Chrome accepts the game as installable (SCENARIO-001)', async ({ page, context }) => {
  await page.goto('/');
  await untilOfflineReady(page);

  const session = await context.newCDPSession(page);
  const { installabilityErrors } = await session.send('Page.getInstallabilityErrors');
  expect(installabilityErrors).toEqual([]);
  const { errors } = await session.send('Page.getAppManifest');
  expect(errors).toEqual([]);
});

test('the whole game opens with no network (SCENARIO-002)', async ({ page, context }) => {
  await page.goto('/');
  await untilOfflineReady(page);

  const failed: string[] = [];
  page.on('requestfailed', (request) => failed.push(request.url()));
  await context.setOffline(true);
  await page.reload();

  await expect(heading(page)).toBeVisible();
  await expect(page.getByText('Tác phẩm hư cấu')).toBeVisible();
  const fontLoaded = await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].some((font) => font.status === 'loaded');
  });
  expect(fontLoaded).toBe(true);
  expect(failed).toEqual([]);

  await page.goto('/khong-co-trang-nay');
  await expect(heading(page)).toBeVisible();
  await context.setOffline(false);
});

test('every file of the build is in the cache', async ({ page }) => {
  await page.goto('/');
  await untilOfflineReady(page);

  const cached = await page.evaluate(async () => {
    const [name] = await caches.keys();
    const requests = await (await caches.open(name!)).keys();
    return requests.map((request) => new URL(request.url).pathname);
  });

  const entries = await readdir(WEB_OUT, { recursive: true, withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => `${entry.parentPath.slice(WEB_OUT.length)}/${entry.name}`);
  const outside = files.filter(
    (file) =>
      !cached.includes(file.replace(/index\.html$/, '')) &&
      !/^\/(sw\.js|404\.html)$/.test(file) &&
      !file.startsWith('/_not-found'),
  );
  expect(outside).toEqual([]);
});

test.describe('a new release while playing (SCENARIO-003)', () => {
  test('is offered, not imposed', async ({ page }) => {
    const server = await startReleaseServer(RELEASE_PORT);
    try {
      await page.goto(server.url);
      await untilOfflineReady(page);

      server.publishNextRelease();
      await page.evaluate(async () => {
        (window as { stillTheSamePage?: boolean }).stillTheSamePage = true;
        const registration = await navigator.serviceWorker.getRegistration();
        await registration?.update();
      });

      await expect(page.getByRole('button', { name: 'Cập nhật' })).toBeVisible();
      expect(
        await page.evaluate(
          () => (window as { stillTheSamePage?: boolean }).stillTheSamePage === true,
        ),
      ).toBe(true);
      const worker = await page.evaluate(() => navigator.serviceWorker.controller?.state);
      expect(worker).toBe('activated');
      await expect(heading(page)).toBeVisible();
    } finally {
      await server.close();
    }
  });
});

test.describe('accepting a new release (SCENARIO-003)', () => {
  test.skip(({ isMobile }) => isMobile, 'One browser run is enough.');

  /**
   * Run in a Chrome with no DevTools: with Playwright attached to the worker, Chromium holds the
   * new one back about one time in three, which a player's browser does not (FEAT-001 test.md).
   */
  test('moves to the new version when the player says yes', async () => {
    const server = await startReleaseServer(RELEASE_PORT, UPDATE_ON_ITS_OWN);
    const profile = await mkdtemp(path.join(tmpdir(), 'cstar-e2e-'));
    const chrome = spawn(
      chromium.executablePath(),
      ['--headless=new', '--no-sandbox', '--disable-gpu', `--user-data-dir=${profile}`, server.url],
      { stdio: 'ignore' },
    );
    try {
      expect(await server.nextReport()).toBe('clicked');
      const report = await server.nextReport();
      expect(report).toMatch(/^reloaded on \["cstar-\w+-r2"\] with no button$/);
    } finally {
      chrome.kill('SIGKILL');
      await server.close();
      await rm(profile, { recursive: true, force: true, maxRetries: 3 });
    }
  });
});

test.describe('the install hint', () => {
  const offerInstall = (page: Page) =>
    page.evaluate(() => {
      const event = new Event('beforeinstallprompt');
      Object.assign(event, {
        prompt: () => {
          (window as { promptShown?: boolean }).promptShown = true;
          return Promise.resolve();
        },
      });
      window.dispatchEvent(event);
    });

  test('opens the browser’s prompt (SCENARIO-001)', async ({ page }) => {
    await page.goto('/');
    await offerInstall(page);
    await page.getByRole('button', { name: 'Cài đặt' }).click();
    expect(
      await page.evaluate(() => (window as { promptShown?: boolean }).promptShown === true),
    ).toBe(true);
  });

  test('stays away once dismissed (SCENARIO-005)', async ({ page }) => {
    await page.goto('/');
    await offerInstall(page);
    await page.getByRole('button', { name: 'Để sau' }).click();
    await expect(page.getByText('Cài game lên điện thoại')).toBeHidden();

    await page.reload();
    await expect(heading(page)).toBeVisible();
    await offerInstall(page);
    await expect(page.getByText('Cài game lên điện thoại')).toBeHidden();
  });

  test('gives iPhone players the steps', async ({ browser, baseURL }) => {
    const { userAgent } = devices['iPhone 15'];
    const context = await browser.newContext({ baseURL, userAgent });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.getByText(/Thêm vào Màn hình chính/)).toBeVisible();
    await context.close();
  });

  test('the card keeps the page free of a sideways scroll', async ({ page }) => {
    await page.goto('/');
    await offerInstall(page);
    await expect(page.getByRole('button', { name: 'Cài đặt' })).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
});
