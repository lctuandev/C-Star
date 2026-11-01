'use client';

import { characterInfo } from '@cstar/content';
import type { CharacterId } from '@cstar/content';
import type { GameState } from '@cstar/game-core';
import { Button } from '@/components/ui/Button';
import { Portrait } from '@/features/dialogue/Portrait';
import { world } from '@/features/play/game-store';
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
