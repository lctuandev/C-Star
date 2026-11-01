'use client';

import { kpiTargetOf, viewOf } from '@cstar/game-core';
import type { Place } from '@cstar/game-core';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DialogueBox } from '@/features/dialogue/DialogueBox';
import { HistorySheet } from '@/features/dialogue/HistorySheet';
import { DossierSheet } from '@/features/dossier/DossierSheet';
import { Hud } from '@/features/hud/Hud';
import { PayslipScreen } from '@/features/payslip/PayslipScreen';
import { useSaveStore } from '@/features/save/save-store';
import { TicketScreen } from '@/features/tickets/TicketScreen';
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
  const writeFailed = useSaveStore((store) => store.writeFailed);
  const router = useRouter();
  const [showHistory, setShowHistory] = useState(false);
  const [showDossier, setShowDossier] = useState(false);

  // A reload or a direct link: take up the saved run, or start one if there is none.
  useEffect(() => {
    const game = useGameStore.getState();
    if (game.state !== null) {
      return;
    }
    const saves = useSaveStore.getState();
    void saves.refresh().then(() => {
      const { status, file } = useSaveStore.getState();
      if (status === 'broken') {
        // The menu deals with it: a new run here would write over the broken save.
        router.replace('/');
      } else if (status === 'found' && file && file.state.phase !== 'ended') {
        game.resume(file.state);
      } else {
        game.newRun(Date.now());
      }
    });
  }, [router]);

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
      <Hud state={state} kpiTarget={kpiTargetOf(world, state.calendar.month)} />
      {writeFailed && (
        <p role="alert" className="bg-surface-800 text-alarm px-4 py-2 text-sm">
          Tiến độ chưa được lưu: trình duyệt đang chặn bộ nhớ.
        </p>
      )}
      {state.phase === 'week' && (
        <WeekScreen state={state} onOpenDossier={() => setShowDossier(true)} />
      )}
      {state.phase === 'kpi' && <TicketScreen state={state} />}
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
      {showDossier && <DossierSheet state={state} onClose={() => setShowDossier(false)} />}
    </main>
  );
};
