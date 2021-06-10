import { motion, useMotionValue } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useDraggedOverStoreApi } from './store/draggedOver';
import { useComponentRegionStoreApi } from './store/regionMap';

/**
 * Shows a drag preview which is snapped to the cursor.
 */
export function DragPreview() {
  const { subscribe } = useDraggedOverStoreApi();
  const { getState: getRegionState } = useComponentRegionStoreApi();

  const [isVisible, setIsVisible] = useState(false);
  const width = useMotionValue(0);
  const height = useMotionValue(0);

  useEffect(() => {
    return subscribe(
      (componentId?: string | null) => {
        const region = componentId ? getRegionState().regionMap[componentId] : null;
        if (componentId && region) {
          setIsVisible(true);
          width.set(region.width);
          height.set(region.height);
          return;
        }

        width.set(0);
        height.set(0);
        setIsVisible(false);
      },
      (state) => state.draggedOver?.component?.id
    );
  }, [getRegionState, height, subscribe, width]);

  return (
    <div
      id="graft-drag-preview"
      style={{
        display: 'inline-block',
        position: 'fixed',
        top: 0,
        left: 0,
        // Do not show the original item on the screen and only the preview is visible.
        // Found no other way to hide it.
        transform: 'translateX(-99999px)',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {isVisible && (
        <motion.div
          style={{
            x: 0,
            y: 0,
            width,
            height,
            border: '1px solid blue',
          }}
        />
      )}
    </div>
  );
}
