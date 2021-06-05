import { motion } from 'framer-motion';
import React from 'react';

/**
 * This is a component which signifies the drop location of an element that is being dragged.
 * It is shown whenever the pointer is in drag mode and the component preceding it is hovered.
 */
export function DropMarker() {
  return (
    <>
      {false && (
        <motion.div
          layout
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: 8,
            height: 8,
            backgroundColor: '#9090DD',
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  );
}
