import { useCallback, useLayoutEffect, useState } from 'react';
import { useEditorStoreApiInternal } from './store/editor';
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
  const { subscribe: subscribeEditor } = useEditorStoreApiInternal();
  const { subscribe: subscribeRootScroll } = useRootScrollStoreApi();
  const { getState: getRootScroll } = useRootScrollStoreApi();

  useLayoutEffect(() => {
    if (!ref) {
      return;
    }

    const measureRegion = () =>
      window.requestAnimationFrame(() => {
        const rect = ref.getBoundingClientRect();

        immerSet((state: ComponentRegionStore) => {
          // Doing away with typescript here for extract performance from immer.
          state.regionMap[componentId] ??= {} as any;
          const region = state.regionMap[componentId];
          region.x = rect.x;
          region.y = rect.y;
          region.width = rect.width;
          region.height = rect.height;
        });
      });

    // Measure it for the first time.
    measureRegion();

    const onResize = () => measureRegion();
    // Measure on window resize.
    window.addEventListener('resize', onResize);

    // Also measure the region if there is change anywhere in the component tree.
    const unsubscribeStore = subscribeEditor(
      () => measureRegion(),
      (state) => state.componentMap
    );

    // Update the region when there is scroll on the root component.
    const unsubscribeScroll = subscribeRootScroll((state) => measureRegion());

    return () => {
      window.removeEventListener('resize', onResize);
      unsubscribeStore();
      unsubscribeScroll();
    };
  }, [componentId, getRootScroll, immerSet, ref, subscribeEditor, subscribeRootScroll]);

  return setRef;
}
