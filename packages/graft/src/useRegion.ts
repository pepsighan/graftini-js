import { useCallback, useContext, useLayoutEffect, useState } from 'react';
import { RootRefContext } from './context';
import { useEditorStoreApi } from './store/editor';
import { ComponentRegionStore, useComponentRegionStore } from './store/regionMap';
import { useRootScrollStoreApi } from './store/rootScroll';

/**
 * A region on the canvas with the position and its dimension.
 */
export type Region = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Syncs the region that the component contains to the editor state.
 */
export function useSyncRegion(componentId: string) {
  const immerSet = useComponentRegionStore(useCallback((state) => state.immerSet, []));
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const { subscribe: subscribeEditor } = useEditorStoreApi();
  const { getState: getRootScroll } = useRootScrollStoreApi();

  const rootRef = useContext(RootRefContext);

  useLayoutEffect(() => {
    if (!ref) {
      return;
    }

    const measureRegion = () =>
      window.requestAnimationFrame(() => {
        const rect = ref.getBoundingClientRect();

        // It may be undefined if the region is ROOT itself or is not
        // initialized yet. Either way it is fine as the regions will
        // be eventually correct.
        const offsetLeft = rootRef?.offsetLeft ?? 0;
        const offsetTop = rootRef?.offsetTop ?? 0;

        immerSet((state: ComponentRegionStore) => {
          // Doing away with typescript here for extract performance from immer.
          state.regionMap[componentId] ??= {} as any;
          const region = state.regionMap[componentId];
          region.x = rect.x + offsetLeft;
          region.y = rect.y + offsetTop;
          region.width = rect.width;
          region.height = rect.height;
        });
      });

    // Measure it for the first time.
    measureRegion();
    // Measure on window resize.
    window.addEventListener('resize', measureRegion);
    // Also measure the region if there is change anywhere in the component tree.
    const unsubscribeStore = subscribeEditor(measureRegion, (state) => state.componentMap);

    return () => {
      window.removeEventListener('resize', measureRegion);
      unsubscribeStore();
    };
  }, [
    componentId,
    getRootScroll,
    immerSet,
    ref,
    rootRef?.offsetLeft,
    rootRef?.offsetTop,
    subscribeEditor,
  ]);

  return setRef;
}
