import { nanoid } from 'nanoid';
import { useCallback } from 'react';
import { addComponentToDropRegion, identifyDropRegion } from './dropLocation';
import { Position } from './store/draggedOver';
import { ComponentMap, ComponentNode, useEditorStore } from './store/editor';
import { useComponentRegionStoreApi } from './store/regionMap';
import { useRootScrollStoreApi } from './store/rootScroll';

/**
 * A component that can be pasted. If id is provided, it means to cut-paste
 * an existing component.
 */
type PasteComponent = Omit<ComponentNode, 'id'> & {
  id?: string;
  /**
   * If an id is provided, it is a cut-paste, hence its expected that the children
   * are also ids. If it is copy-paste, the children node represents a tree of id-less
   * component nodes.
   */
  childrenNodes: string[] | PasteComponent[];
};

type UsePaste = (component: PasteComponent, position: Position) => void;

/**
 * Pastes a component at the current hover location.
 */
export function usePaste(): UsePaste {
  const { getState: getComponentRegionState } = useComponentRegionStoreApi();
  const { immerSet: immerEditorStore } = useEditorStore();
  const { getState: getScrollState } = useRootScrollStoreApi();

  return useCallback(
    (component, position) => {
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

          const newComponentId = assignNewComponents(component, state.componentMap);
          addComponentToDropRegion(newComponentId, dropRegion, state.componentMap);
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
        addComponentToDropRegion(component.id!, dropRegion, state.componentMap);
      });
    },
    [getComponentRegionState, getScrollState, immerEditorStore]
  );
}

/**
 * Fills the component map with all the components in the paste component tree.
 */
function assignNewComponents(component: PasteComponent, componentMap: ComponentMap): string {
  const childrenNodes = component.childrenNodes.map((node) =>
    assignNewComponents(node as PasteComponent, componentMap)
  );

  const newComponent = {
    ...component,
    id: nanoid(),
    childrenNodes,
  };
  componentMap[newComponent.id] = newComponent!;
  return newComponent.id;
}
