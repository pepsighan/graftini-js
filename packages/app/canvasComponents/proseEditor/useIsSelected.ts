import { useComponentId } from '@graftini/graft';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';

export default function useIsSelected() {
  const componentId = useComponentId();
  return useDesignerState(
    useCallback((state) => state.selectedComponentId === componentId, [componentId])
  );
}
