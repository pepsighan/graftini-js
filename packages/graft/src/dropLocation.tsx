import { ChildAppendDirection, ComponentMap, Position, ROOT_NODE_ID } from './schema';
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
  // Incrementally try to identify the drop regions for each case. If it finds one at any point
  // then it immediately returns. This mechanism hard-codes the precedence of the drop regions
  // as outlined in the document.
  return (
    identifyMarkerDropRegion(componentMap, cursor) ??
    identifyNonCanvasDropRegion(componentMap, cursor) ??
    identifyEmptyCanvasDropRegion(componentMap, cursor) ??
    identifyNonEmptyCanvasDropRegion(componentMap, cursor)
  );
}

/**
 * Identifies a drop region if the cursor is over any drop marker.
 */
function identifyMarkerDropRegion(componentMap: ComponentMap, cursor: Position): DropRegion | null {
  return null;
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
