import { createContext } from 'react';
import { Position } from './store/draggedOver';

/**
 * The context which provides the correction that is accounted for when dragging and
 * dropping within an iframe.
 */
/** @internal */
export const IFrameCorrectionContext = createContext<Position | null>(null);
