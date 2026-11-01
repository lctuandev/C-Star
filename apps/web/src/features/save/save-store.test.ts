import { world } from '@cstar/content';
import { beginRun } from '@cstar/game-core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { saveBackend } from './save-backend';
import { createSaveFile } from './save-format';
import { useSaveStore } from './save-store';

vi.mock('./save-backend', () => ({
  saveBackend: { read: vi.fn(), write: vi.fn(), remove: vi.fn() },
}));

const backend = vi.mocked(saveBackend);
const initial = useSaveStore.getState();
const state = beginRun(1, world);
const flushed = () => vi.waitFor(() => expect(backend.write).toHaveBeenCalled());

describe('useSaveStore', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    backend.write.mockResolvedValue();
    backend.remove.mockResolvedValue();
    useSaveStore.setState(initial, true);
  });

  it('finds nothing on a first visit', async () => {
    backend.read.mockResolvedValue(undefined);
    await useSaveStore.getState().refresh();
    expect(useSaveStore.getState().status).toBe('none');
  });

  it('finds a good save', async () => {
    const file = createSaveFile(state, 'now');
    backend.read.mockResolvedValue(file);
    await useSaveStore.getState().refresh();
    expect(useSaveStore.getState()).toMatchObject({ status: 'found', file });
  });

  it('calls an unreadable save broken, and keeps it to take out (SCENARIO-032)', async () => {
    backend.read.mockResolvedValue({ junk: true });
    await useSaveStore.getState().refresh();
    expect(useSaveStore.getState()).toMatchObject({ status: 'broken', raw: { junk: true } });
  });

  it('moves a broken save aside instead of losing it (SCENARIO-032)', async () => {
    backend.read.mockResolvedValue({ junk: true });
    const store = useSaveStore.getState();
    await store.refresh();
    await store.setAsideBroken();
    expect(backend.write).toHaveBeenCalledWith('broken', { junk: true });
    expect(backend.remove).toHaveBeenCalledWith('auto');
    expect(useSaveStore.getState().status).toBe('none');
  });

  it('touches nothing when there is no broken save', async () => {
    await useSaveStore.getState().setAsideBroken();
    expect(backend.write).not.toHaveBeenCalled();
  });

  it('treats a storage that cannot be read as no save', async () => {
    backend.read.mockRejectedValue(new Error('blocked'));
    await useSaveStore.getState().refresh();
    expect(useSaveStore.getState().status).toBe('none');
  });

  it('autosaves', async () => {
    useSaveStore.getState().autosave(state);
    await flushed();
    await vi.waitFor(() => expect(useSaveStore.getState().status).toBe('found'));
    expect(backend.write.mock.calls[0]?.[0]).toBe('auto');
  });

  it('writes the newest state last when the player is faster than the disk', async () => {
    let finishFirst = () => {};
    backend.write.mockImplementationOnce(
      () => new Promise<void>((resolve) => (finishFirst = resolve)),
    );
    const store = useSaveStore.getState();
    store.autosave({ ...state, seed: 1 });
    store.autosave({ ...state, seed: 2 });
    store.autosave({ ...state, seed: 3 });
    expect(backend.write).toHaveBeenCalledTimes(1);

    finishFirst();
    await vi.waitFor(() => expect(backend.write).toHaveBeenCalledTimes(2));
    const last = backend.write.mock.calls[1]?.[1] as { state: { seed: number } };
    expect(last.state.seed).toBe(3);
  });

  it('says when progress is not being kept, and recovers (SCENARIO-034)', async () => {
    backend.write.mockRejectedValueOnce(new Error('full'));
    const store = useSaveStore.getState();
    store.autosave(state);
    await vi.waitFor(() => expect(useSaveStore.getState().writeFailed).toBe(true));

    store.autosave(state);
    await vi.waitFor(() => expect(useSaveStore.getState().writeFailed).toBe(false));
  });

  it('imports a good file and refuses anything else (SCENARIO-033)', async () => {
    const store = useSaveStore.getState();
    expect(await store.importText(JSON.stringify(createSaveFile(state, 'now')))).toBe(true);
    expect(useSaveStore.getState().status).toBe('found');
    backend.write.mockClear();

    expect(await store.importText('không phải json')).toBe(false);
    expect(await store.importText('{"a":1}')).toBe(false);
    expect(backend.write).not.toHaveBeenCalled();
  });
});
