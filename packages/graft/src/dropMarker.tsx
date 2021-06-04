import { motion } from 'framer-motion';
import React, { useCallback } from 'react';
import { useEditorStateInternal } from './schema';

/**
 * This is a component which signifies the drop location of an element that is being dragged.
 * It is shown whenever the pointer is in drag mode and the component preceding it is hovered.
 */
export function DropMarker() {
  const direction = useEditorStateInternal(
    useCallback((state) => {
      const canvasId = state.draggedOver.hoveredOver?.canvasId;
      if (!canvasId) {
        return null;
      }

      return state.componentMap[canvasId].childAppendDirection!;
    }, [])
  );

  const dimensions = useEditorStateInternal(
    useCallback((state) => state.draggedOver.hoveredOver?.dimensions, [])
  );

  const lastChildDimensions = useEditorStateInternal(
    useCallback((state) => state.draggedOver.hoveredOver?.lastChildDimensions, [])
  );

  const isCanvas = useEditorStateInternal(
    useCallback((state) => state.draggedOver.hoveredOver?.isCanvas, [])
  );

  let top = dimensions?.top;
  let left = isCanvas
    ? dimensions?.left
    : // Within the boundaries of the currently hovered component.
      (dimensions?.right ?? 0) - 8;

  if (lastChildDimensions && direction === 'horizontal') {
    left = lastChildDimensions.right;
  }
  if (lastChildDimensions && direction === 'vertical') {
    top = lastChildDimensions.bottom;
  }

  return (
    <>
      {dimensions && (
        <motion.div
          layout
          style={{
            position: 'fixed',
            top,
            left,
            width: direction === 'horizontal' ? 8 : dimensions.width,
            height: direction === 'horizontal' ? dimensions.height : 8,
            backgroundColor: '#9090DD',
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  );
}
