import { debounce } from 'lodash-es';
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

    const measureRegionInner = () =>
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

    const debounceMeasureRegion = debounce(
      measureRegionInner,
      // Debounce for atleast 200ms. We do not need the region size immediately.
      // This way we can reduce the number of updates to the store.
      200
    );

    // During a drag calculate the region in realtime.
    const measureRegion = (isDragScrolling: boolean) =>
      isDragScrolling ? measureRegionInner() : debounceMeasureRegion();

    // Measure it for the first time.
    measureRegion(false);

    const onResize = () => measureRegion(false);
    // Measure on window resize.
    window.addEventListener('resize', onResize);

    // Also measure the region if there is change anywhere in the component tree.
    const unsubscribeStore = subscribeEditor(
      () => {
        measureRegion(getRootScroll().isDragScrolling);
      },
      (state) => state.componentMap
    );

    // Update the region when there is scroll on the root component.
    const unsubscribeScroll = subscribeRootScroll((state) => measureRegion(state.isDragScrolling));

    return () => {
      window.removeEventListener('resize', onResize);
      unsubscribeStore();
      unsubscribeScroll();
    };
  }, [componentId, getRootScroll, immerSet, ref, subscribeEditor, subscribeRootScroll]);

  return setRef;
}
