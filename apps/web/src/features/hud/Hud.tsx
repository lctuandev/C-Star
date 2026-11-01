'use client';

import type { GameState } from '@cstar/game-core';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { formatMoneyShort } from '@/lib/format-money';

const Meter = ({ label, value, tone }: { label: string; value: number; tone: string }) => (
  <div className="flex min-w-0 flex-1 items-center gap-2">
    <span className="text-ink-secondary text-xs font-bold whitespace-nowrap">{label}</span>
    <span
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="bg-surface-600/70 h-2.5 min-w-8 flex-1 overflow-hidden rounded-full"
    >
      <span
        className={`block h-full rounded-full transition-[width] duration-500 ${tone}`}
        style={{ width: `${value}%` }}
      />
    </span>
    <span aria-hidden className="text-ink-primary w-6 text-right text-xs font-bold tabular-nums">
      {value}
    </span>
  </div>
);

interface MoneyProps {
  label: string;
  amount: number;
  tone?: string;
  /** Whether more of it is good news: the debt rising is not. */
  gain: string;
  loss: string;
}

/** The figure, and for a moment how much it just moved: money is what the game is about. */
const Money = ({ label, amount, tone = '', gain, loss }: MoneyProps) => {
  const seen = useRef(amount);
  const [change, setChange] = useState<number | null>(null);

  useEffect(() => {
    if (amount === seen.current) {
      return;
    }
    const delta = amount - seen.current;
    seen.current = amount;
    const showing = setTimeout(() => setChange(delta), 0);
    const hiding = setTimeout(() => setChange(null), 1400);
    return () => {
      clearTimeout(showing);
      clearTimeout(hiding);
    };
  }, [amount]);

  return (
    <div className="bg-surface-900/85 relative flex-1 rounded-xl px-3 py-1.5 wide:flex-none wide:px-4">
      <dt className="text-ink-secondary text-xs">{label}</dt>
      <dd className={`font-extrabold tabular-nums ${tone}`}>{formatMoneyShort(amount)}</dd>
      {change !== null && (
        <span
          key={amount}
          aria-hidden
          className={`animate-float-away absolute top-1 right-2 text-sm font-extrabold ${
            change > 0 ? gain : loss
          }`}
        >
          {change > 0 ? '+' : '−'}
          {formatMoneyShort(Math.abs(change))}
        </span>
      )}
    </div>
  );
};

/** Compact, and over the picture: the scene stays the main thing (ux-direction §1). */
export const Hud = ({ state, kpiTarget }: { state: GameState; kpiTarget: number }) => {
  const { calendar, money, mood } = state;

  return (
    <header className="from-surface-950 via-surface-950/85 pointer-events-auto flex flex-col gap-2 bg-gradient-to-b to-transparent px-3 pt-2 pb-6 wide:flex-row wide:items-center wide:gap-5 wide:px-6 wide:pb-8">
      <div className="flex items-center justify-between gap-3 wide:contents">
        <p className="font-extrabold whitespace-nowrap wide:text-lg">
          Tháng {calendar.month} · Tuần {calendar.week}
        </p>
        {kpiTarget > 0 && (
          <p className="text-ink-secondary text-sm font-bold wide:order-4 wide:ml-auto">
            KPI {state.kpi}/{kpiTarget}
          </p>
        )}
        <Link
          href="/"
          className={`text-ink-secondary flex min-h-11 items-center px-2 text-sm font-bold wide:order-5 ${
            kpiTarget > 0 ? '' : 'wide:ml-auto'
          }`}
        >
          Menu
        </Link>
      </div>
      <dl className="flex gap-2 wide:order-2 wide:gap-3">
        <Money label="Trong ví" amount={money.cash} gain="text-fluorescent" loss="text-alarm" />
        {/* Nothing is owed yet at the start: this box appears the day it stops being true. */}
        {money.companyDebt > 0 && (
          <Money
            label="Công ty nợ bạn"
            amount={money.companyDebt}
            tone="text-paycheck"
            gain="text-alarm"
            loss="text-fluorescent"
          />
        )}
      </dl>
      <div className="bg-surface-900/85 flex gap-3 rounded-xl px-3 py-2 wide:order-3 wide:max-w-lg wide:flex-1 wide:gap-4 wide:px-4">
        <Meter label="Sức khỏe" value={mood.energy} tone="bg-fluorescent" />
        <Meter label="Căng thẳng" value={mood.stress} tone="bg-alarm" />
      </div>
    </header>
  );
};
