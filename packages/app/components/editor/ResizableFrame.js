import { Box } from '@chakra-ui/react';
import { motion, useTransform } from 'framer-motion';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';

export default function ResizeableFrame(props) {
  const isBoxResizing = useDesignerState(useCallback((state) => state.isBoxResizing, []));
  const { top, left, right, bottom } = useSidePositions(props);

  return (
    <>
      {/* An overlay on top of the UI so that the drag events are not intercepted by others. */}
      {isBoxResizing && <Box position="fixed" top={0} left={0} width="100%" height="100%" />}

      {/* The top side. */}
      <FrameSide drag="y" {...top} cursor="row-resize" />
      {/* The right side. */}
      <FrameSide drag="x" {...right} cursor="col-resize" />
      {/* The bottom side. */}
      <FrameSide drag="y" {...bottom} cursor="row-resize" />
      {/* The left side. */}
      <FrameSide drag="x" {...left} cursor="col-resize" />
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
        width,
        height,
        cursor,
        backgroundColor: 'black',
      }}
    />
  );
}

const frameWidth = 4;

function useSidePositions({ posX, posY, width, height }) {
  const topX = useTransform(posX, (x) => x + frameWidth);
  const topY = useTransform(posY, (y) => y);
  const topWidth = useTransform(width, (w) => w - frameWidth * 2);
  const top = { x: topX, y: topY, width: topWidth, height: frameWidth };

  const rightX = useTransform([posX, width], ([x, w]) => x + w - frameWidth);
  const rightY = useTransform(posY, (y) => y + frameWidth);
  const rightHeight = useTransform(height, (h) => h - frameWidth * 2);
  const right = { x: rightX, y: rightY, width: frameWidth, height: rightHeight };

  const bottomX = useTransform(posX, (x) => x + frameWidth);
  const bottomY = useTransform([posY, height], ([y, h]) => y + h - frameWidth);
  const bottomWidth = useTransform(width, (w) => w - frameWidth * 2);
  const bottom = { x: bottomX, y: bottomY, width: bottomWidth, height: frameWidth };

  const leftX = useTransform(posX, (x) => x);
  const leftY = useTransform(posY, (y) => y + frameWidth);
  const leftHeight = useTransform(height, (h) => h - frameWidth * 2);
  const left = { x: leftX, y: leftY, width: frameWidth, height: leftHeight };

  return { top, right, bottom, left };
}
