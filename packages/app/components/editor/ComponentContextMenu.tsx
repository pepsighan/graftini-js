import { Menu, MenuItem } from '@material-ui/core';
import useContextMenu from 'hooks/useContextMenu';
import { MouseEvent, useCallback } from 'react';
import { createContext, PropsWithChildren, useContext } from 'react';
import { leftSideBarWidth, navBarHeight } from 'utils/constants';

/**
 * A context which provides tools to open and close component context menu.
 */
export const ComponentContextMenuContext = createContext<ReturnType<typeof useContextMenu>>(null);

export default function ComponentContextMenu() {
  const { context, onCloseContextMenu } = useContext(ComponentContextMenuContext);

  // Also close it if right click is pressed again.
  const onContextMenuAgain = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      onCloseContextMenu();
    },
    [onCloseContextMenu]
  );

  return (
    <Menu
      open={!!context}
      onClose={onCloseContextMenu}
      onContextMenu={onContextMenuAgain}
      anchorReference="anchorPosition"
      anchorPosition={
        context
          ? {
              // The position of the context menu is relative to the iframe which needs to be
              // corrected for it to be shown in the context of the main document.
              left: context.x + leftSideBarWidth,
              top: context.y + navBarHeight,
            }
          : null
      }
      MenuListProps={{ sx: { width: 150 } }}
    >
      <MenuItem>Delete</MenuItem>
    </Menu>
  );
}

export function ComponentContextMenuContextProvider({ children }: PropsWithChildren<{}>) {
  return (
    <ComponentContextMenuContext.Provider value={useContextMenu()}>
      {children}
    </ComponentContextMenuContext.Provider>
  );
}
