import { ClickAwayListener, Paper } from '@material-ui/core';
import { leftSideBarWidth, navBarHeight } from 'utils/constants';

export default function ContextMenu({ context, onClose, isCorrectionNeeded = false, children }) {
  return context ? (
    <ClickAwayListener onClickAway={onClose}>
      <Paper
        sx={{
          position: 'fixed',
          zIndex: '100',
          // The correction may be needed if the menu is to be shown on right clicking the
          // components within the canvas. In that case, the position of the context menu is
          // relative to the iframe which needs to be corrected for it to be shown in the
          // context of the main document.
          left: context?.x + (isCorrectionNeeded ? leftSideBarWidth : 0),
          top: context?.y + (isCorrectionNeeded ? navBarHeight : 0),
          width: 150,
        }}
      >
        {children}
      </Paper>
    </ClickAwayListener>
  ) : null;
}
