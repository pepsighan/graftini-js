import { useCallback } from 'react';
import { EditorStore, useEditorStore } from './store/editor';
import { ComponentRegionStore, useComponentRegionStore } from './store/regionMap';

/**
 * Hook to delete a component from canvas.
 */
export function useOnDelete() {
  const immerSetEditor = useEditorStore(useCallback((state: EditorStore) => state.immerSet, []));
  const immerSetRegion = useComponentRegionStore(
    useCallback((state: ComponentRegionStore) => state.immerSet, [])
  );

  return useCallback(
    (componentId: string) => {
      immerSetEditor((state) => {
        const component = state.componentMap[componentId];
        if (!component) {
          return;
        }

        // Remove the component from the parent's children nodes.
        state.componentMap[component.parentId!].childrenNodes = state.componentMap[
          component.parentId!
        ].childrenNodes.filter((it) => it !== component.id);
      });

      // Also remove it from the region map.
      immerSetRegion((state) => {
        delete state.regionMap[componentId];
      });

      // Do not immediately remove the component from the map, the editor will crash
      // because it has not yet removed the component from the tree.
      setTimeout(() => {
        immerSetEditor((state) => {
          recursivelyDeleteTree(componentId, state);
        });
      });
    },
    [immerSetEditor, immerSetRegion]
  );
}

/**
 * Recursively delete the tree where the root of the tree is [componentId].
 */
function recursivelyDeleteTree(componentId: string, state: EditorStore) {
  const component = state.componentMap[componentId];
  const children = component.childrenNodes;

  // Remove self from the map.
  delete state.componentMap[componentId];

  // Remove the children from the map as well.
  children.forEach((id) => {
    recursivelyDeleteTree(id, state);
  });
}
