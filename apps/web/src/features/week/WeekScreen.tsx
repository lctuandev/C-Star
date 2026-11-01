'use client';

import { weekActions } from '@cstar/game-core';
import type { GameState } from '@cstar/game-core';
import { Button } from '@/components/ui/Button';
import { useOfficeStore } from '@/features/office/office-store';
import { useGameStore, world } from '@/features/play/game-store';

interface WeekScreenProps {
  state: GameState;
  onOpenDossier: () => void;
}

export const WeekScreen = ({ state, onOpenDossier }: WeekScreenProps) => {
  const dispatch = useGameStore((store) => store.dispatch);
  const walking = useOfficeStore((store) => store.walk !== null);
  const { actionsLeft } = state.calendar;

  return (
    <section className="bg-surface-950 flex flex-col gap-3 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
      {state.lastOutcome && (
        <p role="status" className="text-ink-secondary text-base leading-7">
          {state.lastOutcome}
        </p>
      )}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold">Tuần này còn {actionsLeft} lượt</h2>
        <button
          type="button"
          onClick={onOpenDossier}
          className="bg-surface-800 min-h-11 rounded-xl px-4 text-sm font-bold"
        >
          Hồ sơ
        </button>
      </div>
      <div className="grid auto-rows-fr grid-cols-2 gap-2">
        {weekActions(state, world).map((action) => (
          <Button
            key={action.id}
            variant={action.available ? 'primary' : 'quiet'}
            disabled={!action.available || walking}
            className="flex flex-col py-2 text-left"
            onClick={() => dispatch({ type: 'takeAction', actionId: action.id })}
          >
            <span>{action.label}</span>
            <span className="text-xs font-medium opacity-80">
              {action.lockedReason ?? action.hint}
            </span>
          </Button>
        ))}
      </div>
    </section>
  );
};
