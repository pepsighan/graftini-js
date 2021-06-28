import { MouseEventHandler, useCallback } from 'react';
import { isCursorWithinRegion } from './dropLocation';
import { Position } from './store/draggedOver';
import { ComponentMap, ROOT_NODE_ID, useEditorStoreApi } from './store/editor';
import { HoverStore, useHoverStore } from './store/hover';
import { ComponentRegionMap, useComponentRegionStoreApi } from './store/regionMap';
import { useRootScrollStoreApi } from './store/rootScroll';
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
  const immerSet = useHoverStore(useCallback((state: HoverStore) => state.immerSet, []));

  const { getState: getEditorState } = useEditorStoreApi();
  const { getState: getRegionState } = useComponentRegionStoreApi();
  const { getState: getScrollState } = useRootScrollStoreApi();

  return useCallback(
    (event) => {
      const scrollPos = getScrollState().position;

      const position = {
        x: event.clientX,
        y: event.clientY,
      };
      const realPosition = {
        x: position.x + scrollPos.x,
        y: position.y + scrollPos.y,
      };

      // Track where the cursor is hovering at.
      immerSet((state) => {
        const hoverRegion = identifyHoverRegion(
          getEditorState().componentMap,
          getRegionState().regionMap,
          realPosition
        );
        state.hoverRegion = hoverRegion;
        state.cursorPosition = position;

        if (state.hoverRegion) {
          // Update the position of the component based on the scroll position.
          state.hoverRegion.region.x = hoverRegion!.region.x - scrollPos.x;
          state.hoverRegion.region.y = hoverRegion!.region.y - scrollPos.y;
        }
      });
    },
    [getEditorState, getRegionState, getScrollState, immerSet]
  );
}

/**
 * Update the hover region when the scroll updates. The cursor position may not
 * have changed.
 */
export function useRefreshHoverRegion(): Function {
  const immerSet = useHoverStore(useCallback((state: HoverStore) => state.immerSet, []));
  const { getState: getEditorState } = useEditorStoreApi();
  const { getState: getRegionState } = useComponentRegionStoreApi();

  return useCallback(
    (scrollPosition: Position) => {
      // Track where the cursor is hovering at.
      immerSet((state) => {
        if (!state.cursorPosition) {
          return;
        }

        const realPosition = {
          x: state.cursorPosition.x + scrollPosition.x,
          y: state.cursorPosition.y + scrollPosition.y,
        };

        const hoverRegion = identifyHoverRegion(
          getEditorState().componentMap,
          getRegionState().regionMap,
          realPosition
        );

        state.hoverRegion = hoverRegion;
        if (state.hoverRegion) {
          // Update the position of the component based on the scroll position.
          state.hoverRegion.region.x = hoverRegion!.region.x - scrollPosition.x;
          state.hoverRegion.region.y = hoverRegion!.region.y - scrollPosition.y;
          return;
        }
      });
    },
    [getEditorState, getRegionState, immerSet]
  );
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
    // The region map may be read-only if the region map is from the store.
    region: { ...regionMap[leafId] },
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

  if (!region) {
    // The region may not be available if its a newly rendered component.
    // It will be available in the next cycle.
    return null;
  }

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
