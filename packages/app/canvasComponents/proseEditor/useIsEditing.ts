import { useComponentId } from '@graftini/graft';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';

/**
 * Gets the current editing state of the editor.
 */
export default function useIsEditing() {
  const componentId = useComponentId();
  return useDesignerState(
    useCallback(
      (state) => state.selectedComponentId === componentId && state.isTextEditingEnabled,
      [componentId]
    )
  );
}
