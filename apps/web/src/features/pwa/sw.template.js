/* Công ty C* service worker (FEAT-001, ADR-002).
 *
 * The whole build is precached, so one visit is enough to play offline. Everything is served from
 * this version's cache, which keeps a build's files together. A new worker waits until the player
 * accepts the update. scripts/build-sw.mjs puts `self.__CSTAR_BUILD__` above this file.
 */
const { version, urls } = self.__CSTAR_BUILD__;

const CACHE_PREFIX = 'cstar-';
const CACHE = `${CACHE_PREFIX}${version}`;
const APP_SHELL = '/';
const precached = new Set(urls);

self.addEventListener('install', (event) => {
  // `reload`: never fill the cache from a stale HTTP cache. addAll is all or nothing, so an
  // interrupted install leaves no half-built game and the browser tries again on the next visit.
  const requests = urls.map(
    (url) => new Request(new URL(url, self.location.origin), { cache: 'reload' }),
  );
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(requests)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    void self.skipWaiting();
  }
});

const fromCache = async (pathname) => {
  const cache = await caches.open(CACHE);
  return cache.match(pathname);
};

/** Keyed by pathname: Next adds queries such as `?_rsc=` to files that are the same on disk. */
const servePrecached = async (request, pathname) => (await fromCache(pathname)) ?? fetch(request);

/** An address outside the build: the real answer when online, the game when not. */
const servePage = async (request) => {
  try {
    return await fetch(request);
  } catch {
    return (await fromCache(APP_SHELL)) ?? Response.error();
  }
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }
  if (precached.has(url.pathname)) {
    event.respondWith(servePrecached(request, url.pathname));
  } else if (request.mode === 'navigate') {
    event.respondWith(servePage(request));
  }
});
