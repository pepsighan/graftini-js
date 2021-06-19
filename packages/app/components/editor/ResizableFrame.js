import { Box } from '@chakra-ui/react';
import { motion, useTransform } from 'framer-motion';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';

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

  const isBoxResizing = useDesignerState(useCallback((state) => state.isBoxResizing, []));

  return (
    <>
      {/* An overlay on top of the UI so that the drag events are not intercepted by others. */}
      {isBoxResizing && <Box position="fixed" top={0} left={0} width="100%" height="100%" />}

      {/* The top side. */}
      <FrameSide drag="y" x={posStartX} y={posY} width={actualWidth} cursor="row-resize" />
      {/* The right side. */}
      <FrameSide drag="x" x={posEndX} y={posStartY} height={actualHeight} cursor="col-resize" />
      {/* The bottom side. */}
      <FrameSide drag="y" x={posStartX} y={posEndY} width={actualWidth} cursor="row-resize" />
      {/* The left side. */}
      <FrameSide drag="x" x={posX} y={posStartY} height={actualHeight} cursor="col-resize" />
    </>
  );
}

function FrameSide({ drag, x, y, width, height, cursor }) {
  const setIsBoxResizing = useDesignerState(useCallback((state) => state.setIsBoxResizing, []));

  const onStartResizing = useCallback(() => {
    setIsBoxResizing(true);
  }, [setIsBoxResizing]);

  const onEndResizing = useCallback(() => {
    setIsBoxResizing(false);
  }, [setIsBoxResizing]);

  return (
    <motion.div
      drag={drag}
      dragMomentum={false}
      onPointerDown={onStartResizing}
      onPointerUp={onEndResizing}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        x,
        y,
        width: width ?? frameWidth,
        height: height ?? frameWidth,
        cursor,
        backgroundColor: 'black',
      }}
    />
  );
}
