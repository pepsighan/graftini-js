import { motion } from 'framer-motion';
import React, { useCallback } from 'react';
import { useEditorStateInternal } from './schema';

/**
 * This is a component which signifies the drop location of an element that is being dragged.
 * It is shown whenever the pointer is in drag mode and the component preceding it is hovered.
 */
export function DropMarker() {
  const dimensions = useEditorStateInternal(
    useCallback((state) => state.draggedOver.hoveredOver?.dimensions, [])
  );
  const isCanvas = useEditorStateInternal(
    useCallback((state) => state.draggedOver.hoveredOver?.isCanvas, [])
  );

  return (
    <>
      {dimensions && (
        <motion.div
          layout
          style={{
            position: 'fixed',
            top: dimensions.top,
            left: isCanvas
              ? dimensions.left
              : // Within the boundaries of the currently hovered component.
                dimensions.right - 8,
            width: 8,
            height: dimensions.height,
            backgroundColor: '#9090DD',
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  );
}
