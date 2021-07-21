import { useCallback } from 'react';

/**
 * This hook enables the context menu on the components where it is applied.
 * On the designer page, all the context menu is disabled by default to enable
 * custom context menus and to provide consistency.
 * We need this to re-enable context menu in input fields.
 */
export default function useEnableContextMenu() {
  return useCallback((event: Event) => {
    // Just stop the propagation and let the menu appear.
    event.stopPropagation();
  }, []);
}
