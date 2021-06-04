import { DragEvent, EventHandler, useCallback } from 'react';
import { useCanvasId, useComponentId } from './context';
import { useEditorStateInternal } from './schema';

/**
 * Returns an event handler which tracks whether a component is being dragged over the canvas.
 */
/** @internal */
export function useIdentifyCurrentDropLocation(): EventHandler<DragEvent> {
  const canvasId = useCanvasId();
  const componentId = useComponentId();
  const immerSet = useEditorStateInternal(useCallback((state) => state.immerSet, []));

  // Sets the current drag location.
  const onDragOver = useCallback(
    (event: DragEvent) => {
      // Only let the top most leaf component to be the drop location.
      event.stopPropagation();
      // After adding this `onDrop` works. Don't know why.
      event.preventDefault();

      // Only set if component is being dragged over.
      immerSet((state) => {
        if (!state.draggedOver.isDragging) {
          return;
        }

        let siblingId = componentId;

        let isCanvas = false;
        if (!siblingId) {
          // When it is being dragged over no sibling, then it is being dragged over a canvas.
          isCanvas = true;
        } else {
          isCanvas = state.componentMap[siblingId!].isCanvas;
        }

        const dimensions = event.currentTarget.getBoundingClientRect();
        const lastChildDimensions = isCanvas
          ? (event.currentTarget.lastChild as any)?.getBoundingClientRect()
          : null;

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
          lastChildDimensions: lastChildDimensions
            ? {
                width: lastChildDimensions.width,
                height: lastChildDimensions.height,
                top: lastChildDimensions.top,
                right: lastChildDimensions.right,
                left: lastChildDimensions.left,
                bottom: lastChildDimensions.bottom,
              }
            : null,
          isCanvas,
        };

        state.draggedOver.cursorPosition = {
          x: event.clientX,
          y: event.clientY,
        };
      });
    },
    [canvasId, immerSet, componentId]
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
