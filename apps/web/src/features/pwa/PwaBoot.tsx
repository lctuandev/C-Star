'use client';

import { useEffect } from 'react';
import { isIos } from './install-hint';
import { usePwaStore } from './pwa-store';
import type { BeforeInstallPromptEvent } from './pwa-store';
import { registerServiceWorker } from './service-worker-client';

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as { standalone?: boolean }).standalone === true;

// Here and not in an effect: on a slow phone the browser can offer this before React hydrates.
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    usePwaStore.getState().setInstallPrompt(event as BeforeInstallPromptEvent);
  });
  window.addEventListener('appinstalled', () => {
    usePwaStore.getState().setInstallPrompt(null);
  });
}

export const PwaBoot = () => {
  useEffect(() => {
    const { setEnvironment, setUpdateWorker } = usePwaStore.getState();
    setEnvironment({
      standalone: isStandalone(),
      ios: isIos(navigator.userAgent, navigator.maxTouchPoints),
    });
    void registerServiceWorker(setUpdateWorker);
  }, []);

  return null;
};
