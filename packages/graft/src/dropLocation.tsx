import { useCallback, useEffect } from 'react';
import {
  DraggedOverStore,
  Position,
  useDraggedOverStore,
  useDraggedOverStoreApi,
} from './store/draggedOver';
import {
  ChildAppendDirection,
  ComponentMap,
  ROOT_NODE_ID,
  useEditorStoreApi,
} from './store/editor';
import { ComponentRegionMap, useComponentRegionStoreApi } from './store/regionMap';
import { useRootScrollStoreApi } from './store/rootScroll';
import { Region } from './useRegion';

/**
 * Read the paper around how the drop location is identified:
 * https://www.notion.so/Drag-and-Drop-Location-Resolver-df4de60c835e409f849c9c8b959f2484
 */

export enum DropKind {
  PrependAsSibling = 'prependAsSibling',
  AppendAsSibling = 'appendAsSibling',
  AddAsChild = 'addAsChild',
}

export type DropRegion = {
  componentId: string;
  dropMarkerRegion: Region;
  dropKind: DropKind;
};

/**
 * The width of the drop marker.
 */
/** @internal */
export const dropMarkerWidth = 4;

enum MarkerPosition {
  Start = 'front',
  End = 'end',
}

/**
 * Sync the drop region to the state when the cursor position changes.
 */
export function useSyncDropRegion() {
  const immerSet = useDraggedOverStore(useCallback((state) => state.immerSet, []));
  const { subscribe: subscribeDraggedOver } = useDraggedOverStoreApi();
  const { getState: getEditorState } = useEditorStoreApi();
  const { getState: getComponentRegionState } = useComponentRegionStoreApi();
  const { getState: getRootScrollState } = useRootScrollStoreApi();

  useEffect(() => {
    // Only react to when the cursor position changes.
    return subscribeDraggedOver(
      () => {
        immerSet((state: DraggedOverStore) => {
          // Only update the drop region if the cursor is being dragged.
          if (state.draggedOver.isDragging && state.draggedOver.cursorPosition) {
            const scrollPosition = getRootScrollState().position;
            const resolvedCursorPosition = {
              x: state.draggedOver.cursorPosition.x + scrollPosition.x,
              y: state.draggedOver.cursorPosition.y + scrollPosition.y,
            };

            const dropRegion = identifyDropRegion(
              getEditorState().componentMap,
              getComponentRegionState().regionMap,
              resolvedCursorPosition
            );
            state.draggedOver.dropRegion = dropRegion;

            if (!state.draggedOver.dropRegion || !dropRegion) {
              return;
            }

            state.draggedOver.dropRegion.dropMarkerRegion = {
              ...dropRegion.dropMarkerRegion,
              x: dropRegion.dropMarkerRegion.x - scrollPosition.x,
              y: dropRegion.dropMarkerRegion.y - scrollPosition.y,
            };
          }
        });
      },
      (state) => state.draggedOver.cursorPosition
    );
  }, [getComponentRegionState, getEditorState, getRootScrollState, immerSet, subscribeDraggedOver]);
}

/**
 * Identify the drop region where a new/old component should be dragged into.
 */
export function identifyDropRegion(
  componentMap: ComponentMap,
  regionMap: ComponentRegionMap,
  cursor: Position
): DropRegion | null {
  // Incrementally try to identify the drop regions for each case. If it finds one at any point
  // then it immediately returns. This mechanism hard-codes the precedence of the drop regions
  // as outlined in the document.
  return (
    identifyMarkerDropRegion(componentMap, regionMap, cursor) ??
    identifyNonCanvasDropRegion(componentMap, regionMap, cursor) ??
    identifyEmptyCanvasDropRegion(componentMap, regionMap, cursor) ??
    identifyNonEmptyCanvasDropRegion(componentMap, regionMap, cursor)
  );
}

/**
 * Adds the component to the component map based on the drop region.
 */
export function addComponentToDropRegion(
  componentId: string,
  dropRegion: DropRegion,
  componentMap: ComponentMap
) {
  const { dropKind, componentId: dropReferenceComponentId } = dropRegion;

  if (dropKind === DropKind.AddAsChild) {
    // Add the dragged component as a child of the component and it becomes the parent.
    const parentId = dropReferenceComponentId;
    componentMap[parentId].childrenNodes.push(componentId);

    componentMap[parentId].childrenNodes = [...componentMap[parentId].childrenNodes];
    componentMap[componentId].parentId = parentId;
  } else {
    // Add the dragged component to the canvas before or after the componentId as it is
    // the sibling.
    const canvasId = nearestCanvasId(componentMap, dropReferenceComponentId);
    const index = componentMap[canvasId!].childrenNodes.indexOf(dropReferenceComponentId);

    if (dropKind === DropKind.AppendAsSibling) {
      componentMap[canvasId!].childrenNodes.splice(index + 1, 0, componentId);
    } else {
      componentMap[canvasId!].childrenNodes.splice(index, 0, componentId);
    }

    componentMap[canvasId!].childrenNodes = [...componentMap[canvasId!].childrenNodes];
    componentMap[componentId].parentId = canvasId;
  }
}

/**
 * Checks if the cursor is within the region.
 */
/** @internal */
export function isCursorWithinRegion(region: Region, cursor: Position): boolean {
  const isWithinXAxis = cursor.x >= region.x && cursor.x <= region.x + region.width;
  const isWithinYAxis = cursor.y >= region.y && cursor.y <= region.y + region.height;

  return isWithinXAxis && isWithinYAxis;
}

/**
 * Resolves the region for a drop marker for a component that is defined by [region].
 * The marker is a thin strip just outside the region on either side of it.
 */
function resolveDropMarkerRegion(
  region: Region,
  whichMarker: MarkerPosition,
  childAppendDirection: ChildAppendDirection
): Region {
  if (childAppendDirection === 'vertical') {
    if (whichMarker === MarkerPosition.Start) {
      const x = region.x;
      const y = region.y - dropMarkerWidth;
      const width = region.width;
      const height = dropMarkerWidth;
      return { x, y, width, height };
    }

    const x = region.x;
    const y = region.y + region.height;
    const width = region.width;
    const height = dropMarkerWidth;
    return { x, y, width, height };
  }

  if (whichMarker === MarkerPosition.Start) {
    const x = region.x - dropMarkerWidth;
    const y = region.y;
    const width = dropMarkerWidth;
    const height = region.height;
    return { x, y, width, height };
  }

  const x = region.x + region.width;
  const y = region.y;
  const width = dropMarkerWidth;
  const height = region.height;
  return { x, y, width, height };
}

/**
 * Resolves the center of gravity for a region in a given child append direction. This
 * is the midpoint in a given axis.
 */
function resolveCenterOfGravity(
  region: Region,
  childAppendDirection: ChildAppendDirection
): number {
  if (childAppendDirection === 'horizontal') {
    return region.x + region.width / 2;
  }

  return region.y + region.height / 2;
}

/**
 * Slice the region into two based on how you slice them.
 */
function sliceRegionInHalf(
  region: Region,
  childAppendDirection: ChildAppendDirection
): [Region, Region] {
  if (childAppendDirection === 'horizontal') {
    return [
      { x: region.x, y: region.y, width: region.width / 2, height: region.height },
      {
        x: region.x + region.width / 2,
        y: region.y,
        width: region.width / 2,
        height: region.height,
      },
    ];
  }

  return [
    { x: region.x, y: region.y, width: region.width, height: region.height / 2 },
    {
      x: region.x,
      y: region.y + region.height / 2,
      width: region.width,
      height: region.height / 2,
    },
  ];
}

/**
 * Identifies a drop region if the cursor is over any drop marker.
 */
function identifyMarkerDropRegion(
  componentMap: ComponentMap,
  regionMap: ComponentRegionMap,
  cursor: Position
): DropRegion | null {
  const contenderDropRegions: DropRegion[] = [];

  // Go down the tree and collect as many marker drop regions as possible.
  const root = componentMap[ROOT_NODE_ID];
  root.childrenNodes.forEach((componentId) => {
    identifyMarkerDropRegionForSubtree(
      componentMap,
      regionMap,
      cursor,
      componentId,
      contenderDropRegions
    );
  });

  // The last drop region has the lowest precedence, so select it.
  return contenderDropRegions.pop() ?? null;
}

/**
 * Recursively goes down the tree testing out if the cursor is in the drop regions and if cursor
 * is in the drop regions, it appends to the list of contender drop regions.
 */
function identifyMarkerDropRegionForSubtree(
  componentMap: ComponentMap,
  regionMap: ComponentRegionMap,
  cursor: Position,
  componentId: string,
  contenderDropRegions: DropRegion[]
) {
  const component = componentMap[componentId];
  const region = regionMap[componentId];
  const canvasId = nearestCanvasId(componentMap, componentId)!;

  const childAppendDirection = componentMap[canvasId!].childAppendDirection!;

  // If the cursor is in drop marker regions, then it could be the contender to be
  // the only drop region that is selected.

  const startRegion = resolveDropMarkerRegion(region, MarkerPosition.Start, childAppendDirection);

  if (isCursorWithinRegion(startRegion, cursor)) {
    contenderDropRegions.push({
      componentId,
      dropMarkerRegion: startRegion,
      dropKind: DropKind.PrependAsSibling,
    });
  }

  const endRegion = resolveDropMarkerRegion(region, MarkerPosition.End, childAppendDirection);
  if (isCursorWithinRegion(endRegion, cursor)) {
    contenderDropRegions.push({
      componentId,
      dropMarkerRegion: endRegion,
      dropKind: DropKind.AppendAsSibling,
    });
  }

  if (component.isCanvas) {
    component.childrenNodes.forEach((componentId) => {
      identifyMarkerDropRegionForSubtree(
        componentMap,
        regionMap,
        cursor,
        componentId,
        contenderDropRegions
      );
    });
  }
}

/**
 * Identifies a drop region if the cursor is over a non canvas component.
 */
function identifyNonCanvasDropRegion(
  componentMap: ComponentMap,
  regionMap: ComponentRegionMap,
  cursor: Position
): DropRegion | null {
  // We are checking for the non-canvas components without recursion because these
  // are leaf components.
  for (let componentId of Object.keys(componentMap)) {
    const component = componentMap[componentId];
    const region = regionMap[componentId];

    // Ignore the canvas components.
    if (component.isCanvas) {
      continue;
    }

    // Canvas Id is absolutely present, because a non-canvas component can only be present
    // in a canvas.
    const canvasId = nearestCanvasId(componentMap, componentId)!;
    const childAppendDirection = componentMap[canvasId].childAppendDirection!;

    // Try to check if the cursor is on the starting or ending half.
    const [startHalf, endHalf] = sliceRegionInHalf(region, childAppendDirection);

    if (isCursorWithinRegion(startHalf, cursor)) {
      const dropMarker = resolveDropMarkerRegion(
        region,
        MarkerPosition.Start,
        childAppendDirection
      );

      return {
        componentId,
        dropMarkerRegion: dropMarker,
        dropKind: DropKind.PrependAsSibling,
      };
    }

    if (isCursorWithinRegion(endHalf, cursor)) {
      const dropMarker = resolveDropMarkerRegion(region, MarkerPosition.End, childAppendDirection);

      return {
        componentId,
        dropMarkerRegion: dropMarker,
        dropKind: DropKind.AppendAsSibling,
      };
    }
  }

  return null;
}

/**
 * Idenitifies a drop region if the cursor is over a canvas component that is empty.
 */
function identifyEmptyCanvasDropRegion(
  componentMap: ComponentMap,
  regionMap: ComponentRegionMap,
  cursor: Position
): DropRegion | null {
  // We can check for empty canvases without recursion because the ones we are interested
  // in are leaf canvas components anyways.
  for (let componentId of Object.keys(componentMap)) {
    const component = componentMap[componentId];
    const region = regionMap[componentId];

    if (!component.isCanvas) {
      continue;
    }
    if (component.childrenNodes.length !== 0) {
      continue;
    }

    if (isCursorWithinRegion(region, cursor)) {
      return {
        componentId,
        dropMarkerRegion: region,
        dropKind: DropKind.AddAsChild,
      };
    }
  }

  return null;
}

/**
 * Identifies a drop region if the cursor is over a canvas component that is not empty and
 * it is also not over any of the children components.
 */
function identifyNonEmptyCanvasDropRegion(
  componentMap: ComponentMap,
  regionMap: ComponentRegionMap,
  cursor: Position
): DropRegion | null {
  const contenderCanvasComponents: string[] = [];

  // Try to fill all the canvas components that are not empty which are under the cursor.
  identifyNonEmptyCanvasesForSubtree(
    ROOT_NODE_ID,
    componentMap,
    regionMap,
    cursor,
    contenderCanvasComponents
  );

  if (contenderCanvasComponents.length === 0) {
    // None found.
    return null;
  }

  const selectedCanvasId = contenderCanvasComponents.pop()!;
  const canvas = componentMap[selectedCanvasId];

  for (let index = 0; index < canvas.childrenNodes.length + 1; index++) {
    const [component, region] =
      index !== canvas.childrenNodes.length
        ? [componentMap[canvas.childrenNodes[index]], regionMap[canvas.childrenNodes[index]]]
        : [null, null];

    const center = component ? resolveCenterOfGravity(region!, canvas.childAppendDirection!) : null;

    // For the first item, check if the cursor is before it. If the cursor if before it,
    // then prepend the new component before it.
    if (index === 0) {
      if (isCursorBeforeTheCenterOfComponent(cursor, canvas.childAppendDirection!, center!)) {
        return {
          componentId: component!.id,
          dropMarkerRegion: resolveDropMarkerRegion(
            region!,
            MarkerPosition.Start,
            canvas.childAppendDirection!
          ),
          dropKind: DropKind.PrependAsSibling,
        };
      }

      continue;
    }

    // This component is always present on 2nd loop onward.
    const previousComponent = componentMap[canvas.childrenNodes[index - 1]];
    const previousRegion = regionMap[canvas.childrenNodes[index - 1]];
    const previousCenter = resolveCenterOfGravity(previousRegion, canvas.childAppendDirection!);

    // For the last item, check if the cursor is after it. If it is after the last item,
    // then append the new component after it.
    if (index === canvas.childrenNodes.length) {
      if (isCursorAfterTheCenterOfComponent(cursor, canvas.childAppendDirection!, previousCenter)) {
        return {
          componentId: previousComponent!.id,
          dropMarkerRegion: resolveDropMarkerRegion(
            previousRegion,
            MarkerPosition.End,
            canvas.childAppendDirection!
          ),
          dropKind: DropKind.AppendAsSibling,
        };
      }

      continue;
    }

    // For the non-boundary child components, check if the cursor is between them.
    if (
      isCursorAfterTheCenterOfComponent(cursor, canvas.childAppendDirection!, previousCenter) &&
      isCursorBeforeTheCenterOfComponent(cursor, canvas.childAppendDirection!, center!)
    ) {
      // The cursor is in-between the previous and the current component.

      if (cursor.x - previousCenter < center! - cursor.x) {
        // The cursor is near to the previous component.
        return {
          componentId: previousComponent.id,
          dropMarkerRegion: resolveDropMarkerRegion(
            previousRegion,
            MarkerPosition.End,
            canvas.childAppendDirection!
          ),
          dropKind: DropKind.AppendAsSibling,
        };
      }

      // The cursor is near to the current component.
      return {
        componentId: component!.id,
        dropMarkerRegion: resolveDropMarkerRegion(
          region!,
          MarkerPosition.Start,
          canvas.childAppendDirection!
        ),
        dropKind: DropKind.PrependAsSibling,
      };
    }
  }

  return null;
}

/**
 * Identifies a list of canvases which are not empty and onto which the cursor is hovering.
 */
function identifyNonEmptyCanvasesForSubtree(
  componentId: string,
  componentMap: ComponentMap,
  regionMap: ComponentRegionMap,
  cursor: Position,
  contenderCanvasComponents: string[]
) {
  const component = componentMap[componentId];
  const region = regionMap[componentId];
  if (!component.isCanvas) {
    return;
  }

  if (!isCursorWithinRegion(region, cursor)) {
    // The cursor is not on this canvas, so ignore this tree.
    return;
  }

  contenderCanvasComponents.push(componentId);

  // Do the same for all its children.
  component.childrenNodes.forEach((nestedComponentId) => {
    identifyNonEmptyCanvasesForSubtree(
      nestedComponentId,
      componentMap,
      regionMap,
      cursor,
      contenderCanvasComponents
    );
  });
}

/**
 * Gets the nearest canvas id up in the tree for the component.
 */
export function nearestCanvasId(componentMap: ComponentMap, componentId: string): string | null {
  const parentId = componentMap[componentId].parentId;
  if (!parentId) {
    // Only in the case
    return null;
  }

  if (componentMap[parentId].isCanvas) {
    return parentId;
  }

  return nearestCanvasId(componentMap, parentId);
}

function isCursorBeforeTheCenterOfComponent(
  cursor: Position,
  childAppendDirection: ChildAppendDirection,
  center: number
): boolean {
  if (childAppendDirection === 'horizontal') {
    return cursor.x <= center;
  }
  return cursor.y <= center;
}

function isCursorAfterTheCenterOfComponent(
  cursor: Position,
  childAppendDirection: ChildAppendDirection,
  center: number
): boolean {
  if (childAppendDirection === 'horizontal') {
    return cursor.x >= center;
  }
  return cursor.y >= center;
}
