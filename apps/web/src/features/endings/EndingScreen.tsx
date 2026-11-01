'use client';

import { disclaimer } from '@cstar/content';
import type { GameState } from '@cstar/game-core';
import Link from 'next/link';
import { Button, buttonClass } from '@/components/ui/Button';
import { useGameStore, world } from '@/features/play/game-store';
import { formatMoney } from '@/lib/format-money';

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4">
    <dt className="opacity-70">{label}</dt>
    <dd className="font-bold whitespace-nowrap tabular-nums">{value}</dd>
  </div>
);

/** The end of a run, or for Ending 5 the moment it turns out not to be (GDD §6). */
export const EndingScreen = ({ state }: { state: GameState }) => {
  const dispatch = useGameStore((store) => store.dispatch);
  const ending = world.endings.find(({ id }) => id === state.ending);

  return (
    <section className="bg-surface-950/90 animate-fade absolute inset-0 z-20 overflow-y-auto">
      <div className="mx-auto flex min-h-full max-w-2xl flex-col justify-center gap-5 p-6 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        {ending?.loops && (
          <div className="flex flex-col gap-1 text-center">
            <h2 className="text-paycheck text-3xl font-extrabold lg:text-4xl">CONGRATULATIONS!</h2>
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
            <h2 className="text-paycheck text-3xl font-extrabold">{ending?.title}</h2>
          )}
          <p className="text-ink-secondary leading-7">{ending?.summary}</p>
        </div>

        <dl className="paper-card flex flex-col gap-2 rounded-xl p-4">
          <Row label="Công ty còn nợ bạn" value={formatMoney(state.money.companyDebt)} />
          <Row label="Bạn đang vay" value={formatMoney(state.money.loans)} />
          <Row
            label="Giấy tờ giữ được"
            value={`${state.evidence.length}/${world.evidence.length}`}
          />
        </dl>

        {ending?.loops && (
          <Button onClick={() => dispatch({ type: 'renewContract' })}>Tiếp tục cống hiến</Button>
        )}
        <Link href="/" className={buttonClass('quiet')}>
          Về menu
        </Link>
        <p className="text-ink-muted text-center text-sm">{disclaimer.reminder}</p>
      </div>
    </section>
  );
};
