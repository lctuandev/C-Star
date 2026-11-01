import { afterEach, describe, expect, it, vi } from 'vitest';
import { applyUpdate, registerServiceWorker, watchForUpdate } from './service-worker-client';

const fakeWorker = (state: string) => {
  const listeners: (() => void)[] = [];
  const worker = {
    state,
    postMessage: vi.fn(),
    addEventListener: (_: string, listener: () => void) => listeners.push(listener),
  };
  const become = (next: string) => {
    worker.state = next;
    listeners.forEach((listener) => listener());
  };
  return { worker: worker as unknown as ServiceWorker, raw: worker, become };
};

const fakeRegistration = (waiting: ServiceWorker | null = null) => {
  const listeners: (() => void)[] = [];
  const registration = {
    waiting,
    installing: null as ServiceWorker | null,
    addEventListener: (_: string, listener: () => void) => listeners.push(listener),
  };
  const updateFound = (installing: ServiceWorker) => {
    registration.installing = installing;
    listeners.forEach((listener) => listener());
  };
  return { registration, updateFound };
};

const running = () => ({}) as ServiceWorker;

describe('watchForUpdate', () => {
  it('reports a version already waiting when the page opens', () => {
    const waiting = fakeWorker('installed').worker;
    const onReady = vi.fn();
    watchForUpdate(fakeRegistration(waiting).registration, running, onReady);
    expect(onReady).toHaveBeenCalledWith(waiting);
  });

  it('reports a new version once it has fully installed', () => {
    const { registration, updateFound } = fakeRegistration();
    const onReady = vi.fn();
    watchForUpdate(registration, running, onReady);

    const next = fakeWorker('installing');
    updateFound(next.worker);
    expect(onReady).not.toHaveBeenCalled();

    registration.waiting = next.worker;
    next.become('installed');
    expect(onReady).toHaveBeenCalledWith(next.worker);
  });

  it('says nothing about an install that failed', () => {
    const { registration, updateFound } = fakeRegistration();
    const onReady = vi.fn();
    watchForUpdate(registration, running, onReady);

    const next = fakeWorker('installing');
    updateFound(next.worker);
    next.become('redundant');
    expect(onReady).not.toHaveBeenCalled();
  });

  it('says nothing on the very first install', () => {
    const onReady = vi.fn();
    const first = fakeWorker('installed').worker;
    watchForUpdate(fakeRegistration(first).registration, () => null, onReady);
    expect(onReady).not.toHaveBeenCalled();
  });
});

describe('applyUpdate', () => {
  const stubServiceWorker = () => {
    const addEventListener = vi.fn();
    vi.stubGlobal('navigator', { serviceWorker: { addEventListener } });
    return addEventListener;
  };

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const stubReload = () => {
    const reload = vi.fn();
    vi.stubGlobal('location', { reload });
    return reload;
  };

  it('asks the waiting worker to take over, and reloads only when it has', () => {
    const reload = stubReload();
    const addEventListener = stubServiceWorker();
    const { worker, raw } = fakeWorker('installed');
    applyUpdate(worker);
    expect(raw.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
    expect(reload).not.toHaveBeenCalled();

    const [, takenOver] = addEventListener.mock.calls[0] as [string, () => void];
    takenOver();
    expect(reload).toHaveBeenCalledOnce();
  });

  it('does not reload twice when the worker takes over in time', () => {
    vi.useFakeTimers();
    const reload = stubReload();
    const addEventListener = stubServiceWorker();
    applyUpdate(fakeWorker('installed').worker);
    const [, takenOver] = addEventListener.mock.calls[0] as [string, () => void];
    takenOver();
    vi.advanceTimersByTime(60_000);
    expect(reload).toHaveBeenCalledOnce();
  });

  it('never leaves the button stuck if the browser holds the worker back', () => {
    vi.useFakeTimers();
    const reload = stubReload();
    stubServiceWorker();
    applyUpdate(fakeWorker('installed').worker);
    vi.advanceTimersByTime(9_000);
    expect(reload).not.toHaveBeenCalled();
    vi.advanceTimersByTime(2_000);
    expect(reload).toHaveBeenCalledOnce();
  });

  it('just reloads if another tab already took the update', () => {
    const reload = stubReload();
    stubServiceWorker();
    const { worker, raw } = fakeWorker('activated');
    applyUpdate(worker);
    expect(reload).toHaveBeenCalledOnce();
    expect(raw.postMessage).not.toHaveBeenCalled();
  });
});

describe('registerServiceWorker', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  const stubRegister = () => {
    const register = vi.fn(() => Promise.resolve(fakeRegistration().registration));
    vi.stubGlobal('navigator', { serviceWorker: { register, controller: null } });
    return register;
  };

  it('does nothing in development', async () => {
    const register = stubRegister();
    await registerServiceWorker(vi.fn());
    expect(register).not.toHaveBeenCalled();
  });

  it('registers in production, past the browser’s HTTP cache', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const register = stubRegister();
    await registerServiceWorker(vi.fn());
    expect(register).toHaveBeenCalledWith('/sw.js', { scope: '/', updateViaCache: 'none' });
  });

  it('keeps the game running if registration fails', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    stubRegister().mockRejectedValue(new Error('blocked'));
    await expect(registerServiceWorker(vi.fn())).resolves.toBeUndefined();
  });

  it('copes with a browser without service workers', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubGlobal('navigator', {});
    await expect(registerServiceWorker(vi.fn())).resolves.toBeUndefined();
  });
});
