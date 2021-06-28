import { MouseEventHandler, useCallback } from 'react';
import { DraggedOverStore, useDraggedOverStore } from './store/draggedOver';
import { HoverStore, useHoverStore } from './store/hover';

type UseCheckCursorOnIFrame = {
  onMouseEnter: MouseEventHandler;
  onMouseLeave: MouseEventHandler;
  onMouseMove: MouseEventHandler;
};

/**
 * This hook identifies if the cursor is on the iframe.
 */
export function useCheckCursorOnIFrame(): UseCheckCursorOnIFrame {
  // Separate stores to store different data points even though they are the same.
  const immerSetDraggedOver = useDraggedOverStore(
    useCallback((state: DraggedOverStore) => state.immerSet, [])
  );
  const immerSetHover = useHoverStore(useCallback((state: HoverStore) => state.immerSet, []));

  const onMouseEnter = useCallback(() => {
    immerSetHover((state) => {
      state.isOnIFrame = true;
    });

    immerSetDraggedOver((state) => {
      if (state.draggedOver.isDragging) {
        state.draggedOver.isOnIFrame = true;
      }
    });
  }, [immerSetDraggedOver, immerSetHover]);

  // Sometimes the cursor may already be within the canvas.
  const onMouseMove = useCallback(() => {
    immerSetHover((state) => {
      state.isOnIFrame = true;
    });

    immerSetDraggedOver((state) => {
      if (state.draggedOver.isDragging) {
        state.draggedOver.isOnIFrame = true;
      }
    });
  }, [immerSetDraggedOver, immerSetHover]);

  const onMouseLeave = useCallback(() => {
    immerSetHover((state) => {
      state.isOnIFrame = false;
    });

    immerSetDraggedOver((state) => {
      if (state.draggedOver.component) {
        state.draggedOver.isOnIFrame = false;
      }
    });
  }, [immerSetDraggedOver, immerSetHover]);

  return {
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
  };
}
