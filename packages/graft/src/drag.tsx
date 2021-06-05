import { DragEvent, EventHandler, useCallback } from 'react';
import { useComponentId } from './context';
import { DropKind, nearestCanvasId } from './dropLocation';
import { useEditorStateInternal } from './schema';

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
 * Fixes the issue with regards to cursor position during a drag operation.
 */
export function useOnDragOver() {
  return useCallback((event: DragEvent) => {
    // This lets the onDrag to not reset the co-ordinates to (0,0) when dropping.
    event.preventDefault();
  }, []);
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
      const dropRegion = state.draggedOver.dropRegion;
      if (!dropRegion) {
        state.draggedOver = {
          isDragging: false,
        };
        return;
      }

      const { componentId, dropKind } = dropRegion;
      const component = state.draggedOver.component!;

      if (state.draggedOver.componentKind === 'new') {
        // Register this new component in the map.
        state.componentMap[component.id] = component;
      } else {
        // Remove the component from the older position.
        const index = state.componentMap[component.parentId!].childrenNodes.indexOf(component.id);
        state.componentMap[component.parentId!].childrenNodes.splice(index);

        state.componentMap[component.parentId!].childrenNodes = [
          ...state.componentMap[component.parentId!].childrenNodes,
        ];
      }

      if (dropKind === DropKind.AddAsChild) {
        // Add the dragged component as a child of the component and it becomes the parent.
        const parentId = componentId;
        state.componentMap[parentId].childrenNodes.push(state.draggedOver.component!.id);

        state.componentMap[parentId].childrenNodes = [
          ...state.componentMap[parentId].childrenNodes,
        ];
      } else {
        // Add the dragged component to the canvas before or after the componentId as it is
        // the sibling.
        const canvasId = nearestCanvasId(state.componentMap, componentId);
        const index = state.componentMap[canvasId!].childrenNodes.indexOf(componentId);

        if (dropKind === DropKind.AppendAsSibling) {
          state.componentMap[canvasId!].childrenNodes.splice(index, 0, componentId);
        } else {
          state.componentMap[canvasId!].childrenNodes.splice(index + 1, 0, componentId);
        }

        state.componentMap[canvasId!].childrenNodes = [
          ...state.componentMap[canvasId!].childrenNodes,
        ];
      }

      state.draggedOver = { isDragging: false };
    });
  }, [immerSet]);
}
