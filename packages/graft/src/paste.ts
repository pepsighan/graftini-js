import { nanoid } from 'nanoid';
import { useCallback } from 'react';
import { addComponentToDropRegion, identifyDropRegion } from './dropLocation';
import { Position } from './store/draggedOver';
import { ComponentNode, useEditorStore } from './store/editor';
import { useHoverStoreApi } from './store/hover';
import { useComponentRegionStoreApi } from './store/regionMap';
import { useRootScrollStoreApi } from './store/rootScroll';

/**
 * A component that can be pasted. If id is provided, it means to cut-paste
 * an existing component.
 */
type PasteComponent = ComponentNode & {
  id?: string;
};

type UsePaste = (component: PasteComponent, position: Position) => void;

/**
 * Pastes a component at the current hover location.
 */
export function usePaste(): UsePaste {
  const { getState: getHoverState } = useHoverStoreApi();
  const { getState: getComponentRegionState } = useComponentRegionStoreApi();
  const { immerSet: immerEditorStore } = useEditorStore();
  const { getState: getScrollState } = useRootScrollStoreApi();

  return useCallback(
    (component, position) => {
      const hover = getHoverState();
      const isOnIFrame = hover.isOnIFrame;
      if (!isOnIFrame) {
        return;
      }

      const regionMap = getComponentRegionState().regionMap;
      const scrollPosition = getScrollState().position;
      const resolvedCursorPosition = {
        x: position.x + scrollPosition.x,
        y: position.y + scrollPosition.y,
      };

      if (!component.id) {
        immerEditorStore((state) => {
          const dropRegion = identifyDropRegion(
            state.componentMap,
            regionMap,
            resolvedCursorPosition
          );
          if (!dropRegion) {
            return;
          }

          const newComponent: ComponentNode = {
            ...component,
            id: nanoid(),
          };
          state.componentMap[newComponent!.id] = newComponent!;
          addComponentToDropRegion(newComponent!.id, dropRegion, state.componentMap);
        });
        return;
      }

      // If a component id is present, then it is to be moved to its new position.
      immerEditorStore((state) => {
        const dropRegion = identifyDropRegion(
          state.componentMap,
          regionMap,
          resolvedCursorPosition
        );
        if (!dropRegion) {
          return;
        }

        const parent = state.componentMap[component.parentId!];
        // Remove the component from its existing parent.
        parent.childrenNodes = parent.childrenNodes.filter((it) => it !== component.id);
        // Add it to the new place.
        addComponentToDropRegion(component.id, dropRegion, state.componentMap);
      });
    },
    [getComponentRegionState, getHoverState, getScrollState, immerEditorStore]
  );
}
