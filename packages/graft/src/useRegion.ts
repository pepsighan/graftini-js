import { useCallback, useLayoutEffect, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
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

  useLayoutEffect(() => {
    if (!ref) {
      return;
    }

    const measureRegion = () =>
      // The region is not measured immediately because it may still be rendering.
      setTimeout(() =>
        window.requestAnimationFrame(() => {
          const rect = ref.getBoundingClientRect();
          const scrollPosition = getRootScroll().position;

          immerSet((state: ComponentRegionStore) => {
            // Doing away with typescript here for extract performance from immer.
            state.regionMap[componentId] ??= {} as any;
            const region = state.regionMap[componentId];
            // Place the position relative to the document (iframe).
            region.x = rect.x + scrollPosition.x;
            region.y = rect.y + scrollPosition.y;
            region.width = rect.width;
            region.height = rect.height;
          });
        })
      );

    // Measure it for the first time.
    measureRegion();

    // Also measure if the body dimensions change. window.resize event worked previously for
    // the most part but it did not work on Safari when a new tab row appeared. So, depending
    // on the body dimensions works because body is restricted to `100vh` and it will change if new
    // tab appears.
    const ro = new ResizeObserver(measureRegion);
    ro.observe(document.body);

    // Also measure the region if there is change anywhere in the component tree.
    const unsubscribeStore = subscribeEditor(measureRegion, (state) => state.componentMap);

    return () => {
      ro.unobserve(document.body);
      unsubscribeStore();
    };
  }, [componentId, getRootScroll, immerSet, ref, subscribeEditor]);

  return setRef;
}
