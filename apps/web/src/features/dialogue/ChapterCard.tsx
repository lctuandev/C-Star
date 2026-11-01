import { chapterOf } from '@cstar/content';

/**
 * Passes over the scene at the start of a chapter and never stands in the way of a tap: the story
 * is what the player came to read. A new `key` per chapter is what plays it again.
 */
export const ChapterCard = ({ sceneId }: { sceneId: string | null }) => {
  const chapter = chapterOf(sceneId);
  if (!chapter) {
    return null;
  }
  return (
    <div
      key={chapter.number}
      aria-hidden
      className="animate-chapter pointer-events-none absolute inset-x-0 top-1/3 z-10 flex flex-col items-center gap-1 text-center [animation-fill-mode:both]"
    >
      <p className="text-paycheck text-sm font-extrabold tracking-[0.3em]">
        CHƯƠNG {chapter.number}
      </p>
      <p className="bg-surface-950/80 rounded-xl px-5 py-1 text-3xl font-extrabold lg:text-5xl">
        {chapter.title}
      </p>
    </div>
  );
};
