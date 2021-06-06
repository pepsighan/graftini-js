import { useCallback, useLayoutEffect, useState } from 'react';
import { useEditorStateInternal } from './schema';

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
  const immerSet = useEditorStateInternal(useCallback((state) => state.immerSet, []));
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!ref) {
      return;
    }

    const measureRegion = () =>
      window.requestAnimationFrame(() => {
        const rect = ref.getBoundingClientRect();

        immerSet((state) => {
          // Doing away with typescript here for extract performance from immer.
          state.regionMap[componentId] ??= {} as any;
          const region = state.regionMap[componentId];
          region.x = rect.x;
          region.y = rect.y;
          region.width = rect.width;
          region.height = rect.height;
        });
      });

    measureRegion();

    window.addEventListener('resize', measureRegion);
    window.addEventListener('scroll', measureRegion);

    return () => {
      window.removeEventListener('resize', measureRegion);
      window.removeEventListener('scroll', measureRegion);
    };

    // The region may need to be updated based on some external factors.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentId, immerSet, ref]);

  return setRef;
}
