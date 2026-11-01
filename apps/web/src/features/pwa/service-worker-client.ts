/** An installed app can stay open for days without a navigation, the browser's usual check. */
const UPDATE_CHECK_EVERY_MS = 60 * 60 * 1000;

/**
 * A browser may hold the new worker back while the old one finishes its work, for minutes in
 * Chromium. The button must not stay stuck: reloading shows the offer again, or the new version.
 */
const UPDATE_GIVE_UP_MS = 10_000;

interface WorkerRegistration {
  waiting: ServiceWorker | null;
  installing: ServiceWorker | null;
  addEventListener: (type: 'updatefound', listener: () => void) => void;
}

/**
 * Calls `onReady` with a new version waiting behind the running one. Without a controller this is
 * the first install, where the worker just starts and there is nothing to update from.
 */
export const watchForUpdate = (
  registration: WorkerRegistration,
  controller: () => ServiceWorker | null,
  onReady: (worker: ServiceWorker) => void,
): void => {
  const reportWaiting = () => {
    if (registration.waiting && controller()) {
      onReady(registration.waiting);
    }
  };
  reportWaiting();
  registration.addEventListener('updatefound', () => {
    const installing = registration.installing;
    installing?.addEventListener('statechange', () => {
      if (installing.state === 'installed') {
        reportWaiting();
      }
    });
  });
};

/** The player said yes: only this tab reloads, so another tab's game is never interrupted. */
export const applyUpdate = (worker: ServiceWorker): void => {
  if (worker.state !== 'installed') {
    // Another tab already took the update.
    window.location.reload();
    return;
  }
  const reload = () => {
    clearTimeout(giveUp);
    window.location.reload();
  };
  const giveUp = setTimeout(reload, UPDATE_GIVE_UP_MS);
  navigator.serviceWorker.addEventListener('controllerchange', reload, { once: true });
  worker.postMessage({ type: 'SKIP_WAITING' });
};

/** Production only: development stays cache-free. No worker only means no offline play. */
export const registerServiceWorker = async (
  onUpdateReady: (worker: ServiceWorker) => void,
): Promise<void> => {
  if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) {
    return;
  }
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    });
    watchForUpdate(registration, () => navigator.serviceWorker.controller, onUpdateReady);

    let lastCheck = Date.now();
    document.addEventListener('visibilitychange', () => {
      if (
        document.visibilityState === 'visible' &&
        Date.now() - lastCheck > UPDATE_CHECK_EVERY_MS
      ) {
        lastCheck = Date.now();
        void registration.update().catch(() => {
          // Offline: the next check will do.
        });
      }
    });
  } catch {
    // The game still works online.
  }
};
