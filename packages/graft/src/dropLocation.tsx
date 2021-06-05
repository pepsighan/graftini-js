import {
  ChildAppendDirection,
  cleanupComponentMap,
  ComponentMap,
  Position,
  ROOT_NODE_ID,
} from './schema';
import { Region } from './useRegion';

/**
 * Read the paper around how the drop location is identified:
 * https://www.notion.so/Drag-and-Drop-Location-Resolver-df4de60c835e409f849c9c8b959f2484
 */

/**
 * The width of the drop marker.
 */
const dropMarkerWidth = 4;

enum MarkerPosition {
  Start = 'front',
  End = 'end',
}

/**
 * Checks if the cursor is within the region.
 */
function isCursorWithinRegion(region: Region, cursor: Position): boolean {
  const isWithinXAxis = cursor.x >= region.x && cursor.x <= region.x + region.width;
  const isWithinYAxis = cursor.y >= region.y && cursor.y <= region.y + region.height;

  return isWithinXAxis && isWithinYAxis;
}

/**
 * Resolves the region for a drop marker for a component that is defined by [region].
 */
function resolveDropMarkerRegion(
  region: Region,
  whichMarker: MarkerPosition,
  childAppendDirection: ChildAppendDirection
): Region {
  if (childAppendDirection === 'vertical') {
    const x = region.x;
    const y = region.y - dropMarkerWidth;
    const width = region.width;
    const height = dropMarkerWidth;
    return { x, y, width, height };
  }

  const x = region.x - dropMarkerWidth;
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
    return (region.x + region.width) / 2;
  }

  return (region.y + region.height) / 2;
}

enum DropKind {
  PrependAsSibling = 'prependAsSibling',
  AppendAsSibling = 'appendAsSibling',
  AddAsChild = 'addAsChild',
}

type DropRegion = {
  componentId: string;
  region: Region;
  dropKind: DropKind;
};

/**
 * Identify the drop region where a new/old component should be dragged into.
 */
function identifyDropRegion(componentMap: ComponentMap, cursor: Position): DropRegion | null {
  const cleanMap = cleanupComponentMap(componentMap) as ComponentMap;

  // Incrementally try to identify the drop regions for each case. If it finds one at any point
  // then it immediately returns. This mechanism hard-codes the precedence of the drop regions
  // as outlined in the document.
  return (
    identifyMarkerDropRegion(cleanMap, cursor) ??
    identifyNonCanvasDropRegion(cleanMap, cursor) ??
    identifyEmptyCanvasDropRegion(cleanMap, cursor) ??
    identifyNonEmptyCanvasDropRegion(cleanMap, cursor)
  );
}

/**
 * Identifies a drop region if the cursor is over any drop marker.
 */
function identifyMarkerDropRegion(componentMap: ComponentMap, cursor: Position): DropRegion | null {
  const contenderDropRegions: DropRegion[] = [];

  // Go down the tree and collect as many marker drop regions as possible.
  identifyMarkerDropRegionForSubtree(componentMap, ROOT_NODE_ID, cursor, contenderDropRegions);

  // The last drop region has the lowest precedence, so select it.
  return contenderDropRegions.length > 0 ? contenderDropRegions.pop()! : null;
}

/**
 * Recursively goes down the tree testing out if the cursor is in the drop regions and if cursor
 * is in the drop regions, it appends to the list of contender drop regions.
 */
function identifyMarkerDropRegionForSubtree(
  componentMap: ComponentMap,
  componentId: string,
  cursor: Position,
  contenderDropRegions: DropRegion[]
) {
  const component = componentMap[componentId];
  const canvasId = nearestCanvasId(componentMap, componentId);

  if (!canvasId) {
    // There are no drop marker regions for the root canvas.
    return;
  }

  // If the cursor is in drop marker regions, then it could be the contender to be
  // the only drop region that is selected.

  const startRegion = resolveDropMarkerRegion(
    component.region,
    MarkerPosition.Start,
    componentMap[canvasId].childAppendDirection!
  );
  if (isCursorWithinRegion(startRegion, cursor)) {
    contenderDropRegions.push({
      componentId,
      region: startRegion,
      dropKind: DropKind.PrependAsSibling,
    });
  }

  const endRegion = resolveDropMarkerRegion(
    component.region,
    MarkerPosition.End,
    componentMap[canvasId].childAppendDirection!
  );
  if (isCursorWithinRegion(endRegion, cursor)) {
    contenderDropRegions.push({
      componentId,
      region: endRegion,
      dropKind: DropKind.AppendAsSibling,
    });
  }

  if (component.isCanvas) {
    component.childrenNodes.forEach((componentId) => {
      identifyMarkerDropRegionForSubtree(componentMap, componentId, cursor, contenderDropRegions);
    });
  }
}

/**
 * Identifies a drop region if the cursor is over a non canvas component.
 */
function identifyNonCanvasDropRegion(
  componentMap: ComponentMap,
  cursor: Position
): DropRegion | null {
  return null;
}

/**
 * Idenitifies a drop region if the cursor is over a canvas component that is empty.
 */
function identifyEmptyCanvasDropRegion(
  componentMap: ComponentMap,
  cursor: Position
): DropRegion | null {
  return null;
}

/**
 * Identifies a drop region if the cursor is over a canvas component that is not empty and
 * it is also not over any of the children components.
 */
function identifyNonEmptyCanvasDropRegion(
  componentMap: ComponentMap,
  cursor: Position
): DropRegion | null {
  return null;
}

/**
 * Gets the nearest canvas id up in the tree for the component.
 */
function nearestCanvasId(componentMap: ComponentMap, componentId: string): string | null {
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
