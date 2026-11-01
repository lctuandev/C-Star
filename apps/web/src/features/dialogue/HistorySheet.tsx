'use client';

import { characterInfo } from '@cstar/content';
import type { CharacterId } from '@cstar/content';
import { Button } from '@/components/ui/Button';
import type { HistoryLine } from '@/features/play/game-store';

interface HistorySheetProps {
  lines: readonly HistoryLine[];
  onClose: () => void;
}

export const HistorySheet = ({ lines, onClose }: HistorySheetProps) => (
  <div
    role="dialog"
    aria-label="Lịch sử thoại"
    className="bg-surface-950/95 fixed inset-0 z-10 flex flex-col gap-3 p-4 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+1rem)]"
  >
    <h2 className="text-lg font-extrabold">Vừa rồi</h2>
    <ol className="flex flex-1 flex-col gap-3 overflow-y-auto">
      {lines.map((line) => (
        <li key={line.key} className="text-base leading-7">
          {line.speaker && (
            <span className="text-fluorescent block text-sm font-bold">
              {characterInfo[line.speaker as CharacterId].name}
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
