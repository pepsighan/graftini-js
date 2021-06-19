import { Box } from '@chakra-ui/react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEditor } from 'graft';
import { useCallback, useEffect } from 'react';
import { useDesignerState } from 'store/designer';

export default function ResizeableFrame({ componentId, ...rest }) {
  const { isFrozen, ...restFrozen } = useFrozenProps(rest);
  const { top, left, right, bottom } = useSidePositions(rest);

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
        cursor="row-resize"
        type="top"
        onPointerDown={onStartResizing}
        onPointerUp={onEndResizing}
      />
      {/* The right side. */}
      <FrameSide
        {...right}
        componentId={componentId}
        original={restFrozen}
        cursor="col-resize"
        type="right"
        onPointerDown={onStartResizing}
        onPointerUp={onEndResizing}
      />
      {/* The bottom side. */}
      <FrameSide
        {...bottom}
        componentId={componentId}
        original={restFrozen}
        cursor="row-resize"
        type="bottom"
        onPointerDown={onStartResizing}
        onPointerUp={onEndResizing}
      />
      {/* The left side. */}
      <FrameSide
        {...left}
        componentId={componentId}
        original={restFrozen}
        cursor="col-resize"
        type="left"
        onPointerDown={onStartResizing}
        onPointerUp={onEndResizing}
      />
    </>
  );
}

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
