import { newComponentNode, useEditorStore, useOnDelete } from '@graftini/graft';
import { MenuItem } from '@material-ui/core';
import Box from 'canvasComponents/Box';
import useContextMenu from 'hooks/useContextMenu';
import { createContext, PropsWithChildren, useCallback, useContext } from 'react';
import { useDesignerState } from 'store/designer';
import ContextMenu from './ContextMenu';

/**
 * A context which provides tools to open and close component context menu.
 */
export const ComponentContextMenuContext = createContext<ReturnType<typeof useContextMenu>>(null);

export default function ComponentContextMenu() {
  const { context, onCloseContextMenu: onClose } = useContext(ComponentContextMenuContext);

  const componentId = useDesignerState(useCallback((state) => state.selectedComponentId, []));
  const onDeleteClick = useOnDeleteClick({ componentId, onClose });
  const onWrapWithBox = useOnWrapWithBox({ componentId, onClose });

  return (
    <ContextMenu context={context} onClose={onClose} isCorrectionNeeded>
      <MenuItem onClick={onWrapWithBox}>Wrap with Box</MenuItem>
      <MenuItem onClick={onDeleteClick}>Delete</MenuItem>
    </ContextMenu>
  );
}

export function ComponentContextMenuContextProvider({ children }: PropsWithChildren<{}>) {
  return (
    <ComponentContextMenuContext.Provider value={useContextMenu()}>
      {children}
    </ComponentContextMenuContext.Provider>
  );
}

function useOnDeleteClick({ componentId, onClose }) {
  const deleteComponent = useOnDelete();
  const unselectComponent = useDesignerState(useCallback((state) => state.unselectComponent, []));

  return useCallback(() => {
    if (!componentId) {
      return;
    }

    unselectComponent();
    deleteComponent(componentId);
    onClose();
  }, [componentId, deleteComponent, onClose, unselectComponent]);
}

function useOnWrapWithBox({ componentId, onClose }) {
  const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));
  const immerSet = useEditorStore(useCallback((state) => state.immerSet, []));

  return useCallback(() => {
    if (!componentId) {
      return;
    }

    let wrappedComponentId: string;

    immerSet((state) => {
      // Get the component which is to be wrapped.
      const component = state.componentMap[componentId];

      // Create a new box component which has no width and height of
      // its own. Its going to stick tight to the component.
      const wrapBoxComponent = newComponentNode({
        type: 'Box',
        isCanvas: true,
        childAppendDirection: 'vertical',
        defaultProps: {
          ...Box.graftOptions.defaultProps,
          width: 'auto',
          height: 'auto',
        },
      });
      wrappedComponentId = wrapBoxComponent.id;

      // Register the new box component.
      state.componentMap[wrapBoxComponent.id] = wrapBoxComponent;

      // Replace the wrapped component with the wrapper box in the parent.
      const parent = state.componentMap[component.parentId!];
      const componentIndex = parent.childrenNodes.indexOf(component.id);
      parent.childrenNodes[componentIndex] = wrapBoxComponent.id;
      wrapBoxComponent.parentId = parent.id;

      // Add the wrapped component to the wrapper box.
      wrapBoxComponent.childrenNodes = [component.id];
      // Replace the parent of the wrapped component with the wrapper.
      component.parentId = wrapBoxComponent.id;

      // Its done.
    });

    // Select the newly created component.
    selectComponent(wrappedComponentId);

    onClose();
  }, [componentId, immerSet, onClose, selectComponent]);
}
