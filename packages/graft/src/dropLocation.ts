import { DragEvent, EventHandler, useCallback } from 'react';
import { useCanvasId, useComponentId } from './context';
import { useEditorStateInternal } from './schema';

/**
 * Returns an event handler which tracks whether a component is being dragged over the canvas.
 */
/** @internal */
export function useIdentifyCurrentDropLocation(): EventHandler<DragEvent> {
  const canvasId = useCanvasId();
  const parentId = useComponentId();
  const immerSet = useEditorStateInternal(useCallback((state) => state.immerSet, []));

  // Sets the current drag location.
  const onDragOver = useCallback(
    (event: DragEvent) => {
      // Only let the top most leaf component to be the drop location.
      event.stopPropagation();
      // After adding this `onDrop` works. Don't know why.
      event.preventDefault();

      const dimensions = event.currentTarget.getBoundingClientRect();

      let siblingId: string | null;
      if (canvasId === parentId) {
        // If the parent and the canvas are the same, then there are no siblings.
        // The component is to be pushed as a child of the canvas.
        siblingId = null;
      } else {
        // If the parent is not a canvas, then the component is to be added after this parent.
        // Hence, the parent becomes a sibling to the component being dropped.
        siblingId = parentId;
      }

      // Only set if component is being dragged over.
      immerSet((state) => {
        if (!state.draggedOver.isDragging) {
          return;
        }

        let isCanvas = false;
        if (!siblingId) {
          // When it is being dragged over no sibling, then it is being dragged over a canvas.
          isCanvas = true;
        } else {
          isCanvas = state.componentMap[siblingId!].isCanvas;
        }

        state.draggedOver.hoveredOver = {
          canvasId,
          siblingId,
          dimensions: {
            width: dimensions.width,
            height: dimensions.height,
            top: dimensions.top,
            right: dimensions.right,
            left: dimensions.left,
            bottom: dimensions.bottom,
          },
          isCanvas,
        };
      });
    },
    [canvasId, immerSet, parentId]
  );

  return onDragOver;
}

export function useOnDragLeave() {
  const immerSet = useEditorStateInternal(useCallback((state) => state.immerSet, []));

  // Resets the drag location.
  const onDragLeave = useCallback(
    (event: DragEvent) => {
      if (event.currentTarget === event.target) {
        immerSet((state) => {
          state.draggedOver.hoveredOver = null;
        });
      }
    },
    [immerSet]
  );

  return onDragLeave;
}
