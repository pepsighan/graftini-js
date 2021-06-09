import { DragEvent, EventHandler, useCallback, useContext } from 'react';
import { useComponentId } from './context';
import { IFrameCorrectionContext } from './correction';
import { DropKind, nearestCanvasId } from './dropLocation';
import { DraggedOverStore, useDraggedOverStore, useDraggedOverStoreApi } from './store/draggedOver';
import { EditorStore, useEditorStateInternal, useEditorStoreApiInternal } from './store/editor';
import { useRootScrollStoreApi } from './store/rootScroll';

/**
 * Hides the default drag preview. Solution adapted from https://stackoverflow.com/a/27990218/8550523.
 */
/** @internal */
export function showCustomDragPreview(event: DragEvent) {
  // The drag preview is already rendered at a separate place with the given id.
  const preview = document.getElementById('graft-drag-preview')!;
  event.dataTransfer.setDragImage(preview, 0, 0);
}

/**
 * Function to that is invoked when the component drawn on the canvas is to be dragged.
 */
/** @internal */
export function useOnDragStart(): EventHandler<DragEvent> {
  const immerSet = useDraggedOverStore(useCallback((state) => state.immerSet, []));
  const { getState } = useEditorStoreApiInternal();
  const componentId = useComponentId();
  const { setState } = useRootScrollStoreApi();

  return useCallback(
    (event: DragEvent) => {
      event.stopPropagation();
      showCustomDragPreview(event);

      // The component is not yet being dragged. It will only start dragging once it moves a few pixels
      // away. We are just storing the data of the current component that is to be dragged.
      immerSet((state: DraggedOverStore) => {
        const component = getState().componentMap[componentId];
        state.draggedOver.isDragging = true;
        state.draggedOver.component = component;
      });

      // Do not enable the drag scroll immediately. This can cause unwanted scroll when dragging the
      // from the edge.
      setTimeout(() => setState({ isDragScrollEnabled: true }), 500);
    },
    [componentId, getState, immerSet, setState]
  );
}

/**
 * Track the current position of the cursor during a drag operation.
 */
/** @internal */
export function useOnDrag() {
  const immerSet = useDraggedOverStore(useCallback((state) => state.immerSet, []));
  const correction = useContext(IFrameCorrectionContext);

  return useCallback(
    (event: DragEvent) => {
      immerSet((state: DraggedOverStore) => {
        const draggedOver = state.draggedOver;

        draggedOver.cursorPosition = {
          x: !draggedOver.isOnRoot && correction ? event.clientX - correction.x : event.clientX,
          y: !draggedOver.isOnRoot && correction ? event.clientY - correction.y : event.clientY,
        };
      });
    },
    [correction, immerSet]
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
  const immerSetDraggedOver = useDraggedOverStore(useCallback((state) => state.immerSet, []));
  const { getState: getDraggedOverState } = useDraggedOverStoreApi();
  const immerSetEditor = useEditorStateInternal(useCallback((state) => state.immerSet, []));
  const { setState: setRootScroll } = useRootScrollStoreApi();

  return useCallback(() => {
    // No more drag scrolling.
    setRootScroll({
      isDragScrollEnabled: false,
      isDragScrolling: false,
    });

    const draggedOver = getDraggedOverState().draggedOver;

    // Update the dragged over state separately. But have cached the last value
    // on the variable above to be used when updating the editor itself.
    immerSetDraggedOver((draggedState: DraggedOverStore) => {
      const dropRegion = draggedState.draggedOver.dropRegion;
      if (!dropRegion) {
        draggedState.draggedOver = {
          isDragging: false,
          isOnRoot: false,
        };
        return;
      }

      draggedState.draggedOver = { isDragging: false, isOnRoot: false };
    });

    immerSetEditor((editorState: EditorStore) => {
      const dropRegion = draggedOver.dropRegion;
      if (!dropRegion) {
        return;
      }

      const { componentId: dropComponentId, dropKind } = dropRegion;
      const componentToDrop = draggedOver.component!;

      if (dropComponentId === componentToDrop.id) {
        // Its dropping itself onto itself. Do nothing.
        return;
      }

      // Remove the component from the older position.
      const index = editorState.componentMap[componentToDrop.parentId!].childrenNodes.indexOf(
        componentToDrop.id
      );
      editorState.componentMap[componentToDrop.parentId!].childrenNodes.splice(index, 1);

      editorState.componentMap[componentToDrop.parentId!].childrenNodes = [
        ...editorState.componentMap[componentToDrop.parentId!].childrenNodes,
      ];

      if (dropKind === DropKind.AddAsChild) {
        // Add the dragged component as a child of the component and it becomes the parent.
        const parentId = dropComponentId;
        editorState.componentMap[parentId].childrenNodes.push(componentToDrop.id);

        editorState.componentMap[parentId].childrenNodes = [
          ...editorState.componentMap[parentId].childrenNodes,
        ];
        editorState.componentMap[componentToDrop.id].parentId = parentId;
      } else {
        // Add the dragged component to the canvas before or after the componentId as it is
        // the sibling.
        const canvasId = nearestCanvasId(editorState.componentMap, dropComponentId);
        const index = editorState.componentMap[canvasId!].childrenNodes.indexOf(dropComponentId);

        if (dropKind === DropKind.AppendAsSibling) {
          editorState.componentMap[canvasId!].childrenNodes.splice(
            index + 1,
            0,
            componentToDrop.id
          );
        } else {
          editorState.componentMap[canvasId!].childrenNodes.splice(index, 0, componentToDrop.id);
        }

        editorState.componentMap[canvasId!].childrenNodes = [
          ...editorState.componentMap[canvasId!].childrenNodes,
        ];
        editorState.componentMap[componentToDrop.id].parentId = canvasId;
      }
    });
  }, [getDraggedOverState, immerSetDraggedOver, immerSetEditor, setRootScroll]);
}
