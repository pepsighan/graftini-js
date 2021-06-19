import { Box } from '@chakra-ui/react';
import { motion, useTransform } from 'framer-motion';
import { useEditor } from 'graft';
import { useCallback, useEffect } from 'react';
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

function useSidePositions(props) {
  const top = useTopSide(props);
  const right = useRightSide(props);
  const bottom = useBottomSide(props);
  const left = useLeftSide(props);

  return { top, right, bottom, left };
}

function useTopSide({ posX, posY, width, height, componentId }) {
  const topX = useTransform(posX, (x) => x + frameWidth);
  const topY = useTransform(posY, (y) => y);
  const topWidth = useTransform(width, (w) => w - frameWidth * 2);

  // Update the height when top side resizes.
  const { updateHeight } = useDimensionUpdate({ componentId });
  useEffect(() => {
    return topY.onChange((curY) => {
      const diff = posY.get() - curY;
      updateHeight(height.get() + diff);
    });
  }, [height, posY, topY, updateHeight]);

  return { x: topX, y: topY, width: topWidth, height: frameWidth };
}

function useRightSide({ posX, posY, width, height, componentId }) {
  const rightX = useTransform([posX, width], ([x, w]) => x + w - frameWidth);
  const rightY = useTransform(posY, (y) => y + frameWidth);
  const rightHeight = useTransform(height, (h) => h - frameWidth * 2);

  // Update the width when right side resizes.
  const { updateWidth } = useDimensionUpdate({ componentId });
  useEffect(() => {
    return rightX.onChange((curX) => {
      const diffX = curX - posX.get() - width.get() + frameWidth;
      updateWidth(width.get() + diffX);
    });
  }, [height, posX, posY, rightX, updateWidth, width]);

  return { x: rightX, y: rightY, width: frameWidth, height: rightHeight };
}

function useBottomSide({ posX, posY, width, height, componentId }) {
  const bottomX = useTransform(posX, (x) => x + frameWidth);
  const bottomY = useTransform([posY, height], ([y, h]) => y + h - frameWidth);
  const bottomWidth = useTransform(width, (w) => w - frameWidth * 2);

  // Update the height when bottom side resizes.
  const { updateHeight } = useDimensionUpdate({ componentId });
  useEffect(() => {
    return bottomY.onChange((curY) => {
      const diffY = curY - posY.get() - height.get() + frameWidth;
      updateHeight(height.get() + diffY);
    });
  }, [bottomY, height, posX, posY, updateHeight, width]);

  return { x: bottomX, y: bottomY, width: bottomWidth, height: frameWidth };
}

function useLeftSide({ posX, posY, width, height, componentId }) {
  const leftX = useTransform(posX, (x) => x);
  const leftY = useTransform(posY, (y) => y + frameWidth);
  const leftHeight = useTransform(height, (h) => h - frameWidth * 2);

  // Update the height when bottom side resizes.
  const { updateWidth } = useDimensionUpdate({ componentId });
  useEffect(() => {
    return leftX.onChange((curX) => {
      const diffX = posX.get() - curX;
      updateWidth(width.get() + diffX);
    });
  }, [height, leftX, posX, posY, updateWidth, width]);

  return { x: leftX, y: leftY, width: frameWidth, height: leftHeight };
}

function useDimensionUpdate({ componentId }) {
  const { updateComponentProps } = useEditor();

  const updateWidth = useCallback(
    (width) => {
      updateComponentProps(componentId, (props) => ({
        ...props,
        width: { size: width <= 0 ? 0 : width, unit: 'px' },
      }));
    },
    [componentId, updateComponentProps]
  );

  const updateHeight = useCallback(
    (height) => {
      updateComponentProps(componentId, (props) => ({
        ...props,
        height: { size: height <= 0 ? 0 : height, unit: 'px' },
      }));
    },
    [componentId, updateComponentProps]
  );

  return { updateWidth, updateHeight };
}
