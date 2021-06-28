import { MouseEventHandler, MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { useComponentId } from './context';
import { addComponentToDropRegion } from './dropLocation';
import { DraggedOverStore, useDraggedOverStore, useDraggedOverStoreApi } from './store/draggedOver';
import {
  EditorStore,
  isComponentWithinSubTree,
  useEditorStateInternal,
  useEditorStoreApiInternal,
} from './store/editor';
import { useRootScrollStoreApi } from './store/rootScroll';

/**
 * Function to that is invoked when the component drawn on the canvas is to be dragged.
 */
/** @internal */
export function useOnDragStart(): MouseEventHandler {
  const immerSet = useDraggedOverStore(useCallback((state) => state.immerSet, []));
  const { getState } = useEditorStoreApiInternal();
  const componentId = useComponentId();
  const { setState } = useRootScrollStoreApi();

  return useCallback(
    (event) => {
      event.stopPropagation();

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
  ref: MutableRefObject<HTMLElement | null>;
  onMouseUp: MouseEventHandler;
  onMouseMove: MouseEventHandler;
};

/**
 * Hook that lets graft know where to drop a dragged component.
 */
export function useDrop(): UseDrop {
  const ref = useRef<HTMLElement | null>(null);
  const onMouseUp = useOnDragEnd();
  const onMouseMove = useTrackDragCursorPosition();

  const immerSet = useDraggedOverStore(
    useCallback((state: DraggedOverStore) => state.immerSet, [])
  );
  useEffect(() => {
    // We want to stop the drag event immediately if the cursor is on the document
    // and the left click is no longer being pressed.
    // For cases where the cursor leaves the document itself directly from the canvas,
    // it is handled by [onMouseMove].
    const onMouseMoveOnDoc = (event: MouseEvent) => {
      if (!ref.current) {
        return;
      }

      if (isLeftMouseButtonPressed(event)) {
        // Nothing to do if the left button is still pressed.
        return;
      }

      if (ref.current.contains(event.target as any)) {
        // If the event comes from within the canvas, then it is to
        // be handled by the onMouseMove returned by this hook.
        return;
      }

      // Stop the drag event because the left click is no longer active.
      immerSet((state) => {
        state.draggedOver = {
          isDragging: false,
        };
      });

      // Run the drag end to run cleanups or otherwise.
      onMouseUp(event as any);
    };

    document.addEventListener('mousemove', onMouseMoveOnDoc);
    return () => {
      document.removeEventListener('mousemove', onMouseMoveOnDoc);
    };
  }, [immerSet, onMouseMove, onMouseUp]);

  return {
    ref,
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
  const immerSetEditor = useEditorStateInternal(useCallback((state) => state.immerSet, []));
  const { setState: setRootScroll } = useRootScrollStoreApi();

  return useCallback(() => {
    // No more drag scrolling.
    setRootScroll({
      isDragScrollEnabled: false,
    });

    const draggedOver = getDraggedOverState().draggedOver;

    // Update the dragged over state separately. But have cached the last value
    // on the variable above to be used when updating the editor itself.
    immerSetDraggedOver((draggedState: DraggedOverStore) => {
      const dropRegion = draggedState.draggedOver.dropRegion;
      if (!dropRegion) {
        draggedState.draggedOver = { isDragging: false };
        return;
      }

      draggedState.draggedOver = { isDragging: false };
    });

    immerSetEditor((editorState: EditorStore) => {
      const dropRegion = draggedOver.dropRegion;
      if (!dropRegion) {
        return;
      }

      const componentToDrop = draggedOver.component!;

      if (
        isComponentWithinSubTree(
          componentToDrop.id,
          dropRegion.componentId,
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

      addComponentToDropRegion(componentToDrop.id, dropRegion, editorState.componentMap);
    });
  }, [getDraggedOverState, immerSetDraggedOver, immerSetEditor, setRootScroll]);
}

/**
 * Track the current position of the cursor during a drag operation.
 */
/** @internal */
function useTrackDragCursorPosition(): MouseEventHandler {
  const immerSet = useDraggedOverStore(useCallback((state) => state.immerSet, []));
  const onDragEnd = useOnDragEnd();

  return useCallback(
    (event) => {
      immerSet((state: DraggedOverStore) => {
        const draggedOver = state.draggedOver;
        if (!draggedOver.isDragging) {
          return;
        }

        if (!isLeftMouseButtonPressed(event)) {
          console.log('stopping now');
          // This may happen when during the drag operation, mouse up event (drag end)
          // took place outside the event target. We need to stop the drag event manually
          // now. This is useful when the unpressed cursor enters the canvas directly.
          //
          // And this is not the complete picture. A similar logic is used on the
          // document as well at [useDrop].
          state.draggedOver = { isDragging: false };
          // Run the drag end to run cleanups or otherwise.
          onDragEnd(event);
          return;
        }

        draggedOver.cursorPosition ??= {} as any;
        draggedOver.cursorPosition!.x = event.clientX;
        draggedOver.cursorPosition!.y = event.clientY;
      });
    },
    [immerSet, onDragEnd]
  );
}

function isLeftMouseButtonPressed(event: React.MouseEvent | MouseEvent) {
  return event.buttons === 1 || event.button === 1;
}
