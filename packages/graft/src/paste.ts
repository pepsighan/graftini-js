import { nanoid } from 'nanoid';
import { useCallback } from 'react';
import { addComponentToDropRegion, identifyDropRegion } from './dropLocation';
import { Position } from './store/draggedOver';
import { ComponentMap, ComponentNode, useEditorStore } from './store/editor';
import { useComponentRegionStoreApi } from './store/regionMap';
import { useRootScrollStoreApi } from './store/rootScroll';

/**
 * A component that can be pasted. This component encapsulates every children as a
 * tree.
 */
type PasteComponent = Omit<ComponentNode, 'id' | 'childrenNodes'> & {
  id?: string;
  childrenNodes: PasteComponent[];
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

      immerEditorStore((state) => {
        const dropRegion = identifyDropRegion(
          state.componentMap,
          regionMap,
          resolvedCursorPosition
        );
        if (!dropRegion) {
          return;
        }

        const newComponentId = assignNewComponents(component, state.componentMap, null);
        addComponentToDropRegion(newComponentId, dropRegion, state.componentMap);
      });
      return;
    },
    [getComponentRegionState, getScrollState, immerEditorStore]
  );
}

/**
 * Fills the component map with all the components in the paste component tree.
 */
function assignNewComponents(
  component: PasteComponent,
  componentMap: ComponentMap,
  parentId: string | null
): string {
  const id = nanoid();

  const childrenNodes = component.childrenNodes.map((node) =>
    assignNewComponents(node as PasteComponent, componentMap, id)
  );

  const newComponent = {
    ...component,
    id,
    childrenNodes,
    parentId,
  };
  componentMap[newComponent.id] = newComponent!;
  return newComponent.id;
}
