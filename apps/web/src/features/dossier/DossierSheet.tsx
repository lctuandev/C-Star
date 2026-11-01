'use client';

import { characterInfo } from '@cstar/content';
import type { CharacterId } from '@cstar/content';
import { heldKpiOf, ledgerOf } from '@cstar/game-core';
import type { GameState } from '@cstar/game-core';
import { Button } from '@/components/ui/Button';
import { Portrait } from '@/features/dialogue/Portrait';
import { world } from '@/features/play/game-store';
import { formatMoneyShort } from '@/lib/format-money';
import { relationLabel } from './relation-label';

const PEOPLE: readonly CharacterId[] = [
  'boss',
  'manager',
  'deputy',
  'hr',
  'accountant',
  'dan',
  'uyen',
  'khoa',
];

const Outlook = ({ label, value, tone }: { label: string; value: number; tone: string }) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between text-sm">
      <span className="font-bold">{label}</span>
      <span className="text-ink-secondary tabular-nums">{value}</span>
    </div>
    <div
      role="meter"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2 overflow-hidden rounded-full bg-white/10"
    >
      <div className={`h-full rounded-full ${tone}`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

/** The months as the contract had them, beside what actually arrived. */
const PayrollBook = ({ state }: { state: GameState }) => {
  const rows = ledgerOf(state, world.rules);
  const heldKpi = heldKpiOf(state, world.rules);

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-extrabold">Sổ lương</h2>
      {rows.length === 0 ? (
        <p className="text-ink-secondary">Chưa tới kỳ lương đầu tiên.</p>
      ) : (
        <table className="paper-card w-full rounded-xl text-left text-sm tabular-nums">
          <thead>
            <tr className="opacity-70">
              <th scope="col" className="px-3 pt-3 pb-1 font-semibold">
                Tháng
              </th>
              <th scope="col" className="px-3 pt-3 pb-1 text-right font-semibold">
                Hợp đồng
              </th>
              <th scope="col" className="px-3 pt-3 pb-1 text-right font-semibold">
                Đã nhận
              </th>
              <th scope="col" className="px-3 pt-3 pb-1 text-right font-semibold">
                Thiếu
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ month, due, paid }) => (
              <tr key={month}>
                <th scope="row" className="px-3 py-1 font-bold">
                  {month}
                </th>
                <td className="px-3 py-1 text-right">{formatMoneyShort(due)}</td>
                <td className="px-3 py-1 text-right">{formatMoneyShort(paid)}</td>
                <td className="px-3 py-1 text-right font-bold">
                  {formatMoneyShort(Math.max(0, due - paid))}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="px-3 pt-1 pb-3">
                KPI đang bị giữ
              </td>
              <td className="px-3 pt-1 pb-3 text-right font-bold">{formatMoneyShort(heldKpi)}</td>
            </tr>
          </tfoot>
        </table>
      )}
    </section>
  );
};

interface DossierSheetProps {
  state: GameState;
  onClose: () => void;
}

/** What the player has kept, and where they stand: both decide how the story can end. */
export const DossierSheet = ({ state, onClose }: DossierSheetProps) => {
  const papers = world.evidence.filter((item) => state.evidence.includes(item.id));

  return (
    <div
      role="dialog"
      aria-label="Hồ sơ"
      className="bg-surface-950/95 animate-fade fixed inset-0 z-30 flex flex-col gap-5 overflow-y-auto p-4 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+1rem)] lg:left-auto lg:w-[30rem] lg:border-l lg:border-white/10 lg:p-6"
    >
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-extrabold">Bạn lúc này</h2>
        <Outlook label="Niềm tin vào công ty" value={state.outlook.trust} tone="bg-paycheck" />
        <Outlook label="Hiểu quyền lợi" value={state.outlook.awareness} tone="bg-fluorescent" />
      </section>

      <PayrollBook state={state} />

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-extrabold">
          Giấy tờ ({papers.length}/{world.evidence.length})
        </h2>
        {papers.length === 0 && (
          <p className="text-ink-secondary">Chưa có gì. Không ai nghĩ mình sẽ cần tới giấy tờ.</p>
        )}
        <ul className="flex flex-col gap-2">
          {papers.map((item) => (
            <li key={item.id} className="paper-card rounded-xl p-3">
              <p className="font-bold">{item.title}</p>
              <p className="text-sm">{item.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-extrabold">Mọi người</h2>
        <ul className="flex flex-col gap-2">
          {PEOPLE.map((id) => (
            <li key={id} className="flex items-center gap-3">
              <Portrait id={id} size="small" />
              <span className="flex-1 font-bold">{characterInfo[id].name}</span>
              <span className="text-ink-secondary text-sm">
                {relationLabel(state.relations[id] ?? 0)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Button variant="quiet" onClick={onClose}>
        Đóng
      </Button>
    </div>
  );
};
