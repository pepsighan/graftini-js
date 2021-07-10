import { Menu, MenuItem } from '@material-ui/core';
import { leftSideBarWidth, navBarHeight } from 'utils/constants';

export default function ComponentContextMenu({ context, onClose }) {
  return (
    <Menu
      open
      onClose={onClose}
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
