import { ROOT_NODE_ID, useCreateComponentStore, useHoverStoreApi } from '@graftini/graft';
import { useTheme } from '@material-ui/core';
import { motion, useMotionValue } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useDesignerState, useDesignerStateApi } from 'store/designer';

export default function HoverOutline() {
  const [isVisible, setIsVisible] = useState(false);
  const isDrawingNew = useCreateComponentStore(useCallback((state) => !!state.newComponent, []));
  const { getState: getDesignerState } = useDesignerStateApi();

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
        const selectedComponentId = getDesignerState().selectedComponentId;

        // Do not show the outline when on root or when the component is already selected
        // (& has an outline).
        if (
          state &&
          state.componentId !== ROOT_NODE_ID &&
          state.componentId !== selectedComponentId
        ) {
          // The position of the outline is put 1px outside on all sides
          // so that the content (border or text caret) is not hidden under
          // outline.
          posX.set(state.region.x - 1);
          posY.set(state.region.y - 1);
          width.set(state.region.width + 2);
          height.set(state.region.height + 2);
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
  }, [getDesignerState, height, posX, posY, subscribeHover, width]);

  const { palette } = useTheme();

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
            border: `1px solid ${palette.primary[400]}`,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      )}
    </>
  );
}
