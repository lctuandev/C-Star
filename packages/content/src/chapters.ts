export interface Chapter {
  number: number;
  title: string;
}

/** GDD §3. A scene belongs to the chapter its id starts with; crises belong to none. */
const CHAPTERS: Readonly<Record<string, Chapter>> = {
  ch1: { number: 1, title: 'Dream Big' },
  ch2: { number: 2, title: 'Payment Delay' },
  ch3: { number: 3, title: 'KPI Never Sleeps' },
  ch4: { number: 4, title: 'Six Months Later' },
  ch5: { number: 5, title: 'The Awakening' },
  ch6: { number: 6, title: 'The Last Day' },
};

export const chapterOf = (sceneId: string | null): Chapter | null =>
  CHAPTERS[sceneId?.split('-')[0] ?? ''] ?? null;
