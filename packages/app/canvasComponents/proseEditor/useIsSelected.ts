import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';

export default function useIsSelected(componentId: string) {
  return useDesignerState(
    useCallback((state) => state.selectedComponentId === componentId, [componentId])
  );
}
