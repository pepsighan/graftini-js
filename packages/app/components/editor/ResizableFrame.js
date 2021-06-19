import { Box } from '@chakra-ui/react';
import { motion, useTransform } from 'framer-motion';
import { useEditor } from 'graft';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';

export default function ResizeableFrame(props) {
  const { top, left, right, bottom } = useSidePositions(props);

  const isBoxResizing = useDesignerState(useCallback((state) => state.isBoxResizing, []));
  const setIsBoxResizing = useDesignerState(useCallback((state) => state.setIsBoxResizing, []));

  const onStartResizing = useCallback(
    (event) => {
      event.preventDefault();
      setIsBoxResizing(true);
    },
    [setIsBoxResizing]
  );
  const onEndResizing = useCallback(
    (event) => {
      event.preventDefault();
      setIsBoxResizing(false);
    },
    [setIsBoxResizing]
  );

  return (
    <>
      {/* An overlay on top of the UI so that the drag events are not intercepted by others. */}
      {isBoxResizing && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100%"
          height="100%"
          onPointerUp={onEndResizing}
        />
      )}

      {/* The top side. */}
      <FrameSide
        {...top}
        cursor="row-resize"
        type="top"
        onPointerDown={onStartResizing}
        onPointerUp={onEndResizing}
      />
      {/* The right side. */}
      <FrameSide
        {...right}
        cursor="col-resize"
        type="right"
        onPointerDown={onStartResizing}
        onPointerUp={onEndResizing}
      />
      {/* The bottom side. */}
      <FrameSide
        {...bottom}
        cursor="row-resize"
        type="bottom"
        onPointerDown={onStartResizing}
        onPointerUp={onEndResizing}
      />
      {/* The left side. */}
      <FrameSide
        {...left}
        cursor="col-resize"
        type="left"
        onPointerDown={onStartResizing}
        onPointerUp={onEndResizing}
      />
    </>
  );
}

function FrameSide({ x, y, width, height, cursor, type, onPointerDown, onPointerUp }) {
  return (
    <motion.div
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPan={(_, pointInfo) => {
        let diff = 0;
        if (type === 'left') {
          diff = -pointInfo.offset.x;
        } else if (type === 'right') {
          diff = pointInfo.offset.x;
        } else if (type === 'top') {
          diff = -pointInfo.offset.y;
        } else if (type === 'bottom') {
          diff = pointInfo.offset.y;
        }

        console.log(diff);
      }}
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

  return { x: topX, y: topY, width: topWidth, height: frameWidth };
}

function useRightSide({ posX, posY, width, height, componentId }) {
  const rightX = useTransform([posX, width], ([x, w]) => x + w - frameWidth);
  const rightY = useTransform(posY, (y) => y + frameWidth);
  const rightHeight = useTransform(height, (h) => h - frameWidth * 2);

  return { x: rightX, y: rightY, width: frameWidth, height: rightHeight };
}

function useBottomSide({ posX, posY, width, height, componentId }) {
  const bottomX = useTransform(posX, (x) => x + frameWidth);
  const bottomY = useTransform([posY, height], ([y, h]) => y + h - frameWidth);
  const bottomWidth = useTransform(width, (w) => w - frameWidth * 2);

  return { x: bottomX, y: bottomY, width: bottomWidth, height: frameWidth };
}

function useLeftSide({ posX, posY, width, height, componentId }) {
  const leftX = useTransform(posX, (x) => x);
  const leftY = useTransform(posY, (y) => y + frameWidth);
  const leftHeight = useTransform(height, (h) => h - frameWidth * 2);

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