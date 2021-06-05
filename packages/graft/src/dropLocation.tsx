import { ChildAppendDirection, Position } from './schema';
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
