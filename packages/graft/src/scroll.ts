import { UIEvent, useCallback, useEffect } from 'react';
import { useRefreshHoverRegion } from './hover';
import { Position, useDraggedOverStoreApi } from './store/draggedOver';
import { ROOT_NODE_ID } from './store/editor';
import { ComponentRegionStore, useComponentRegionStore } from './store/regionMap';
import { useRootScrollStoreApi } from './store/rootScroll';

/**
 * Enables a whole range of features using the scroll. It supports hover,
 * region map and allows to automatically scroll during a drag.
 */
/** @internal */
export function useScroll(ref: HTMLElement | null) {
  useScrollWhenDragging(ref);

  const onRefreshHover = useRefreshHoverRegion();
  const { setState: setRootScroll } = useRootScrollStoreApi();

  const onScroll = useCallback(
    (event: UIEvent) => {
      const position = {
        x: event.currentTarget.scrollLeft,
        y: event.currentTarget.scrollTop,
      };
      onRefreshHover(position);

      setRootScroll({
        position: {
          left: position.x,
          top: position.y,
        },
      });
    },
    [onRefreshHover, setRootScroll]
  );

  return onScroll;
}

// This is the height of the region which triggers the scroll.
const edgeHeight = 64;

/**
 * Scrolls the canvas when an item is being dragged to the edge (top or bottom).
 */
/** @internal */
function useScrollWhenDragging(ref: HTMLElement | null) {
  const rootRegion = useComponentRegionStore(
    useCallback((state: ComponentRegionStore) => state.regionMap[ROOT_NODE_ID], [])
  );
  const { subscribe } = useDraggedOverStoreApi();
  const { getState: getRootScroll } = useRootScrollStoreApi();

  useEffect(() => {
    if (!ref || !rootRegion) {
      return;
    }

    return subscribe(
      (cursorPosition?: Position | null) => {
        if (!cursorPosition) {
          return;
        }

        const { isDragScrollEnabled } = getRootScroll();
        if (!isDragScrollEnabled) {
          return;
        }

        const diffTop = cursorPosition.y - rootRegion.y;
        if (diffTop <= edgeHeight) {
          ref.scrollBy({
            top: -2,
          });
          return;
        }

        const diffBottom = rootRegion.height + rootRegion.y - cursorPosition.y;
        if (diffBottom <= edgeHeight) {
          ref.scrollBy({
            top: 2,
          });
          return;
        }
      },
      (state) => (state.draggedOver.isDragging ? state.draggedOver.cursorPosition : null)
    );
  }, [getRootScroll, ref, rootRegion, subscribe]);
}
