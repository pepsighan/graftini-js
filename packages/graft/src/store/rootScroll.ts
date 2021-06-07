import create from 'zustand';

/** @internal */
type RootScrollStore = {
  top: number;
  left: number;
};

/**
 * A hook that shares the root component's scroll position to the rest of the app.
 */
/** @internal */
export const useRootScrollStore = create<RootScrollStore>(() => ({
  top: 0,
  left: 0,
}));
