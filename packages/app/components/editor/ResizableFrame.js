import { Box } from '@chakra-ui/react';
import { useComponentRegionStoreApi, useEditorStore } from '@graftini/graft';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useDesignerState } from 'store/designer';
import theme from 'utils/theme';

export default function ResizeableFrame({ componentId, ...rest }) {
  const { isFrozen, ...restFrozen } = useFrozenProps(rest);
  const { top, left, right, bottom, topLeft, topRight, bottomLeft, bottomRight } =
    useSidePositions(rest);

  const isBoxResizing = useDesignerState(useCallback((state) => state.isBoxResizing, []));
  const setIsBoxResizing = useDesignerState(useCallback((state) => state.setIsBoxResizing, []));

  const [cursor, setCursor] = useState(null);

  const onResizingStart = useCallback(
    (cursor) => {
      isFrozen.set(true);
      setIsBoxResizing(true);
      setCursor(cursor);
    },
    [isFrozen, setIsBoxResizing]
  );
  const onResizingEnd = useCallback(() => {
    isFrozen.set(false);
    setIsBoxResizing(false);
    setCursor(null);
  }, [isFrozen, setIsBoxResizing]);

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
          onPointerUp={onResizingEnd}
          cursor={cursor}
        />
      )}

      {/* The top side. */}
      <FrameSide
        {...top}
        componentId={componentId}
        original={restFrozen}
        cursor="n-resize"
        type="top"
        onResizingStart={onResizingStart}
        onResizingEnd={onResizingEnd}
      />
      {/* The right side. */}
      <FrameSide
        {...right}
        componentId={componentId}
        original={restFrozen}
        cursor="e-resize"
        type="right"
        onResizingStart={onResizingStart}
        onResizingEnd={onResizingEnd}
      />
      {/* The bottom side. */}
      <FrameSide
        {...bottom}
        componentId={componentId}
        original={restFrozen}
        cursor="n-resize"
        type="bottom"
        onResizingStart={onResizingStart}
        onResizingEnd={onResizingEnd}
      />
      {/* The left side. */}
      <FrameSide
        {...left}
        componentId={componentId}
        original={restFrozen}
        cursor="e-resize"
        type="left"
        onResizingStart={onResizingStart}
        onResizingEnd={onResizingEnd}
      />
      {/* The top-left corner. */}
      <FrameCorner
        {...topLeft}
        componentId={componentId}
        original={restFrozen}
        cursor="nwse-resize"
        type="top-left"
        onResizingStart={onResizingStart}
        onResizingEnd={onResizingEnd}
      />
      {/* The top-right corner. */}
      <FrameCorner
        {...topRight}
        componentId={componentId}
        original={restFrozen}
        cursor="nesw-resize"
        type="top-right"
        onResizingStart={onResizingStart}
        onResizingEnd={onResizingEnd}
      />
      {/* The bottom-right corner. */}
      <FrameCorner
        {...bottomRight}
        componentId={componentId}
        original={restFrozen}
        cursor="nwse-resize"
        type="bottom-right"
        onResizingStart={onResizingStart}
        onResizingEnd={onResizingEnd}
      />
      {/* The bottom-left corner. */}
      <FrameCorner
        {...bottomLeft}
        componentId={componentId}
        original={restFrozen}
        cursor="nesw-resize"
        type="bottomLeft"
        onResizingStart={onResizingStart}
        onResizingEnd={onResizingEnd}
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
  onResizingStart,
  onResizingEnd,
  componentId,
  original,
}) {
  const { updateWidth, updateHeight } = useDimensionUpdate({ componentId });

  const onPointerDown = useCallback(
    (event) => {
      event.preventDefault();
      onResizingStart(cursor);
    },
    [cursor, onResizingStart]
  );

  return (
    <motion.div
      onPointerDown={onPointerDown}
      onPointerUp={onResizingEnd}
      onPan={useCallback(
        (event, pointInfo) => {
          if (type === 'left') {
            const diffW = -pointInfo.offset.x;
            updateWidth(original.width.get() + diffW, event.ctrlKey);
          } else if (type === 'right') {
            const diffW = pointInfo.offset.x;
            updateWidth(original.width.get() + diffW, event.ctrlKey);
          } else if (type === 'top') {
            const diffH = -pointInfo.offset.y;
            updateHeight(original.height.get() + diffH, event.ctrlKey);
          } else if (type === 'bottom') {
            const diffH = pointInfo.offset.y;
            updateHeight(original.height.get() + diffH, event.ctrlKey);
          }
        },
        [original.height, original.width, type, updateHeight, updateWidth]
      )}
      style={{
        position: 'absolute',
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
  onResizingStart,
  onResizingEnd,
  componentId,
  original,
}) {
  const { updateWidth, updateHeight } = useDimensionUpdate({ componentId });

  const onPointerDown = useCallback(
    (event) => {
      event.preventDefault();
      onResizingStart(cursor);
    },
    [cursor, onResizingStart]
  );

  return (
    <motion.div
      onPointerDown={onPointerDown}
      onPointerUp={onResizingEnd}
      onPan={useCallback(
        (event, pointInfo) => {
          if (type.includes('left')) {
            const diffW = -pointInfo.offset.x;
            updateWidth(original.width.get() + diffW, event.ctrlKey);
          }
          if (type.includes('right')) {
            const diffW = pointInfo.offset.x;
            updateWidth(original.width.get() + diffW, event.ctrlKey);
          }
          if (type.includes('top')) {
            const diffH = -pointInfo.offset.y;
            updateHeight(original.height.get() + diffH, event.ctrlKey);
          }
          if (type.includes('bottom')) {
            const diffH = pointInfo.offset.y;
            updateHeight(original.height.get() + diffH, event.ctrlKey);
          }
        },
        [original.height, original.width, type, updateHeight, updateWidth]
      )}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        x,
        y,
        width,
        height,
        cursor,
        border: `1px solid ${theme.colors.primary[400]}`,
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

/**
 * Updates the dimensions of the component by the provided values. If a Ctrl key is
 * pressed during updation, then they are updated as % values rather than px values.
 */
function useDimensionUpdate({ componentId }) {
  const immerSet = useEditorStore(useCallback((state) => state.immerSet, []));
  const { getState: getRegionState } = useComponentRegionStoreApi();

  const updateWidth = useCallback(
    (width, isCtrl) => {
      let size = width <= 0 ? 0 : width;
      if (isCtrl) {
        // In percentage.
        const width = getRegionState().regionMap[componentId].width;
        size = Math.floor((size * 100) / width);
      } else {
        // In actual pixels.
        size = Math.floor(size);
      }

      immerSet((state) => {
        const props = state.componentMap[componentId].props;
        props.width ??= {};
        props.width.size = size;
        props.width.unit = isCtrl ? '%' : 'px';
      });
    },
    [componentId, getRegionState, immerSet]
  );

  const updateHeight = useCallback(
    (height, isCtrl) => {
      let size = height <= 0 ? 0 : height;
      if (isCtrl) {
        // In percentage.
        const height = getRegionState().regionMap[componentId].height;
        size = Math.floor((size * 100) / height);
      } else {
        // In actual pixels.
        size = Math.floor(size);
      }

      immerSet((state) => {
        const props = state.componentMap[componentId].props;

        props.height ??= {};
        props.height.size = size;
        props.height.unit = isCtrl ? '%' : 'px';
      });
    },
    [componentId, getRegionState, immerSet]
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
