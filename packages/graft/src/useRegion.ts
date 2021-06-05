import { DependencyList, Ref, useCallback, useLayoutEffect, useState } from 'react';
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

type RefSetter = (ref: Ref<HTMLElement>) => void;

/**
 * Syncs the region that the component contains to the editor state.
 */
export function useSyncRegion(componentId: string, deps?: DependencyList): [RefSetter, Region] {
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
          state.componentMap[componentId].region ??= {} as any;
          const region = state.componentMap[componentId].region;
          region.x = rect.x;
          region.y = rect.y;
          region.width = rect.width;
          region.height = rect.height;
        });
      });

    window.addEventListener('resize', measureRegion);
    window.addEventListener('scroll', measureRegion);

    return () => {
      window.removeEventListener('resize', measureRegion);
      window.removeEventListener('scroll', measureRegion);
    };

    // The region may need to be updated based on some external factors.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentId, immerSet, ref, ...(deps ?? [])]);

  return [setRef as RefSetter, { x: 0, y: 0, width: 0, height: 0 }];
}
