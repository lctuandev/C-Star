'use client';

import type { CharacterId } from '@cstar/content';
import type { NodeView } from '@cstar/game-core';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { audioEngine } from '@/features/audio/audio-engine';
import { Portrait, speakerLabel } from './Portrait';
import { useTypewriter } from './use-typewriter';

interface DialogueBoxProps {
  view: NodeView;
  playerName?: string;
  onAdvance: () => void;
  onChoose: (choiceId: string) => void;
}

/** A new `key` per line, so the typewriter starts over. */
export const DialogueBox = ({ view, playerName = '', onAdvance, onChoose }: DialogueBoxProps) => {
  const { shown, done, finish } = useTypewriter(view.text);
  const speaker = view.speaker as CharacterId | null;
  const name = speaker ? speakerLabel(speaker, playerName) : null;

  // A tick every other glyph: the voice of the line, not a rattle.
  useEffect(() => {
    if (!done && shown.length % 2 === 1 && !shown.endsWith(' ')) {
      audioEngine.typeFor(view.speaker);
    }
  }, [shown, done, view.speaker]);

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
    <section className="from-surface-950 via-surface-950/90 flex flex-col gap-3 bg-gradient-to-t to-transparent p-4 pt-12 pb-[calc(env(safe-area-inset-bottom)+1rem)] wide:pb-6">
      {/* The box below only says what a tap does: this is what screen readers read out. */}
      <p role="status" className="sr-only">
        {name ? `${name}: ${view.text}` : view.text}
      </p>
      <button
        type="button"
        onClick={tap}
        aria-label={done ? 'Đọc tiếp' : 'Hiện hết câu'}
        className={`animate-rise relative flex min-h-36 w-full flex-col gap-2 rounded-2xl p-4 text-left wide:p-5 ${
          speaker ? 'paper-card pt-5' : 'bg-surface-800 border border-white/10'
        }`}
      >
        {speaker && (
          <span className="absolute -top-9 left-4 flex items-end gap-3 wide:-top-11">
            <Portrait id={speaker} />
            <span className="bg-paycheck text-surface-950 mb-1 rounded-lg px-3 py-0.5 font-extrabold">
              {name}
            </span>
          </span>
        )}
        {/* The whole line is laid out from the start, so the box does not grow as it types. */}
        <span
          className={`relative text-base leading-7 wide:text-lg wide:leading-8 ${speaker ? 'mt-6 wide:mt-7' : ''}`}
        >
          <span className="invisible">{view.text}</span>
          <span className="absolute inset-0">{shown}</span>
        </span>
        {done && view.canAdvance && (
          <span aria-hidden className="self-end text-sm opacity-60">
            Chạm để đọc tiếp
          </span>
        )}
      </button>

      {done && view.choices.length > 0 && (
        <div
          role="group"
          aria-label="Lựa chọn"
          className="flex flex-col gap-2 wide:grid wide:grid-cols-2"
        >
          {view.choices.map((choice) => (
            <div key={choice.id} className="animate-rise flex flex-col gap-1">
              <Button
                variant={choice.available ? 'primary' : 'quiet'}
                disabled={!choice.available}
                className="justify-start text-left"
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
