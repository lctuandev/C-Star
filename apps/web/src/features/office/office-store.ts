import { create } from 'zustand';
import type { Vec3 } from './office-layout';
import type { Frame } from './view-fit';

interface WalkOrder {
  to: Vec3;
  /** The action taken on arrival. */
  actionId: string;
}

interface OfficeStore {
  walk: WalkOrder | null;
  /** The part of the screen the UI leaves free for the scene. */
  frame: Frame | null;
  setFrame: (frame: Frame) => void;
  walkTo: (order: WalkOrder) => void;
  /** Takes the order away: the action runs once, even if a frame arrives twice. */
  arrive: () => WalkOrder | null;
}

/** The player's feet: screen state, never saved. The rules only ever hear the action. */
export const useOfficeStore = create<OfficeStore>((set, get) => ({
  walk: null,
  frame: null,
  setFrame: (frame) => set({ frame }),

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
