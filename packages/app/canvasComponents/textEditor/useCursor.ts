import { useComponentId } from '@graftini/graft';
import { useMotionValue } from 'framer-motion';
import { useEffect } from 'react';
import { useDesignerStateApi } from 'store/designer';

/**
 * Hook to get the current cursor style based on whether the text editor is active.
 */
export default function useCursor() {
  const componentId = useComponentId();
  const cursor = useMotionValue('default');
  const { subscribe } = useDesignerStateApi();

  useEffect(() => {
    return subscribe(
      (isSelected) => {
        cursor.set(isSelected ? 'text' : 'default');
      },
      (state) => state.selectedComponentId === componentId
    );
  }, [componentId, cursor, subscribe]);

  return cursor;
}
