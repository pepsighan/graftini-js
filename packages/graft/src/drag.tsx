import { DragEvent, EventHandler, useCallback } from 'react';
import { useComponentId } from './context';
import { DraggingState, useEditorStateInternal } from './schema';

/**
 * Hides the default drag preview. Solution adapted from https://stackoverflow.com/a/27990218/8550523.
 */
/** @internal */
export function hideDefaultDragPreview(event: DragEvent) {
  var crt = document.createElement('div');
  crt.style.backgroundColor = 'red';
  crt.style.display = 'none';
  document.body.appendChild(crt);
  event.dataTransfer.setDragImage(crt, 0, 0);
}

/**
 * Function to that is invoked when the component drawn on the canvas is to be dragged.
 */
/** @internal */
export function useOnDragStart(): EventHandler<DragEvent> {
  const immerSet = useEditorStateInternal(useCallback((state) => state.immerSet, []));
  const componentId = useComponentId();

  return useCallback(
    (event: DragEvent) => {
      event.stopPropagation();
      hideDefaultDragPreview(event);

      // The component is not yet being dragged. It will only start dragging once it moves a few pixels
      // away. We are just storing the data of the current component that is to be dragged.
      immerSet((state) => {
        const component = state.componentMap[componentId];
        state.draggedOver.componentKind = 'existing';
        state.draggedOver.component = component;
      });

      // Setting the isDragging flag a little late, so that the UI gets time to
      // snap the component to the cursor. If isDragging is set above, then it
      // does not snap in the given scenario:
      // When there is a canvas component and a non-canvas component & the non-canvas
      // container is dragged. This happens because the drop location expands immediately
      // causing the non-canvas component to be flung away (may be re-rendered or something).
      // Setting isDragging a little late gives time for it to snap and the drop location
      // is rendered afterwards.
      setTimeout(() => {
        immerSet((state) => {
          state.draggedOver.isDragging = DraggingState.DraggingInCanvas;
        });
      });
    },
    [componentId, immerSet]
  );
}

/**
 * Track the current position of the cursor during a drag operation.
 */
/** @internal */
export function useOnDrag() {
  const immerSet = useEditorStateInternal(useCallback((state) => state.immerSet, []));

  return useCallback(
    (event: DragEvent) => {
      immerSet((state) => {
        state.draggedOver.cursorPosition = {
          x: event.clientX,
          y: event.clientY,
        };
      });
    },
    [immerSet]
  );
}

/**
 * Add the component to the map once it has been dropped onto the canvas. If the mouse
 * is outside any canvas, ignore it.
 */
/** @internal */
export function useOnDragEnd() {
  const immerSet = useEditorStateInternal(useCallback((state) => state.immerSet, []));

  return useCallback(() => {
    immerSet((state) => {
      // TODO: Cause side-effects to the component positions here once drag stops.
    });
  }, [immerSet]);
}
