import { beforeEach, describe, expect, it } from 'vitest';
import { useGameStore, world } from './game-store';

const initial = useGameStore.getState();

describe('useGameStore', () => {
  beforeEach(() => {
    useGameStore.setState(initial, true);
  });

  it('opens a run on the first scene', () => {
    useGameStore.getState().newRun(1);
    expect(useGameStore.getState().state?.story.sceneId).toBe(world.openingScene);
    expect(useGameStore.getState().history).toHaveLength(1);
  });

  it('keeps the lines shown, and only those', () => {
    const store = useGameStore.getState();
    store.newRun(1);
    store.dispatch({ type: 'advance' });
    expect(useGameStore.getState().history).toHaveLength(2);

    // Refused: nothing changes.
    store.dispatch({ type: 'choose', choiceId: 'nope' });
    expect(useGameStore.getState().history).toHaveLength(2);
  });

  it('ignores actions with no run', () => {
    useGameStore.getState().dispatch({ type: 'advance' });
    expect(useGameStore.getState().state).toBeNull();
  });

  it('starts the history over on a new run', () => {
    const store = useGameStore.getState();
    store.newRun(1);
    store.dispatch({ type: 'advance' });
    store.newRun(2);
    expect(useGameStore.getState().history).toHaveLength(1);
  });
});
