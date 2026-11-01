// @vitest-environment node
import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const ORIGIN = 'https://game.test';
const VERSION = 'v2';
const URLS = ['/', '/index.txt', '/_next/static/chunks/app.js'];
const CACHE = `cstar-${VERSION}`;

type Handler = (event: unknown) => void;
interface FakeRequest {
  url: string;
  method: string;
  mode?: string;
}

const pathOf = (input: string | URL | Request) =>
  new URL(input instanceof Request ? input.url : input, ORIGIN).pathname;

/** CacheStorage with the part of its behaviour the worker relies on: addAll is all or nothing. */
class FakeCaches {
  stores = new Map<string, Map<string, Response>>();
  constructor(private readonly network: typeof fetch) {}

  open(name: string) {
    const store = this.stores.get(name) ?? new Map<string, Response>();
    this.stores.set(name, store);
    return Promise.resolve({
      match: (key: string) => Promise.resolve(store.get(pathOf(key))),
      addAll: async (requests: Request[]) => {
        const responses = await Promise.all(requests.map((request) => this.network(request)));
        requests.forEach((request, i) => store.set(pathOf(request), responses[i]!));
      },
    });
  }
  keys = () => Promise.resolve([...this.stores.keys()]);
  delete = (name: string) => Promise.resolve(this.stores.delete(name));
}

const loadWorker = () => {
  const handlers = new Map<string, Handler>();
  const network = vi.fn<typeof fetch>(() => Promise.resolve(new Response('network')));
  const caches = new FakeCaches(network);
  const self = {
    __CSTAR_BUILD__: { version: VERSION, urls: URLS },
    location: { origin: ORIGIN },
    addEventListener: (type: string, handler: Handler) => handlers.set(type, handler),
    skipWaiting: vi.fn(() => Promise.resolve()),
    clients: { claim: vi.fn(() => Promise.resolve()) },
  };
  const source = readFileSync(path.resolve(import.meta.dirname, 'sw.template.js'), 'utf8');
  vm.runInNewContext(source, { self, caches, fetch: network, Request, Response, URL });

  const lifecycle = async (type: 'install' | 'activate') => {
    let done: unknown;
    handlers.get(type)!({ waitUntil: (work: unknown) => (done = work) });
    await done;
  };
  const request = async (input: FakeRequest) => {
    let response: unknown;
    handlers.get('fetch')!({
      request: input,
      respondWith: (work: unknown) => (response = work),
    });
    return (await response) as Response | undefined;
  };
  const send = (data: unknown) => handlers.get('message')!({ data });
  return { caches, network, self, lifecycle, request, send };
};

const get = (pathname: string, mode = 'cors'): FakeRequest => ({
  url: `${ORIGIN}${pathname}`,
  method: 'GET',
  mode,
});

describe('service worker', () => {
  let worker: ReturnType<typeof loadWorker>;

  beforeEach(() => {
    worker = loadWorker();
  });

  describe('install', () => {
    it('stores the whole build in this version’s cache', async () => {
      await worker.lifecycle('install');
      expect([...worker.caches.stores.get(CACHE)!.keys()].sort()).toEqual([...URLS].sort());
    });

    it('fails as a whole when a file cannot be fetched, leaving nothing half-built', async () => {
      worker.network.mockRejectedValueOnce(new TypeError('offline'));
      await expect(worker.lifecycle('install')).rejects.toThrow('offline');
      expect(worker.caches.stores.get(CACHE)?.size ?? 0).toBe(0);
    });

    it('waits instead of taking over a game in progress', async () => {
      await worker.lifecycle('install');
      expect(worker.self.skipWaiting).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('takes over only when the page asks', () => {
      worker.send({ type: 'SOMETHING_ELSE' });
      worker.send(undefined);
      expect(worker.self.skipWaiting).not.toHaveBeenCalled();
      worker.send({ type: 'SKIP_WAITING' });
      expect(worker.self.skipWaiting).toHaveBeenCalledOnce();
    });

    it('removes older versions and leaves other caches alone', async () => {
      await worker.caches.open('cstar-v1');
      await worker.caches.open('not-ours');
      await worker.lifecycle('install');
      await worker.lifecycle('activate');
      expect((await worker.caches.keys()).sort()).toEqual([CACHE, 'not-ours']);
      expect(worker.self.clients.claim).toHaveBeenCalledOnce();
    });
  });

  describe('fetch', () => {
    beforeEach(async () => {
      await worker.lifecycle('install');
      worker.network.mockClear();
    });

    it('answers a build file from the cache, without the network', async () => {
      const response = await worker.request(get('/_next/static/chunks/app.js'));
      expect(response).toBeDefined();
      expect(worker.network).not.toHaveBeenCalled();
    });

    it('ignores the query Next adds', async () => {
      await worker.request(get('/index.txt?_rsc=abc'));
      expect(worker.network).not.toHaveBeenCalled();
    });

    it('answers next/link’s HEAD check offline, with no body', async () => {
      worker.network.mockRejectedValue(new TypeError('offline'));
      const response = await worker.request({ url: `${ORIGIN}/index.txt`, method: 'HEAD' });
      expect(response?.status).toBe(200);
      expect(response?.body).toBeNull();
    });

    it('opens the game offline', async () => {
      worker.network.mockRejectedValue(new TypeError('offline'));
      expect(await worker.request(get('/', 'navigate'))).toBeDefined();
    });

    it('falls back to the network if a file went missing from the cache', async () => {
      worker.caches.stores.get(CACHE)!.delete('/index.txt');
      await worker.request(get('/index.txt'));
      expect(worker.network).toHaveBeenCalledOnce();
    });

    it('gives the real answer for an unknown address online', async () => {
      const response = await worker.request(get('/unknown', 'navigate'));
      expect(await response!.text()).toBe('network');
    });

    it('gives the game for an unknown address offline', async () => {
      worker.network.mockRejectedValue(new TypeError('offline'));
      const response = await worker.request(get('/unknown', 'navigate'));
      expect(response).toBe(worker.caches.stores.get(CACHE)!.get('/'));
    });

    it('stays out of other requests', async () => {
      expect(await worker.request(get('/not-in-the-build.js'))).toBeUndefined();
      expect(
        await worker.request({ url: 'https://other.test/a.js', method: 'GET', mode: 'cors' }),
      ).toBeUndefined();
      expect(await worker.request({ url: `${ORIGIN}/`, method: 'POST' })).toBeUndefined();
    });
  });
});
