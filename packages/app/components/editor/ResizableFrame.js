import { Box } from '@chakra-ui/react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEditor } from 'graft';
import { useCallback, useEffect } from 'react';
import { useDesignerState } from 'store/designer';
import theme from 'utils/theme';

export default function ResizeableFrame({ componentId, ...rest }) {
  const { isFrozen, ...restFrozen } = useFrozenProps(rest);
  const { top, left, right, bottom, topLeft, topRight, bottomLeft, bottomRight } =
    useSidePositions(rest);

  const isBoxResizing = useDesignerState(useCallback((state) => state.isBoxResizing, []));
  const setIsBoxResizing = useDesignerState(useCallback((state) => state.setIsBoxResizing, []));

  const onStartResizing = useCallback(
    (event) => {
      event.preventDefault();
      isFrozen.set(true);
      setIsBoxResizing(true);
    },
    [isFrozen, setIsBoxResizing]
  );
  const onEndResizing = useCallback(
    (event) => {
      event.preventDefault();
      isFrozen.set(false);
      setIsBoxResizing(false);
    },
    [isFrozen, setIsBoxResizing]
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
        componentId={componentId}
        original={restFrozen}
        cursor="n-resize"
        type="top"
        onPointerDown={onStartResizing}
        onPointerUp={onEndResizing}
      />
      {/* The right side. */}
      <FrameSide
        {...right}
        componentId={componentId}
        original={restFrozen}
        cursor="e-resize"
        type="right"
        onPointerDown={onStartResizing}
        onPointerUp={onEndResizing}
      />
      {/* The bottom side. */}
      <FrameSide
        {...bottom}
        componentId={componentId}
        original={restFrozen}
        cursor="n-resize"
        type="bottom"
        onPointerDown={onStartResizing}
        onPointerUp={onEndResizing}
      />
      {/* The left side. */}
      <FrameSide
        {...left}
        componentId={componentId}
        original={restFrozen}
        cursor="e-resize"
        type="left"
        onPointerDown={onStartResizing}
        onPointerUp={onEndResizing}
      />
      {/* The top-left corner. */}
      <FrameCorner
        {...topLeft}
        componentId={componentId}
        original={restFrozen}
        cursor="nwse-resize"
        type="top-left"
        onPointerDown={onStartResizing}
        onPointerUp={onEndResizing}
      />
      {/* The top-right corner. */}
      <FrameCorner
        {...topRight}
        componentId={componentId}
        original={restFrozen}
        cursor="nesw-resize"
        type="top-right"
        onPointerDown={onStartResizing}
        onPointerUp={onEndResizing}
      />
      {/* The bottom-right corner. */}
      <FrameCorner
        {...bottomRight}
        componentId={componentId}
        original={restFrozen}
        cursor="nwse-resize"
        type="bottom-right"
        onPointerDown={onStartResizing}
        onPointerUp={onEndResizing}
      />
      {/* The bottom-left corner. */}
      <FrameCorner
        {...bottomLeft}
        componentId={componentId}
        original={restFrozen}
        cursor="nesw-resize"
        type="bottomLeft"
        onPointerDown={onStartResizing}
        onPointerUp={onEndResizing}
      />
    </>
  );
}

/**
 * A side of the Box which can be dragged to resize.
 */
function FrameSide({
  x,
  y,
  width,
  height,
  cursor,
  type,
  onPointerDown,
  onPointerUp,
  componentId,
  original,
}) {
  const { updateWidth, updateHeight } = useDimensionUpdate({ componentId });

  return (
    <motion.div
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPan={useCallback(
        (_, pointInfo) => {
          if (type === 'left') {
            const diffW = -pointInfo.offset.x;
            updateWidth(original.width.get() + diffW);
          } else if (type === 'right') {
            const diffW = pointInfo.offset.x;
            updateWidth(original.width.get() + diffW);
          } else if (type === 'top') {
            const diffH = -pointInfo.offset.y;
            updateHeight(original.height.get() + diffH);
          } else if (type === 'bottom') {
            const diffH = pointInfo.offset.y;
            updateHeight(original.height.get() + diffH);
          }
        },
        [original.height, original.width, type, updateHeight, updateWidth]
      )}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        x,
        y,
        width,
        height,
        cursor,
      }}
    />
  );
}

/**
 * A corner on the Box which can be used to resize any which way.
 */
function FrameCorner({
  x,
  y,
  width,
  height,
  cursor,
  type,
  onPointerDown,
  onPointerUp,
  componentId,
  original,
}) {
  const { updateWidth, updateHeight } = useDimensionUpdate({ componentId });

  return (
    <motion.div
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPan={useCallback(
        (_, pointInfo) => {
          if (type.includes('left')) {
            const diffW = -pointInfo.offset.x;
            updateWidth(original.width.get() + diffW);
          }
          if (type.includes('right')) {
            const diffW = pointInfo.offset.x;
            updateWidth(original.width.get() + diffW);
          }
          if (type.includes('top')) {
            const diffH = -pointInfo.offset.y;
            updateHeight(original.height.get() + diffH);
          }
          if (type.includes('bottom')) {
            const diffH = pointInfo.offset.y;
            updateHeight(original.height.get() + diffH);
          }
        },
        [original.height, original.width, type, updateHeight, updateWidth]
      )}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        x,
        y,
        width,
        height,
        cursor,
        border: `1px solid ${theme.colors.primary[300]}`,
        backgroundColor: 'white',
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
  const topLeft = useTopLeftCorner(props);
  const topRight = useTopRightCorner(props);
  const bottomLeft = useBottomLeftCorner(props);
  const bottomRight = useBottomRightCorner(props);

  return { top, right, bottom, left, topLeft, topRight, bottomLeft, bottomRight };
}

function useTopSide({ posX, posY, width }) {
  const topX = useTransform(posX, (x) => x + frameWidth);
  const topY = useTransform(posY, (y) => y);
  const topWidth = useTransform(width, (w) => w - frameWidth * 2);

  return { x: topX, y: topY, width: topWidth, height: frameWidth };
}

function useRightSide({ posX, posY, width, height }) {
  const rightX = useTransform([posX, width], ([x, w]) => x + w - frameWidth);
  const rightY = useTransform(posY, (y) => y + frameWidth);
  const rightHeight = useTransform(height, (h) => h - frameWidth * 2);

  return { x: rightX, y: rightY, width: frameWidth, height: rightHeight };
}

function useBottomSide({ posX, posY, width, height }) {
  const bottomX = useTransform(posX, (x) => x + frameWidth);
  const bottomY = useTransform([posY, height], ([y, h]) => y + h - frameWidth);
  const bottomWidth = useTransform(width, (w) => w - frameWidth * 2);

  return { x: bottomX, y: bottomY, width: bottomWidth, height: frameWidth };
}

function useLeftSide({ posX, posY, height }) {
  const leftX = useTransform(posX, (x) => x);
  const leftY = useTransform(posY, (y) => y + frameWidth);
  const leftHeight = useTransform(height, (h) => h - frameWidth * 2);

  return { x: leftX, y: leftY, width: frameWidth, height: leftHeight };
}

function useTopLeftCorner({ posX, posY }) {
  const x = useTransform(posX, (x) => x - frameWidth);
  const y = useTransform(posY, (y) => y - frameWidth);

  return { x, y, width: frameWidth * 2, height: frameWidth * 2 };
}

function useTopRightCorner({ posX, posY, width }) {
  const x = useTransform([posX, width], ([x, w]) => x + w - frameWidth);
  const y = useTransform(posY, (y) => y - frameWidth);

  return { x, y, width: frameWidth * 2, height: frameWidth * 2 };
}

function useBottomRightCorner({ posX, posY, width, height }) {
  const x = useTransform([posX, width], ([x, w]) => x + w - frameWidth);
  const y = useTransform([posY, height], ([y, h]) => y + h - frameWidth);

  return { x, y, width: frameWidth * 2, height: frameWidth * 2 };
}

function useBottomLeftCorner({ posX, posY, height }) {
  const x = useTransform(posX, (x) => x - frameWidth);
  const y = useTransform([posY, height], ([y, h]) => y + h - frameWidth);

  return { x, y, width: frameWidth * 2, height: frameWidth * 2 };
}

function useDimensionUpdate({ componentId }) {
  const { updateComponentProps } = useEditor();

  const updateWidth = useCallback(
    (width) => {
      updateComponentProps(componentId, (props) => ({
        ...props,
        width: { size: Math.floor(width <= 0 ? 0 : width), unit: 'px' },
      }));
    },
    [componentId, updateComponentProps]
  );

  const updateHeight = useCallback(
    (height) => {
      updateComponentProps(componentId, (props) => ({
        ...props,
        height: { size: Math.floor(height <= 0 ? 0 : height), unit: 'px' },
      }));
    },
    [componentId, updateComponentProps]
  );

  return { updateWidth, updateHeight };
}

/**
 * Only syncs with the upstream position values when they are not frozen.
 */
function useFrozenProps({ posX, posY, width, height }) {
  const isFrozen = useMotionValue(false);

  const fX = useMotionValue(posX.get());
  const fY = useMotionValue(posY.get());
  const fW = useMotionValue(width.get());
  const fH = useMotionValue(height.get());

  useEffect(() => {
    const syncWhenNotFrozen = (original, frozen) => {
      // Sync from the original only if it is not frozen.
      const unsubscribeOriginal = original.onChange((v) => {
        if (isFrozen.get()) {
          return;
        }

        frozen.set(v);
      });

      // Also, sync the latest value when frozen is turned off.
      const unsubscribeFrozen = isFrozen.onChange((v) => {
        if (v) {
          return;
        }

        frozen.set(original.get());
      });

      return () => {
        unsubscribeOriginal();
        unsubscribeFrozen();
      };
    };

    const unsubscribeX = syncWhenNotFrozen(posX, fX);
    const unsubscribeY = syncWhenNotFrozen(posY, fY);
    const unsubscribeWidth = syncWhenNotFrozen(width, fW);
    const unsubscribeHeight = syncWhenNotFrozen(height, fH);

    return () => {
      unsubscribeX();
      unsubscribeY();
      unsubscribeWidth();
      unsubscribeHeight();
    };
  }, [fH, fW, fX, fY, height, isFrozen, posX, posY, width]);

  return { posX: fX, posY: fY, width: fW, height: fH, isFrozen };
}
