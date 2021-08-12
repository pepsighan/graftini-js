import { ClickAwayListener, Paper } from '@material-ui/core';
import { createContext, useCallback, useContext, useState } from 'react';
import { leftSideBarWidth, navBarHeight } from 'utils/constants';

const ContextMenuContext = createContext();

/**
 * Hook to get the context menu state.
 */
export function useContextMenu() {
  return useContext(ContextMenuContext);
}

/**
 * The provide that binds all the context menu within the editor page.
 */
export function ContextMenuProvider({ children }) {
  const state = useContextMenuState();
  return <ContextMenuContext.Provider value={state}>{children}</ContextMenuContext.Provider>;
}

/**
 * The main state which stores all contexts.
 */
function useContextMenuState() {
  const [context, setContext] = useState(null);

  const onOpen = useCallback((event, id) => {
    event.preventDefault();
    event.stopPropagation();

    setContext({
      id,
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  const onClose = useCallback(() => setContext(null), []);

  return { context, onOpen, onClose };
}

/**
 * The component which defines how a particular context menu looks.
 */
export function ContextMenu({ id, isCorrectionNeeded = false, children }) {
  const { context, onClose } = useContextMenu();

  // The correction may be needed if the menu is to be shown on right clicking the
  // components within the canvas. In that case, the position of the context menu is
  // relative to the iframe which needs to be corrected for it to be shown in the
  // context of the main document.
  const x = context?.x + (isCorrectionNeeded ? leftSideBarWidth : 0);
  const y = context?.y + (isCorrectionNeeded ? navBarHeight : 0);

  // Only show the context menu if it matches the id.
  return context?.id === id ? (
    // Clickaway does not handle cases within the iframe which are manually handled.
    <ClickAwayListener onClickAway={onClose}>
      <Paper
        sx={{
          position: 'fixed',
          zIndex: 'modal',
          left: x,
          top: y,
          width: 150,
        }}
      >
        {typeof children === 'function' ? children({ x, y }) : children}
      </Paper>
    </ClickAwayListener>
  ) : null;
}
