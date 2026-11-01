'use client';

import { characterInfo } from '@cstar/content';
import type { CharacterId } from '@cstar/content';
import type { NodeView } from '@cstar/game-core';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Portrait } from './Portrait';
import { useTypewriter } from './use-typewriter';

interface DialogueBoxProps {
  view: NodeView;
  onAdvance: () => void;
  onChoose: (choiceId: string) => void;
}

/** A new `key` per line, so the typewriter starts over. */
export const DialogueBox = ({ view, onAdvance, onChoose }: DialogueBoxProps) => {
  const { shown, done, finish } = useTypewriter(view.text);
  const character = view.speaker ? characterInfo[view.speaker as CharacterId] : null;

  const tap = () => {
    if (!done) {
      finish();
    } else if (view.canAdvance) {
      onAdvance();
    }
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'Enter') {
        if (event.target instanceof HTMLButtonElement) {
          return;
        }
        event.preventDefault();
        tap();
      }
      const choice = view.choices[Number(event.key) - 1];
      if (done && choice?.available) {
        onChoose(choice.id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <section className="flex flex-col gap-3 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
      {/* The box below only says what a tap does: this is what screen readers read out. */}
      <p role="status" className="sr-only">
        {character ? `${character.name}: ${view.text}` : view.text}
      </p>
      <button
        type="button"
        onClick={tap}
        aria-label={done ? 'Đọc tiếp' : 'Hiện hết câu'}
        className="bg-surface-800 flex min-h-36 w-full flex-col gap-2 rounded-2xl border border-white/10 p-4 text-left"
      >
        {character && (
          <span className="flex items-center gap-3 font-bold">
            <Portrait character={character} />
            {character.name}
          </span>
        )}
        {/* The whole line is laid out from the start, so the box does not grow as it types. */}
        <span className="relative text-base leading-7">
          <span className="invisible">{view.text}</span>
          <span className="absolute inset-0">{shown}</span>
        </span>
        {done && view.canAdvance && (
          <span aria-hidden className="text-ink-muted self-end text-sm">
            Chạm để đọc tiếp
          </span>
        )}
      </button>

      {done && view.choices.length > 0 && (
        <div className="flex flex-col gap-3">
          {view.choices.map((choice) => (
            <div key={choice.id} className="flex flex-col gap-1">
              <Button
                variant={choice.available ? 'primary' : 'quiet'}
                disabled={!choice.available}
                className="text-left"
                onClick={() => onChoose(choice.id)}
              >
                {choice.text}
              </Button>
              {choice.lockedReason && (
                <p className="text-ink-muted px-1 text-sm">{choice.lockedReason}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
