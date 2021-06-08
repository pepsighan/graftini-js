import React, { useCallback } from 'react';
import { DropKind, dropMarkerWidth } from './dropLocation';
import { DraggedOverStore, useDraggedOverStore } from './store/draggedOver';
import { isComponentWithinSubTree, useEditorStoreApiInternal } from './store/editor';

type DropMarkerProps = {
  color?: string;
};

/**
 * This is a component which signifies the drop location of an element that is being dragged.
 * It is shown whenever the pointer is in drag mode and the component preceding it is hovered.
 */
export function DropMarker({ color = '#9090DD' }: DropMarkerProps) {
  const isOnRoot = useDraggedOverStore(
    useCallback((state: DraggedOverStore) => !!state.draggedOver.isOnRoot, [])
  );

  const isDroppingAsChild = useDraggedOverStore(
    useCallback(
      (state: DraggedOverStore) => state.draggedOver.dropRegion?.dropKind === DropKind.AddAsChild,
      []
    )
  );

  const dropMarkerRegion = useDraggedOverStore(
    useCallback((state: DraggedOverStore) => state.draggedOver.dropRegion?.dropMarkerRegion, [])
  );

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

  // In case when dropping a component as a child in a canvas show outline to the canvas.
  // Elsewhere when dropping a component as a sibling, show a bar on the side that is going
  // to be dropped in.

  const showDropMarker = isOutsideSelf && isOnRoot && dropMarkerRegion;
  return (
    <>
      {showDropMarker && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            transform: `translate(${dropMarkerRegion!.x}px, ${dropMarkerRegion!.y}px)`,
            width: dropMarkerRegion!.width,
            height: dropMarkerRegion!.height,
            backgroundColor: isDroppingAsChild ? 'transparent' : color,
            border: isDroppingAsChild ? `${dropMarkerWidth}px solid ${color}` : undefined,
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  );
}
