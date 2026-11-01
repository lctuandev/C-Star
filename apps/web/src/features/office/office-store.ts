import { create } from 'zustand';
import type { Vec3 } from './office-layout';

interface WalkOrder {
  to: Vec3;
  /** The action taken on arrival. */
  actionId: string;
}

interface OfficeStore {
  walk: WalkOrder | null;
  walkTo: (order: WalkOrder) => void;
  /** Takes the order away: the action runs once, even if a frame arrives twice. */
  arrive: () => WalkOrder | null;
}

/** The player's feet: screen state, never saved. The rules only ever hear the action. */
export const useOfficeStore = create<OfficeStore>((set, get) => ({
  walk: null,

  walkTo: (order) => {
    if (!get().walk) {
      set({ walk: order });
    }
  },

  arrive: () => {
    const { walk } = get();
    set({ walk: null });
    return walk;
  },
}));
