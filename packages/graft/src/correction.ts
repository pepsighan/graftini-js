import { createContext, useCallback, useContext } from 'react';
import { Position } from './store/draggedOver';

/**
 * The context which provides the correction that is accounted for when dragging and
 * dropping within an iframe.
 */
/** @internal */
export const IFrameCorrectionContext = createContext<Position | null>(null);

type CorrectCursorPosition = (position: Position, isCursorOnRoot: boolean) => Position;

/** Corrects the cursor position based on where the cursor is. */
/** @internal */
export function useCorrectCursorPosition(): CorrectCursorPosition {
  const correction = useContext(IFrameCorrectionContext);

  return useCallback(
    (position, isCursorOnRoot) => {
      if (!isCursorOnRoot && correction) {
        return {
          x: position.x - correction.x,
          y: position.y - correction.y,
        };
      }

      return position;
    },
    [correction]
  );
}
