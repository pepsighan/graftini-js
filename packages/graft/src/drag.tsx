import { DragEvent, EventHandler, useCallback } from 'react';
import { useComponentId } from './context';
import { useEditorStateInternal } from './schema';

/**
 * Function to that is invoked when the component drawn on the canvas is to be dragged.
 */
/** @internal */
export function useOnComponentDrag(): EventHandler<DragEvent> {
  const immerSet = useEditorStateInternal(useCallback((state) => state.immerSet, []));
  const componentId = useComponentId();

  return useCallback(
    (event: DragEvent) => {
      event.stopPropagation();

      // The component is not yet being dragged. It will only start dragging once it moves a few pixels
      // away. We are just storing the data of the current component that is to be dragged.
      immerSet((state) => {
        const component = state.componentMap[componentId];
        const parent = state.componentMap[component.parentId!];
        const componentIndex = parent.childrenNodes.indexOf(componentId);

        state.draggedOver.componentKind = 'existing';
        state.draggedOver.component = component;
        state.draggedOver.previousLocation = {
          parentId: parent.id,
          index: componentIndex,
        };
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
          state.draggedOver.isDragging = true;
        });
      });
    },
    [componentId, immerSet]
  );
}

/**
 * Add the component to the map once it has been dropped onto the canvas. If the mouse
 * is outside any canvas, ignore it.
 */
/** @internal */
export function useOnDrop() {
  const immerSet = useEditorStateInternal(useCallback((state) => state.immerSet, []));

  return useCallback(() => {
    immerSet((state) => {
      const parentId = state.draggedOver.canvasId;
      const siblingId = state.draggedOver.siblingId;

      if (!parentId) {
        // Since there is no canvas to drop the component on:
        //  - for new components: ignore them.
        //  - for existing components: reset to their original location.
        state.draggedOver = { isDragging: false };
        return;
      }

      // The following is adding the component in a new location.

      const canvasElement = state.componentMap[parentId];
      const indexOfSibling = siblingId ? canvasElement.childrenNodes.indexOf(siblingId) : null;

      if (state.draggedOver.componentKind === 'existing' && state.draggedOver.previousLocation) {
        // Remove the component from its older location if this component was moved.
        state.componentMap[state.draggedOver.previousLocation!.parentId].childrenNodes.splice(
          state.draggedOver.previousLocation!.index,
          1
        );
      }

      let childrenNodes = canvasElement.childrenNodes;
      if (typeof indexOfSibling === 'number') {
        // Add the node after the sibling.
        childrenNodes = [
          ...childrenNodes.slice(0, indexOfSibling + 1),
          state.draggedOver.component!.id,
          ...childrenNodes.slice(indexOfSibling + 1),
        ];
      } else if (childrenNodes.length === 0) {
        // If there is no sibling provided, then it means that there are no existing children.
        // As such the created node will be the only child.
        childrenNodes = [state.draggedOver.component!.id];
      }

      state.componentMap[state.draggedOver.component!.id] = {
        ...state.draggedOver.component!,
        parentId,
      };
      state.componentMap[parentId].childrenNodes = childrenNodes;
      state.draggedOver = {
        isDragging: false,
      };
    });
  }, [immerSet]);
}