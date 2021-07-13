import { useCallback } from 'react';
import { useDesignerState, useDesignerStateApi } from 'store/designer';
import { isComponentWithinSubTree, useEditorStoreApi } from '@graftini/graft';

/**
 * Selects a component on right click but not if its parent is already selected.
 */
export default function useSelectOnRightClick() {
  const { getState: getEditorState } = useEditorStoreApi();
  const { getState } = useDesignerStateApi();
  const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));

  return useCallback(
    (componentId) => {
      const selectedComponentId = getState().selectedComponentId;

      if (selectedComponentId) {
        const isChild = isComponentWithinSubTree(
          selectedComponentId,
          componentId,
          getEditorState().componentMap
        );

        // Do not select if the component is within an already selected one.
        // We want the user to be able to right click already selected component.
        if (isChild) {
          return;
        }
      }

      selectComponent(componentId);
    },
    [getEditorState, getState, selectComponent]
  );
}
