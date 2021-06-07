import { DragEvent, EventHandler, useCallback } from 'react';
import { useComponentId } from './context';
import { DropKind, nearestCanvasId } from './dropLocation';
import { useEditorStateInternal } from './store/schema';

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

      const { componentId: dropComponentId, dropKind } = dropRegion;
      const componentToDrop = state.draggedOver.component!;

      if (state.draggedOver.componentKind === 'new') {
        // Register this new component in the map.
        state.componentMap[componentToDrop.id] = componentToDrop;
      } else {
        // Remove the component from the older position.
        const index = state.componentMap[componentToDrop.parentId!].childrenNodes.indexOf(
          componentToDrop.id
        );
        state.componentMap[componentToDrop.parentId!].childrenNodes.splice(index);

        state.componentMap[componentToDrop.parentId!].childrenNodes = [
          ...state.componentMap[componentToDrop.parentId!].childrenNodes,
        ];
      }

      if (dropKind === DropKind.AddAsChild) {
        // Add the dragged component as a child of the component and it becomes the parent.
        const parentId = dropComponentId;
        state.componentMap[parentId].childrenNodes.push(componentToDrop.id);

        state.componentMap[parentId].childrenNodes = [
          ...state.componentMap[parentId].childrenNodes,
        ];
        state.componentMap[componentToDrop.id].parentId = parentId;
      } else {
        // Add the dragged component to the canvas before or after the componentId as it is
        // the sibling.
        const canvasId = nearestCanvasId(state.componentMap, dropComponentId);
        const index = state.componentMap[canvasId!].childrenNodes.indexOf(dropComponentId);

        if (dropKind === DropKind.AppendAsSibling) {
          state.componentMap[canvasId!].childrenNodes.splice(index + 1, 0, componentToDrop.id);
        } else {
          state.componentMap[canvasId!].childrenNodes.splice(index, 0, componentToDrop.id);
        }

        state.componentMap[canvasId!].childrenNodes = [
          ...state.componentMap[canvasId!].childrenNodes,
        ];
        state.componentMap[componentToDrop.id].parentId = canvasId;
      }

      state.draggedOver = { isDragging: false };
    });
  }, [immerSet]);
}
