import { ROOT_NODE_ID, useCreateComponentStore, useHoverStoreApi } from '@graftini/graft';
import { motion, useMotionValue } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useDesignerState } from 'store/designer';
import theme from 'utils/theme';

export default function HoverOutline() {
  const [isVisible, setIsVisible] = useState(false);
  const isDrawingNew = useCreateComponentStore(useCallback((state) => !!state.newComponent, []));

  // Do not show the hover outline when a resize operation is ongoing.
  const isBoxResizing = useDesignerState(useCallback((state) => state.isBoxResizing, []));

  const { subscribe: subscribeHover } = useHoverStoreApi();

  const posX = useMotionValue(0);
  const posY = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);

  useEffect(() => {
    return subscribeHover(
      (state) => {
        // Do not show the outline when on root.
        if (state && state.componentId !== ROOT_NODE_ID) {
          posX.set(state.region.x);
          posY.set(state.region.y);
          width.set(state.region.width);
          height.set(state.region.height);
          setIsVisible(true);
          return;
        }

        posX.set(0);
        posY.set(0);
        width.set(0);
        height.set(0);
        setIsVisible(false);
      },
      (state) => (state.isOnIFrame ? state.hoverRegion : null)
    );
  }, [height, posX, posY, subscribeHover, width]);

  return (
    <>
      {isVisible && !isDrawingNew && !isBoxResizing && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            x: posX,
            y: posY,
            width,
            height,
            border: `1px solid ${theme.colors.primary[400]}`,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      )}
    </>
  );
}
