import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';

/**
 * Unselect the component (if any) when drag starts.
 */
export default function useUnselectOnDragStart(onDragStart) {
  const unselectComponent = useDesignerState(useCallback((state) => state.unselectComponent, []));

  return useCallback(
    (event) => {
      unselectComponent();
      onDragStart(event);
    },
    [onDragStart, unselectComponent]
  );
}
