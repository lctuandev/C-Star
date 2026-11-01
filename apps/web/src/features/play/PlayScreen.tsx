'use client';

import { kpiTargetOf, viewOf } from '@cstar/game-core';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChapterCard } from '@/features/dialogue/ChapterCard';
import { DialogueBox } from '@/features/dialogue/DialogueBox';
import { HistorySheet } from '@/features/dialogue/HistorySheet';
import { EndingScreen } from '@/features/endings/EndingScreen';
import { DossierSheet } from '@/features/dossier/DossierSheet';
import { Hud } from '@/features/hud/Hud';
import { Backdrop } from '@/features/office/Backdrop';
import { useOfficeStore } from '@/features/office/office-store';
import { Stage } from '@/features/office/Stage';
import { PayslipScreen } from '@/features/payslip/PayslipScreen';
import { useSaveStore } from '@/features/save/save-store';
import { TicketScreen } from '@/features/tickets/TicketScreen';
import { WeekScreen } from '@/features/week/WeekScreen';
import { useGameStore, world } from './game-store';

export const PlayScreen = () => {
  const state = useGameStore((store) => store.state);
  const history = useGameStore((store) => store.history);
  const dispatch = useGameStore((store) => store.dispatch);
  const writeFailed = useSaveStore((store) => store.writeFailed);
  const router = useRouter();
  const [showHistory, setShowHistory] = useState(false);
  const [showDossier, setShowDossier] = useState(false);
  const sceneWindow = useRef<HTMLDivElement>(null);
  const setFrame = useOfficeStore((store) => store.setFrame);
  const running = state !== null;

  // The scene frames itself inside what the HUD and the panels leave free, whatever the screen.
  useEffect(() => {
    const element = sceneWindow.current;
    if (!element) {
      return;
    }
    const measure = () => {
      const { left, top, width, height } = element.getBoundingClientRect();
      setFrame({ left, top, width, height });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => observer.disconnect();
  }, [running, setFrame]);

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
  const place = (sceneId && world.story.scenes[sceneId]?.place) || 'office';

  const inWeek = state.phase === 'week';
  const inTickets = state.phase === 'kpi';
  const sidePanel = inWeek || inTickets;

  return (
    <main className="bg-surface-950 relative h-dvh overflow-hidden">
      <Backdrop place={place} state={state} />
      <Stage state={state} place={place} />
      <div className="pointer-events-none absolute inset-0 flex flex-col pt-[env(safe-area-inset-top)]">
        <Hud state={state} kpiTarget={kpiTargetOf(world, state.calendar.month)} />
        {writeFailed && (
          <p role="alert" className="bg-surface-800 text-alarm px-4 py-2 text-sm">
            Tiến độ chưa được lưu: trình duyệt đang chặn bộ nhớ.
          </p>
        )}
        <div className="wide:flex-row flex min-h-0 flex-1 flex-col">
          <div ref={sceneWindow} className="relative min-h-28 flex-1 shrink-0">
            {view && (
              <button
                type="button"
                onClick={() => setShowHistory(true)}
                className="bg-surface-900/90 pointer-events-auto absolute top-3 right-3 min-h-11 rounded-xl px-4 text-sm font-bold"
              >
                Vừa rồi
              </button>
            )}
          </div>
          {sidePanel && (
            <div className="wide:flex wide:w-[26rem] wide:flex-col wide:justify-end wide:p-4 pointer-events-auto max-h-full min-h-0 overflow-y-auto">
              {inWeek && <WeekScreen state={state} onOpenDossier={() => setShowDossier(true)} />}
              {inTickets && <TicketScreen state={state} />}
            </div>
          )}
        </div>
        {view && (
          <div className="pointer-events-auto mx-auto min-h-0 w-full max-w-3xl shrink overflow-y-auto">
            <DialogueBox
              key={`${view.sceneId}/${view.nodeId}`}
              view={view}
              playerName={state.playerName}
              onAdvance={() => dispatch({ type: 'advance' })}
              onChoose={(choiceId) => dispatch({ type: 'choose', choiceId })}
            />
          </div>
        )}
      </div>
      <ChapterCard sceneId={sceneId} />
      {state.phase === 'payslip' && state.payslip && (
        <PayslipScreen payslip={state.payslip} playerName={state.playerName} />
      )}
      {state.phase === 'ended' && <EndingScreen state={state} />}
      {showHistory && (
        <HistorySheet
          lines={history}
          playerName={state.playerName}
          onClose={() => setShowHistory(false)}
        />
      )}
      {showDossier && <DossierSheet state={state} onClose={() => setShowDossier(false)} />}
    </main>
  );
};
