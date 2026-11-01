'use client';

import { disclaimer } from '@cstar/content';
import type { GameState } from '@cstar/game-core';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useGameStore, world } from '@/features/play/game-store';
import { formatMoney } from '@/lib/format-money';

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4">
    <dt className="text-ink-secondary">{label}</dt>
    <dd className="font-bold whitespace-nowrap tabular-nums">{value}</dd>
  </div>
);

/** The end of a run, or for Ending 5 the moment it turns out not to be (GDD §6). */
export const EndingScreen = ({ state }: { state: GameState }) => {
  const dispatch = useGameStore((store) => store.dispatch);
  const ending = world.endings.find(({ id }) => id === state.ending);

  return (
    <section className="flex flex-1 flex-col justify-center gap-5 p-6 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
      {ending?.loops && (
        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-fluorescent text-3xl font-extrabold">CONGRATULATIONS!</h2>
          <p className="text-lg font-bold">PAYMENT DELAYED AGAIN.</p>
          <p>Your next payday: Coming Soon™</p>
          <p className="text-ink-secondary">Thank you for your continued dedication.</p>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <p className="text-ink-muted text-sm">Kết thúc</p>
        {ending?.loops ? (
          <p className="text-xl font-extrabold">{ending.title}</p>
        ) : (
          <h2 className="text-2xl font-extrabold">{ending?.title}</h2>
        )}
        <p className="text-ink-secondary leading-7">{ending?.summary}</p>
      </div>

      <dl className="bg-surface-800 flex flex-col gap-2 rounded-xl p-4">
        <Row label="Công ty còn nợ bạn" value={formatMoney(state.money.companyDebt)} />
        <Row label="Bạn đang vay" value={formatMoney(state.money.loans)} />
        <Row label="Giấy tờ giữ được" value={`${state.evidence.length}/${world.evidence.length}`} />
      </dl>

      {ending?.loops && (
        <Button onClick={() => dispatch({ type: 'renewContract' })}>Tiếp tục cống hiến</Button>
      )}
      <Link
        href="/"
        className="bg-surface-700 flex min-h-11 items-center justify-center rounded-xl px-6 font-bold"
      >
        Về menu
      </Link>
      <p className="text-ink-muted text-center text-sm">{disclaimer.reminder}</p>
    </section>
  );
};
