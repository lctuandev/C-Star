import type { GameState } from '@cstar/game-core';
import Link from 'next/link';
import { formatMoneyShort } from '@/lib/format-money';

const Meter = ({ label, value, tone }: { label: string; value: number; tone: string }) => (
  <div className="flex flex-1 items-center gap-2">
    <span className="text-ink-secondary text-xs">{label}</span>
    <span
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="bg-surface-700 h-2 flex-1 overflow-hidden rounded-full"
    >
      <span className={`block h-full transition-[width] ${tone}`} style={{ width: `${value}%` }} />
    </span>
  </div>
);

/** Compact: the scene stays the main thing (ux-direction §1). */
export const Hud = ({ state }: { state: GameState }) => {
  const { calendar, money, mood } = state;

  return (
    <header className="bg-surface-900/90 flex flex-col gap-2 border-b border-white/10 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-bold">
          Tháng {calendar.month} · Tuần {calendar.week}
        </p>
        <Link href="/" className="text-ink-secondary flex min-h-11 items-center px-2 text-sm">
          Menu
        </Link>
      </div>
      <dl className="flex gap-3">
        <div className="bg-surface-800 flex-1 rounded-xl px-3 py-2">
          <dt className="text-ink-secondary text-xs">Trong ví</dt>
          <dd className="font-bold">{formatMoneyShort(money.cash)}</dd>
        </div>
        <div className="bg-surface-800 flex-1 rounded-xl px-3 py-2">
          <dt className="text-ink-secondary text-xs">Công ty nợ bạn</dt>
          <dd className="text-paycheck font-bold">{formatMoneyShort(money.companyDebt)}</dd>
        </div>
      </dl>
      <div className="flex gap-3">
        <Meter label="Sức" value={mood.energy} tone="bg-fluorescent" />
        <Meter label="Căng" value={mood.stress} tone="bg-alarm" />
      </div>
    </header>
  );
};
