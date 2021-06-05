import { motion } from 'framer-motion';
import React, { useCallback } from 'react';
import { useEditorStateInternal } from './schema';

/**
 * This is a component which signifies the drop location of an element that is being dragged.
 * It is shown whenever the pointer is in drag mode and the component preceding it is hovered.
 */
export function DropMarker() {
  const isOnCanvas = useEditorStateInternal(
    useCallback((state) => state.draggedOver.dropRegion?.componentId, [])
  );

  const dropMarkerRegion = useEditorStateInternal(
    useCallback((state) => state.draggedOver.dropRegion?.dropMarkerRegion, [])
  );

  return (
    <>
      {dropMarkerRegion && isOnCanvas && (
        <motion.div
          layout
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            x: dropMarkerRegion.x,
            y: dropMarkerRegion.y,
            width: dropMarkerRegion.width,
            height: dropMarkerRegion.height,
            backgroundColor: '#9090DD',
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  );
}
