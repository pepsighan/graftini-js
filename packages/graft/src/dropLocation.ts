import { DragEvent, EventHandler, useCallback } from 'react';
import { useCanvasId, useComponentId } from './context';
import {
  ChildAppendDirection,
  ComponentMap,
  Dimensions,
  DraggingState,
  isComponentWithinSubTree,
  useEditorStateInternal,
} from './schema';

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

        // console.log(dimensions, { clientX: event.clientX, clientY: event.clientY });
        console.log(
          resolveAppendPosition(
            lastChildDimensions ?? dimensions,
            event,
            canvasId,
            componentId,
            state.componentMap
          )
        );

        // Updating the state this way because immer only causes a re-render if there is a change.

        state.draggedOver.hoveredOver ??= {} as any;
        state.draggedOver.hoveredOver!.canvasId = canvasId;
        state.draggedOver.hoveredOver!.siblingId = componentId;

        state.draggedOver.hoveredOver!.dimensions ??= {} as any;
        setDimensions(state.draggedOver.hoveredOver!.dimensions!, dimensions);

        if (lastChildDimensions) {
          state.draggedOver.hoveredOver!.lastChildDimensions ??= {} as any;
          setDimensions(state.draggedOver.hoveredOver!.lastChildDimensions!, lastChildDimensions);
        } else {
          state.draggedOver.hoveredOver!.lastChildDimensions = null;
        }

        state.draggedOver.hoveredOver!.isCanvas = isCanvas;
        state.draggedOver.isDragging = DraggingState.DraggingInCanvas;
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
      const isChildren = event.relatedTarget
        ? event.currentTarget.contains(event.relatedTarget as any)
        : false;

      if (isChildren) {
        // This is actually not a drag leave because it enters the children of this component.
        return;
      }

      immerSet((state) => {
        state.draggedOver.hoveredOver = null;
        state.draggedOver.isDragging = DraggingState.DraggingOutsideCanvas;
      });
    },
    [immerSet]
  );

  return onDragLeave;
}

function setDimensions(dim: Dimensions, rect: DOMRect) {
  dim.width = rect.width;
  dim.height = rect.height;
  dim.top = rect.top;
  dim.right = rect.right;
  dim.left = rect.left;
  dim.bottom = rect.bottom;
}

enum AppendPosition {
  PrependAsSibling = 'prependAsSibling',
  PushAsChild = 'pushAsChild',
  AppendAsSibling = 'appendAsSibling',
}

/**
 * Finds the append position of the component based on where the cursor is hovering at.
 */
function resolveAppendPosition(
  dim: Dimensions,
  event: DragEvent,
  canvasId: string,
  componentId: string,
  componentMap: ComponentMap
): AppendPosition {
  let parentCanvasId = canvasId;

  const isCanvas = componentMap[componentId].isCanvas;
  if (isCanvas) {
    const parentId = componentMap[componentId].parentId;
    if (!parentId) {
      // You can only append as child since there is no parent. This happens only for
      // the root.
      return AppendPosition.PushAsChild;
    }

    parentCanvasId = parentId;
  }

  const childAppendDirection = componentMap[parentCanvasId].childAppendDirection!;

  let length: number;
  let normalizedPos: number;
  if (childAppendDirection === 'horizontal') {
    length = dim.width;
    normalizedPos = event.clientX - dim.left;
  } else {
    length = dim.height;
    normalizedPos = event.clientY - dim.top;
  }

  if (normalizedPos <= length / 3) {
    return AppendPosition.PrependAsSibling;
  }

  if (normalizedPos >= (2 * length) / 3) {
    return AppendPosition.AppendAsSibling;
  }

  return AppendPosition.PushAsChild;
}
