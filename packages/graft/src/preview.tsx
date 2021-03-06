import { motion, useMotionValue } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { is3pxAway } from './drag';
import { useDraggedOverStoreApi } from './store/draggedOver';
import { useComponentRegionStoreApi } from './store/regionMap';

type DragPreviewProps = {
  color: string;
};

/**
 * Shows a drag preview which is snapped to the cursor.
 */
export function DragPreview({ color = '#9090DD' }: DragPreviewProps) {
  const { subscribe, getState: getDragState } = useDraggedOverStoreApi();
  const { getState: getRegionState } = useComponentRegionStoreApi();

  const [isVisible, setIsVisible] = useState(false);
  const posX = useMotionValue(0);
  const posY = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);

  useEffect(() => {
    return subscribe(
      (selection: any) => {
        const region = selection.componentId
          ? getRegionState().regionMap[selection.componentId]
          : null;

        // Only when the cursor has dragged 3px from the original point can it be deemed
        // to be a drag operation.
        const drag = getDragState().draggedOver;
        const threePxAway = drag?.cursorPosition
          ? is3pxAway(drag.initialCursorPosition!, drag.cursorPosition)
          : false;

        if (
          selection.componentId &&
          selection.position &&
          selection.isOnIFrame &&
          region &&
          threePxAway
        ) {
          setIsVisible(true);
          posX.set(selection.position.x - region.width / 2);
          posY.set(selection.position.y - region.height / 2);
          width.set(region.width);
          height.set(region.height);
          return;
        }

        posX.set(0);
        posY.set(0);
        width.set(0);
        height.set(0);
        setIsVisible(false);
      },
      (state) => ({
        componentId: state.draggedOver.component?.id,
        position: state.draggedOver.cursorPosition,
        isOnIFrame: state.draggedOver.isOnIFrame,
      }),
      (left, right) =>
        left.componentId === right.componentId &&
        left.position?.x === right.position?.x &&
        left.position?.y === right.position?.y &&
        left.isOnIFrame === right.isOnIFrame
    );
  }, [getDragState, getRegionState, height, posX, posY, subscribe, width]);

  return (
    <>
      {isVisible && (
        <motion.div
          style={{
            display: 'inline-block',
            position: 'fixed',
            top: 0,
            left: 0,
            x: posX,
            y: posY,
            width,
            height,
            border: `1px solid ${color}`,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      )}
    </>
  );
}
