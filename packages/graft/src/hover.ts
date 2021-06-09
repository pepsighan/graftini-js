import { MouseEventHandler, useCallback } from 'react';
import { useCorrectCursorPosition } from './correction';
import { isCursorWithinRegion } from './dropLocation';
import { Position } from './store/draggedOver';
import { ComponentMap, ROOT_NODE_ID, useEditorStoreApiInternal } from './store/editor';
import { HoverStore, useHoverStore } from './store/hover';
import { ComponentRegionMap, useComponentRegionStoreApi } from './store/regionMap';
import { Region } from './useRegion';

export type HoverRegion = {
  componentId: string;
  region: Region;
};

/**
 * Sync the hover region to the store when the cursor is on the canvas.
 */
/** @internal */
export function useSyncHoverRegion(): MouseEventHandler {
  const immerSetHover = useHoverStore(useCallback((state: HoverStore) => state.immerSet, []));

  const { getState: getEditorState } = useEditorStoreApiInternal();
  const { getState: getRegionState } = useComponentRegionStoreApi();
  const correctCursorPosition = useCorrectCursorPosition();

  return useCallback((event) => {
    const position = {
      x: event.clientX,
      y: event.clientY,
    };

    // Track where the cursor is hovering at.
    immerSetHover((state) => {
      const hoverRegion = identifyHoverRegion(
        getEditorState().componentMap,
        getRegionState().regionMap,
        correctCursorPosition(position, state.isOnRoot)
      );
      state.hoverRegion = hoverRegion;
    });
  }, []);
}

/**
 * Identify the region where the cursor is currently hovering.
 */
/** @internal */
export function identifyHoverRegion(
  componentMap: ComponentMap,
  regionMap: ComponentRegionMap,
  cursor: Position
): HoverRegion | null {
  // This will list all the components that the cursor is over. Only the leaf component is going to
  // be selected.
  const contenderIds: string[] = [];
  // Find the leaf component that is being hovered over.
  identifyHoveredComponentForSubtree(ROOT_NODE_ID, componentMap, regionMap, cursor, contenderIds);

  const leafId = contenderIds.pop();
  if (!leafId) {
    return null;
  }

  return {
    componentId: leafId,
    region: regionMap[leafId],
  };
}

function identifyHoveredComponentForSubtree(
  componentId: string,
  componentMap: ComponentMap,
  regionMap: ComponentRegionMap,
  cursor: Position,
  contenderIds: string[]
) {
  const component = componentMap[componentId];
  const region = regionMap[componentId];

  const isInRegion = isCursorWithinRegion(region, cursor);
  if (!isInRegion) {
    return null;
  }

  contenderIds.push(componentId);

  if (component.isCanvas) {
    component.childrenNodes.forEach((id) => {
      identifyHoveredComponentForSubtree(id, componentMap, regionMap, cursor, contenderIds);
    });
  }
}
