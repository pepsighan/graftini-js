import { DragEvent, EventHandler, useCallback } from 'react';
import { useCanvasId, useComponentId } from './context';
import { isComponentWithinSubTree, useEditorStateInternal } from './schema';

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

        state.draggedOver.isDraggingOnCanvas = true;

        const isDraggingOnItself = isComponentWithinSubTree(
          state.draggedOver.component!.id,
          componentId,
          state.componentMap
        );
        if (isDraggingOnItself) {
          // If dragging over itself, it has no effect.
          state.draggedOver.hoveredOver = null;
          return;
        }

        const isCanvas = state.componentMap[componentId!].isCanvas;

        const dimensions = event.currentTarget.getBoundingClientRect();
        const lastChildDimensions = isCanvas
          ? (event.currentTarget.lastChild as any)?.getBoundingClientRect()
          : null;

        // Updating the state this way because immer only causes a re-render if there is a change.

        state.draggedOver.hoveredOver ??= {} as any;
        state.draggedOver.hoveredOver!.canvasId = canvasId;
        state.draggedOver.hoveredOver!.siblingId = componentId;

        state.draggedOver.hoveredOver!.dimensions ??= {} as any;
        state.draggedOver.hoveredOver!.dimensions.width = dimensions.width;
        state.draggedOver.hoveredOver!.dimensions.height = dimensions.height;
        state.draggedOver.hoveredOver!.dimensions.top = dimensions.top;
        state.draggedOver.hoveredOver!.dimensions.right = dimensions.right;
        state.draggedOver.hoveredOver!.dimensions.left = dimensions.left;
        state.draggedOver.hoveredOver!.dimensions.bottom = dimensions.bottom;

        if (lastChildDimensions) {
          state.draggedOver.hoveredOver!.lastChildDimensions ??= {} as any;
          state.draggedOver.hoveredOver!.lastChildDimensions!.width = lastChildDimensions.width;
          state.draggedOver.hoveredOver!.lastChildDimensions!.height = lastChildDimensions.height;
          state.draggedOver.hoveredOver!.lastChildDimensions!.top = lastChildDimensions.top;
          state.draggedOver.hoveredOver!.lastChildDimensions!.right = lastChildDimensions.right;
          state.draggedOver.hoveredOver!.lastChildDimensions!.left = lastChildDimensions.left;
          state.draggedOver.hoveredOver!.lastChildDimensions!.bottom = lastChildDimensions.bottom;
        } else {
          state.draggedOver.hoveredOver!.lastChildDimensions = null;
        }

        state.draggedOver.hoveredOver!.isCanvas = isCanvas;
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
        const isChildren = event.relatedTarget
          ? event.currentTarget.contains(event.relatedTarget as any)
          : false;

        if (isChildren) {
          // This is actually not a drag leave because it enters the children of this component.
          return;
        }

        immerSet((state) => {
          state.draggedOver.hoveredOver = null;
          state.draggedOver.isDraggingOnCanvas = false;
        });
      }
    },
    [immerSet]
  );

  return onDragLeave;
}
