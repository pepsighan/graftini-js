import { useCallback, useEffect } from 'react';
import { Position, useDraggedOverStoreApi } from './store/draggedOver';
import { ROOT_NODE_ID } from './store/editor';
import { ComponentRegionStore, useComponentRegionStore } from './store/regionMap';
import { useRootScrollStoreApi } from './store/rootScroll';

// This is the height of the region which triggers the scroll.
const edgeHeight = 64;

/**
 * Scrolls the canvas when an item is being dragged to the edge (top or bottom).
 */
export function useScrollWhenDragging(ref: HTMLElement | null) {
  const rootRegion = useComponentRegionStore(
    useCallback((state: ComponentRegionStore) => state.regionMap[ROOT_NODE_ID], [])
  );
  const { subscribe } = useDraggedOverStoreApi();
  const { getState: getRootScroll, setState: setRootScroll } = useRootScrollStoreApi();

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
          setRootScroll({ isDragScrolling: true });
          return;
        }

        const diffBottom = rootRegion.height + rootRegion.y - cursorPosition.y;
        if (diffBottom <= edgeHeight) {
          ref.scrollBy({
            top: 2,
          });
          setRootScroll({ isDragScrolling: true });
          return;
        }

        // No longer scrolling.
        setRootScroll({ isDragScrolling: false });
      },
      (state) =>
        state.draggedOver.isDragging && state.draggedOver.isOnRoot
          ? state.draggedOver.cursorPosition
          : null
    );
  }, [getRootScroll, ref, rootRegion, setRootScroll, subscribe]);
}