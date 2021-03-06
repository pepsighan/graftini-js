import { MouseEventHandler, useCallback } from 'react';
import { useComponentId } from './context';
import { addComponentToDropRegion } from './dropLocation';
import {
  DraggedOverStore,
  Position,
  useDraggedOverStore,
  useDraggedOverStoreApi,
} from './store/draggedOver';
import {
  EditorStore,
  isComponentWithinSubTree,
  useEditorStore,
  useEditorStoreApi,
} from './store/editor';
import { useRootScrollStoreApi } from './store/rootScroll';

/**
 * Function to that is invoked when the component drawn on the canvas is to be dragged.
 */
/** @internal */
export function useOnDragStart(): MouseEventHandler {
  const immerSet = useDraggedOverStore(useCallback((state) => state.immerSet, []));
  const { getState } = useEditorStoreApi();
  const componentId = useComponentId();
  const { setState } = useRootScrollStoreApi();

  return useCallback(
    (event) => {
      event.stopPropagation();

      if (event.buttons !== 1) {
        // If the left mouse button is not clicked ignore this.
        return;
      }

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

type UseDrop = {
  onMouseUp: MouseEventHandler;
  onMouseMove: MouseEventHandler;
};

/**
 * Hook that lets graft know where to drop a dragged component.
 */
export function useDrop(): UseDrop {
  const onMouseUp = useOnDragEnd();
  const onMouseMove = useTrackDragCursorPosition();

  return {
    onMouseUp,
    onMouseMove,
  };
}

/**
 * Add the component to the map once it has been dropped onto the canvas. If the mouse
 * is outside any canvas, ignore it.
 */
/** @internal */
function useOnDragEnd(): MouseEventHandler {
  const immerSetDraggedOver = useDraggedOverStore(useCallback((state) => state.immerSet, []));
  const { getState: getDraggedOverState } = useDraggedOverStoreApi();
  const immerSetEditor = useEditorStore(useCallback((state) => state.immerSet, []));
  const { setState: setRootScroll } = useRootScrollStoreApi();

  return useCallback(() => {
    // No more drag scrolling.
    setRootScroll({
      isDragScrollEnabled: false,
    });

    const draggedOver = getDraggedOverState().draggedOver;

    const dropRegion = draggedOver.dropRegion;
    const component = draggedOver.component;
    const cursorPosition = draggedOver.cursorPosition;
    const isOnIFrame = draggedOver.isOnIFrame;

    const isInvalidDrop =
      !dropRegion ||
      !component ||
      !cursorPosition ||
      !isOnIFrame ||
      !is3pxAway(draggedOver.initialCursorPosition!, cursorPosition);

    // Update the dragged over state separately. But have cached the last value
    // on the variable above to be used when updating the editor itself.
    immerSetDraggedOver((draggedState: DraggedOverStore) => {
      if (isInvalidDrop) {
        draggedState.draggedOver = { isDragging: false };
        return;
      }

      draggedState.draggedOver = { isDragging: false };
    });

    immerSetEditor((editorState: EditorStore) => {
      const dropRegion = draggedOver.dropRegion;
      if (isInvalidDrop) {
        return;
      }

      const componentToDrop = draggedOver.component!;

      if (
        isComponentWithinSubTree(
          componentToDrop.id,
          dropRegion!.componentId,
          editorState.componentMap
        )
      ) {
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

      addComponentToDropRegion(componentToDrop.id, dropRegion!, editorState.componentMap);
    });
  }, [getDraggedOverState, immerSetDraggedOver, immerSetEditor, setRootScroll]);
}

/**
 * Track the current position of the cursor during a drag operation.
 */
/** @internal */
function useTrackDragCursorPosition(): MouseEventHandler {
  const immerSet = useDraggedOverStore(useCallback((state) => state.immerSet, []));

  return useCallback(
    (event) => {
      if (event.buttons !== 1) {
        // If the left mouse button is not clicked ignore this.
        return;
      }

      immerSet((state: DraggedOverStore) => {
        const draggedOver = state.draggedOver;
        if (!draggedOver.isDragging) {
          return;
        }

        if (!draggedOver.initialCursorPosition) {
          draggedOver.initialCursorPosition = { x: event.clientX, y: event.clientY };
        }

        draggedOver.cursorPosition ??= {} as any;
        draggedOver.cursorPosition!.x = event.clientX;
        draggedOver.cursorPosition!.y = event.clientY;
      });
    },
    [immerSet]
  );
}

/**
 * Only when the cursor has dragged 3px from the original point can it be deemed
 * to be a drag operation.
 */
export function is3pxAway(initial: Position, now: Position) {
  return Math.abs(initial.x - now.x) > 3 || Math.abs(initial.y - now.y) > 3;
}
