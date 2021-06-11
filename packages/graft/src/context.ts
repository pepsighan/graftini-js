import { createContext, useContext } from 'react';
import { RootComponent } from './componentTypes';

/**
 * Context to pass the id of the canvas to its children.
 */
/** @internal */
export const CanvasContext = createContext<string | null>(null);

/**
 * Hook to get the id of the nearest canvas. This canvas can be a root canvas or
 * a component which is also a canvas.
 */
export function useCanvasId(): string {
  return useContext(CanvasContext) as string;
}

/**
 * The context for passing id of the component to the children.
 */
/** @internal */
export const ComponentContext = createContext<string | null>(null);

/**
 * Use the id of the nearest component up in the tree.
 */
export function useComponentId(): string {
  return useContext(ComponentContext) as string;
}

/**
 * Context to override the default root component. The root component receives
 * a subset of Graft component props and some additional props.
 */
/** @internal */
export const RootOverrideContext = createContext<RootComponent<any> | null>(null);
