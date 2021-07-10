import { ROOT_NODE_ID, useOnDelete } from '@graftini/graft';
import { MenuItem } from '@material-ui/core';
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

  return (
    <ContextMenu context={context} onClose={onClose} isCorrectionNeeded>
      <MenuItem onClick={onDeleteClick} disabled={componentId === ROOT_NODE_ID}>
        Delete
      </MenuItem>
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
