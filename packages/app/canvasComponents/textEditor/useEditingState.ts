import { useComponentId } from '@graftini/graft';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';

export default function useEditingState() {
  const componentId = useComponentId();

  const isSelected = useDesignerState(
    useCallback((state) => state.selectedComponentId === componentId, [componentId])
  );
  const isEditing = useDesignerState(
    useCallback(
      (state) => state.selectedComponentId === componentId && state.isTextEditingEnabled,
      [componentId]
    )
  );

  return { isSelected, isEditing };
}