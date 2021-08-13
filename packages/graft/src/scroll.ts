import { UIEvent, useCallback } from 'react';
import { useRefreshHoverRegion } from './hover';
import { useRootScrollStoreApi } from './store/rootScroll';

/**
 * Enables a whole range of features using the scroll. It supports hover,
 * region map and allows to automatically scroll during a drag.
 */
/** @internal */
export function useScroll() {
  const onRefreshHover = useRefreshHoverRegion();
  const { setState: setRootScroll } = useRootScrollStoreApi();

  const onScroll = useCallback(
    (event: UIEvent) => {
      const position = {
        x: event.currentTarget.scrollLeft,
        y: event.currentTarget.scrollTop,
      };
      onRefreshHover(position);
      setRootScroll({ position });
    },
    [onRefreshHover, setRootScroll]
  );

  return onScroll;
}
