import { MouseEventHandler, useCallback } from 'react';
import { DraggedOverStore, useDraggedOverStore } from './store/draggedOver';

type UseCheckCursorOnIFrame = {
  onMouseEnter: MouseEventHandler;
  onMouseLeave: MouseEventHandler;
  onMouseMove: MouseEventHandler;
};

/**
 * This hook identifies if the cursor is on the iframe.
 */
export function useCheckCursorOnIFrame(): UseCheckCursorOnIFrame {
  const immerSet = useDraggedOverStore(
    useCallback((state: DraggedOverStore) => state.immerSet, [])
  );

  // We only check if the cursor is on iframe during a drag operation.
  const onMouseEnter = useCallback(() => {
    immerSet((state) => {
      if (state.draggedOver.isDragging) {
        state.draggedOver.isOnIFrame = true;
      }
    });
  }, [immerSet]);

  // Sometimes the cursor may already be within the canvas.
  const onMouseMove = useCallback(() => {
    immerSet((state) => {
      if (state.draggedOver.isDragging) {
        state.draggedOver.isOnIFrame = true;
      }
    });
  }, [immerSet]);

  const onMouseLeave = useCallback(() => {
    immerSet((state) => {
      if (state.draggedOver.component) {
        state.draggedOver.isOnIFrame = false;
      }
    });
  }, [immerSet]);

  return {
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
  };
}
