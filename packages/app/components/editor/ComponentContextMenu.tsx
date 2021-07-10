import { MenuItem } from '@material-ui/core';
import useContextMenu from 'hooks/useContextMenu';
import { createContext, PropsWithChildren, useContext } from 'react';
import ContextMenu from './ContextMenu';

/**
 * A context which provides tools to open and close component context menu.
 */
export const ComponentContextMenuContext = createContext<ReturnType<typeof useContextMenu>>(null);

export default function ComponentContextMenu() {
  const { context, onCloseContextMenu } = useContext(ComponentContextMenuContext);

  return (
    <ContextMenu context={context} onClose={onCloseContextMenu} isCorrectionNeeded>
      <MenuItem>Delete</MenuItem>
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
