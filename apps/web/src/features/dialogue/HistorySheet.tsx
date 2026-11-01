'use client';

import type { CharacterId } from '@cstar/content';
import { Button } from '@/components/ui/Button';
import type { HistoryLine } from '@/features/play/game-store';
import { speakerLabel } from './Portrait';

interface HistorySheetProps {
  lines: readonly HistoryLine[];
  playerName: string;
  onClose: () => void;
}

export const HistorySheet = ({ lines, playerName, onClose }: HistorySheetProps) => (
  <div
    role="dialog"
    aria-label="Lịch sử thoại"
    className="bg-surface-950/95 animate-fade fixed inset-0 z-30 flex flex-col gap-3 p-4 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+1rem)] lg:left-auto lg:w-[30rem] lg:border-l lg:border-white/10 lg:p-6"
  >
    <h2 className="text-lg font-extrabold">Vừa rồi</h2>
    <ol className="flex flex-1 flex-col gap-3 overflow-y-auto">
      {lines.map((line) => (
        <li key={line.key} className="text-base leading-7">
          {line.speaker && (
            <span className="text-paycheck block text-sm font-bold">
              {speakerLabel(line.speaker as CharacterId, playerName)}
            </span>
          )}
          {line.text}
        </li>
      ))}
    </ol>
    <Button variant="quiet" onClick={onClose}>
      Đóng
    </Button>
  </div>
);
