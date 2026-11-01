'use client';

import { syncLineFor } from '@cstar/content';
import { weekActions } from '@cstar/game-core';
import type { GameState } from '@cstar/game-core';
import { Button } from '@/components/ui/Button';
import { Portrait } from '@/features/dialogue/Portrait';
import { useOfficeStore } from '@/features/office/office-store';
import { useGameStore, world } from '@/features/play/game-store';
import { ActionIcon } from './ActionIcon';

interface WeekScreenProps {
  state: GameState;
  onOpenDossier: () => void;
}

export const WeekScreen = ({ state, onOpenDossier }: WeekScreenProps) => {
  const dispatch = useGameStore((store) => store.dispatch);
  const walking = useOfficeStore((store) => store.walk !== null);
  const { actionsLeft, month, week } = state.calendar;
  const sync = syncLineFor(month, week);

  return (
    <section className="bg-surface-900/95 animate-rise flex flex-col gap-3 rounded-t-3xl border-t border-white/10 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] wide:rounded-3xl wide:border wide:pb-4">
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
          className="bg-surface-700 min-h-11 rounded-xl px-4 text-sm font-bold"
        >
          Hồ sơ
        </button>
      </div>
      {sync && (
        <p className="bg-surface-800 flex items-center gap-2 rounded-xl p-2 text-sm">
          <Portrait id="manager" size="small" />
          <span>
            <span className="text-paycheck font-bold">Weekly sync, anh Tín: </span>
            {sync}
          </span>
        </p>
      )}
      <div className="grid auto-rows-fr grid-cols-2 gap-2">
        {weekActions(state, world).map((action) => (
          <Button
            key={action.id}
            variant={action.available ? 'primary' : 'quiet'}
            disabled={!action.available || walking}
            className="flex-col !items-stretch py-2 text-left"
            onClick={() => dispatch({ type: 'takeAction', actionId: action.id })}
          >
            <span className="flex items-center gap-2">
              <ActionIcon id={action.id} />
              {action.label}
            </span>
            <span className="text-xs font-medium opacity-80">
              {action.lockedReason ?? action.hint}
            </span>
          </Button>
        ))}
      </div>
    </section>
  );
};
