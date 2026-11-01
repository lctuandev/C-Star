import type { AssetStats } from './stats.ts';

export type Budget = Record<keyof AssetStats, number>;

export interface Overrun {
  metric: keyof AssetStats;
  actual: number;
  limit: number;
}

/** Everything over the limit at once, so a failing build shows the whole bill. */
export const overruns = (stats: AssetStats, budget: Budget): Overrun[] =>
  (Object.keys(budget) as (keyof AssetStats)[]).flatMap((metric) =>
    stats[metric] > budget[metric]
      ? [{ metric, actual: stats[metric], limit: budget[metric] }]
      : [],
  );
