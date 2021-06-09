import { motion, useMotionValue } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { DropKind, dropMarkerWidth, DropRegion } from './dropLocation';
import { DraggedOverStore, useDraggedOverStore, useDraggedOverStoreApi } from './store/draggedOver';
import { isComponentWithinSubTree, useEditorStoreApiInternal } from './store/editor';

export type DropMarkerProps = {
  color?: string;
};

/**
 * This is a component which signifies the drop location of an element that is being dragged.
 * It is shown whenever the pointer is in drag mode and the component preceding it is hovered.
 */
export function DropMarker({ color = '#9090DD' }: DropMarkerProps) {
  const backgroundColor = useMotionValue(color);
  const border = useMotionValue<string | null>(null);
  const [isDraggingOnRoot, setIsDraggingOnRoot] = useState(false);
  const posX = useMotionValue(0);
  const posY = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);

  const { getState } = useEditorStoreApiInternal();
  const isOutsideSelf = useDraggedOverStore(
    useCallback(
      (state: DraggedOverStore) => {
        if (!state.draggedOver.component || !state.draggedOver.dropRegion) {
          return true;
        }

        // Do not show the marker if dropping over self.
        return !isComponentWithinSubTree(
          state.draggedOver.component.id,
          state.draggedOver.dropRegion.componentId,
          getState().componentMap
        );
      },
      [getState]
    )
  );

  const { subscribe } = useDraggedOverStoreApi();
  useEffect(() => {
    return subscribe(
      (dropRegion?: DropRegion | null) => {
        if (dropRegion?.dropKind === DropKind.AddAsChild) {
          backgroundColor.set('transparent');
          border.set(`${dropMarkerWidth}px solid ${color}`);
        } else {
          backgroundColor.set(color);
          border.set(null);
        }

        setIsDraggingOnRoot(!!dropRegion);

        if (dropRegion?.dropMarkerRegion) {
          posX.set(dropRegion.dropMarkerRegion.x);
          posY.set(dropRegion.dropMarkerRegion.y);
          width.set(dropRegion.dropMarkerRegion.width);
          height.set(dropRegion.dropMarkerRegion.height);
        } else {
          posX.set(0);
          posY.set(0);
          width.set(0);
          height.set(0);
        }
      },
      (state) => state.draggedOver.dropRegion
    );
  }, [backgroundColor, border, color, height, posX, posY, subscribe, width]);

  // In case when dropping a component as a child in a canvas show outline to the canvas.
  // Elsewhere when dropping a component as a sibling, show a bar on the side that is going
  // to be dropped in.
  return (
    <>
      {isDraggingOnRoot && isOutsideSelf && (
        <motion.div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            x: posX,
            y: posY,
            width,
            height,
            backgroundColor,
            border,
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  );
}
