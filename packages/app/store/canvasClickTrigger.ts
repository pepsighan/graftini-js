import create from 'zustand';

/**
 * This hook is used to notify subscribers if there was a click on the iframe canvas.
 * The change value is not useful, only that it changes when triggered.
 */
export const useCanvasClickTrigger = create((set, get) => ({
  change: false,
  trigger: () => set({ change: !get() }),
}));
