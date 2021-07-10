import { Menu } from '@material-ui/core';
import { useCallback } from 'react';
import { leftSideBarWidth, navBarHeight } from 'utils/constants';

export default function ContextMenu({ context, onClose, isCorrectionNeeded = false, children }) {
  // Also close it if right click is pressed again.
  const onContextMenuAgain = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      onClose();
    },
    [onClose]
  );

  return (
    <Menu
      open={!!context}
      onClose={onClose}
      onContextMenu={onContextMenuAgain}
      anchorReference="anchorPosition"
      anchorPosition={
        context
          ? {
              // The correction may be needed if the menu is to be shown on right clicking the
              // components within the canvas. In that case, the position of the context menu is
              // relative to the iframe which needs to be corrected for it to be shown in the
              // context of the main document.
              left: context.x + (isCorrectionNeeded ? leftSideBarWidth : 0),
              top: context.y + (isCorrectionNeeded ? navBarHeight : 0),
            }
          : null
      }
      MenuListProps={{ sx: { width: 150 } }}
    >
      {children}
    </Menu>
  );
}
