'use client';

import { viewOf } from '@cstar/game-core';
import type { Place } from '@cstar/game-core';
import { useEffect, useState } from 'react';
import { DialogueBox } from '@/features/dialogue/DialogueBox';
import { HistorySheet } from '@/features/dialogue/HistorySheet';
import { Hud } from '@/features/hud/Hud';
import { PayslipScreen } from '@/features/payslip/PayslipScreen';
import { WeekScreen } from '@/features/week/WeekScreen';
import { EndOfContent } from './EndOfContent';
import { useGameStore, world } from './game-store';

/** Stand-ins until the art pass: cold light at work, warm light at home (GDD §7). */
const BACKDROPS: Record<Place, string> = {
  home: 'from-[#2a2118] to-surface-950',
  office: 'from-[#1d3a38] to-surface-950',
  meeting: 'from-[#1f3340] to-surface-950',
  desk: 'from-[#1b2e2c] to-surface-950',
  hallway: 'from-[#252d2d] to-surface-950',
};

export const PlayScreen = () => {
  const state = useGameStore((store) => store.state);
  const history = useGameStore((store) => store.history);
  const dispatch = useGameStore((store) => store.dispatch);
  const newRun = useGameStore((store) => store.newRun);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (useGameStore.getState().state === null) {
      newRun(Date.now());
    }
  }, [newRun]);

  if (!state) {
    return null;
  }

  const view = viewOf(state, world.story);
  const sceneId = state.story.sceneId;
  const place = sceneId ? world.story.scenes[sceneId]?.place : undefined;

  return (
    <main
      className={`flex min-h-dvh flex-col bg-gradient-to-b pt-[env(safe-area-inset-top)] ${BACKDROPS[place ?? 'office']}`}
    >
      <Hud state={state} />
      {state.phase === 'week' && <WeekScreen state={state} />}
      {state.phase === 'payslip' && state.payslip && <PayslipScreen payslip={state.payslip} />}
      {state.phase === 'ended' && <EndOfContent />}
      {view && (
        <>
          <div className="flex flex-1 items-start justify-end p-4">
            <button
              type="button"
              onClick={() => setShowHistory(true)}
              className="bg-surface-800 min-h-11 rounded-xl px-4 text-sm font-bold"
            >
              Vừa rồi
            </button>
          </div>
          <DialogueBox
            key={`${view.sceneId}/${view.nodeId}`}
            view={view}
            onAdvance={() => dispatch({ type: 'advance' })}
            onChoose={(choiceId) => dispatch({ type: 'choose', choiceId })}
          />
        </>
      )}
      {showHistory && <HistorySheet lines={history} onClose={() => setShowHistory(false)} />}
    </main>
  );
};
