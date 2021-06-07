import React, { useCallback } from 'react';
import { DraggedOverStore, useDraggedOverStore } from './store/draggedOver';

type DropMarkerProps = {
  color?: string;
};

/**
 * This is a component which signifies the drop location of an element that is being dragged.
 * It is shown whenever the pointer is in drag mode and the component preceding it is hovered.
 */
export function DropMarker({ color = '#9090DD' }: DropMarkerProps) {
  const isOnCanvas = useDraggedOverStore(
    useCallback((state: DraggedOverStore) => state.draggedOver.dropRegion?.componentId, [])
  );

  const dropMarkerRegion = useDraggedOverStore(
    useCallback((state: DraggedOverStore) => state.draggedOver.dropRegion?.dropMarkerRegion, [])
  );

  return (
    <>
      {dropMarkerRegion && isOnCanvas && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            transform: `translate(${dropMarkerRegion.x}px, ${dropMarkerRegion.y}px)`,
            width: dropMarkerRegion.width,
            height: dropMarkerRegion.height,
            backgroundColor: color,
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  );
}
