import { motion, useMotionValue } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useCreateComponentStoreApi } from './store/createComponent';

export type DrawMarkerProps = {
  color?: string;
};

/**
 * This component shows the place were the user is drawing a component.
 */
export function DrawMarker({ color = '#9090DD' }: DrawMarkerProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const posX = useMotionValue(0);
  const posY = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);

  const { subscribe } = useCreateComponentStoreApi();

  useEffect(() => {
    return subscribe((state) => {
      setIsDrawing(!!state.draw);

      if (state.draw) {
        posX.set(state.draw.start.x);
        posY.set(state.draw.start.y);
        width.set(state.draw.end.x - state.draw.start.x);
        height.set(state.draw.end.y - state.draw.start.y);
      } else {
        posX.set(0);
        posY.set(0);
        width.set(0);
        height.set(0);
      }
    });
  }, [height, posX, posY, subscribe, width]);

  return (
    <>
      {isDrawing && (
        <motion.div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            x: posX,
            y: posY,
            width,
            height,
            border: `2px solid ${color}`,
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  );
}
