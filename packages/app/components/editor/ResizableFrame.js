import { motion, useTransform } from 'framer-motion';
import { useCallback } from 'react';

const frameWidth = 4;

export default function ResizeableFrame({ posX, posY, width, height }) {
  const posStartX = useTransform(
    posX,
    useCallback((x) => x + frameWidth, [])
  );

  const posEndX = useTransform(
    [posX, width],
    useCallback(([x, w]) => x + w - frameWidth, [])
  );

  const posStartY = useTransform(
    posY,
    useCallback((y) => y + frameWidth, [])
  );

  const posEndY = useTransform(
    [posY, height],
    useCallback(([y, h]) => y + h - frameWidth, [])
  );

  const actualWidth = useTransform(
    width,
    useCallback((w) => w - frameWidth * 2, [])
  );

  const actualHeight = useTransform(
    height,
    useCallback((h) => h - frameWidth * 2, [])
  );

  return (
    <>
      {/* The top side. */}
      <motion.div
        drag="y"
        dragMomentum={false}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: posStartX,
          y: posY,
          width: actualWidth,
          height: frameWidth,
          cursor: 'row-resize',
          backgroundColor: 'black',
        }}
      />

      {/* The right side. */}
      <motion.div
        drag="x"
        dragMomentum={false}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: posEndX,
          y: posStartY,
          width: frameWidth,
          height: actualHeight,
          cursor: 'col-resize',
          backgroundColor: 'black',
        }}
      />

      {/* The bottom side. */}
      <motion.div
        drag="y"
        dragMomentum={false}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: posStartX,
          y: posEndY,
          width: actualWidth,
          height: frameWidth,
          cursor: 'row-resize',
          backgroundColor: 'black',
        }}
      />

      {/* The left side. */}
      <motion.div
        drag="x"
        dragMomentum={false}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: posX,
          y: posStartY,
          width: frameWidth,
          height: actualHeight,
          cursor: 'col-resize',
          backgroundColor: 'black',
        }}
      />
    </>
  );
}
