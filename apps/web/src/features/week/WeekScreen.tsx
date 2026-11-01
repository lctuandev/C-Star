'use client';

import { weekActions } from '@cstar/game-core';
import type { GameState } from '@cstar/game-core';
import { Button } from '@/components/ui/Button';
import { useGameStore, world } from '@/features/play/game-store';

export const WeekScreen = ({ state }: { state: GameState }) => {
  const dispatch = useGameStore((store) => store.dispatch);
  const { actionsLeft } = state.calendar;

  return (
    <section className="flex flex-1 flex-col justify-end gap-3 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
      {state.lastOutcome && (
        <p role="status" className="text-ink-secondary text-base leading-7">
          {state.lastOutcome}
        </p>
      )}
      <h2 className="text-lg font-extrabold">Tuần này còn {actionsLeft} lượt</h2>
      {weekActions(state, world).map((action) => (
        <div key={action.id} className="flex flex-col gap-1">
          <Button
            variant={action.available ? 'primary' : 'quiet'}
            disabled={!action.available}
            className="flex flex-col py-2 text-left"
            onClick={() => dispatch({ type: 'takeAction', actionId: action.id })}
          >
            <span>{action.label}</span>
            <span className="text-sm font-medium opacity-80">{action.hint}</span>
          </Button>
          {action.lockedReason && (
            <p className="text-ink-muted px-1 text-sm">{action.lockedReason}</p>
          )}
        </div>
      ))}
    </section>
  );
};
