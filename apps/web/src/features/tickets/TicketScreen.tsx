'use client';

import { ticketView } from '@cstar/game-core';
import type { GameState } from '@cstar/game-core';
import { Button } from '@/components/ui/Button';
import { useGameStore, world } from '@/features/play/game-store';

/** The desk: under 30 seconds a round (GDD §5.5), and "Làm cho có" for anyone in a hurry. */
export const TicketScreen = ({ state }: { state: GameState }) => {
  const dispatch = useGameStore((store) => store.dispatch);
  const view = ticketView(state, world);
  if (!view) {
    return null;
  }
  const { ticket, last, number, total } = view;

  return (
    <section className="bg-surface-900/95 animate-rise flex flex-col gap-3 rounded-t-3xl border-t border-white/10 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] wide:rounded-3xl wide:border wide:pb-4">
      {last && (
        <p role="status" className="text-ink-secondary text-base leading-7">
          <span className={`font-bold ${last.correct ? 'text-fluorescent' : 'text-alarm'}`}>
            {last.correct ? 'Đúng việc. ' : 'Sai việc. '}
          </span>
          {last.reply}
        </p>
      )}

      {ticket ? (
        <>
          <article className="paper-card flex flex-col gap-2 rounded-xl p-4">
            <p className="text-sm font-bold opacity-70">
              Ticket {number}/{total} · Từ: {ticket.from}
            </p>
            <h2 className="text-lg leading-7 font-bold">{ticket.text}</h2>
          </article>
          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={() => dispatch({ type: 'answerTicket', answer: 'do' })}
            >
              Làm ngay
            </Button>
            <Button
              variant="quiet"
              className="flex-1"
              onClick={() => dispatch({ type: 'answerTicket', answer: 'defer' })}
            >
              Sprint sau
            </Button>
          </div>
          <button
            type="button"
            onClick={() => dispatch({ type: 'skipTickets' })}
            className="text-ink-muted min-h-11 text-sm underline"
          >
            Làm cho có
          </button>
        </>
      ) : (
        <Button onClick={() => dispatch({ type: 'finishTickets' })}>Xong việc</Button>
      )}
    </section>
  );
};
