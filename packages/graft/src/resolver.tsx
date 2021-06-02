import {
  ComponentType,
  createContext,
  DragEvent,
  ElementType,
  EventHandler,
  ReactNode,
  useContext,
} from 'react';

/**
 * Resolvers is a map of components which are used to render based on the component names
 * in the editor state.
 */
export type ResolverMap = {
  [component: string]: GraftComponent<unknown>;
};

/**
 * The props that are available to components. All these props should be passed to as is for the
 * component to be made draggable within the canvas.
 */
export type GraftComponentProps = {
  onDragStart: EventHandler<DragEvent>;
  onDragOver?: EventHandler<DragEvent>;
  onDragLeave?: EventHandler<DragEvent>;
  draggable: true;
  children?: ReactNode;
};

/**
 * A component that defines additional behaviour in the context of Graft.
 */
export type GraftComponent<T> = ComponentType<GraftComponentProps & T> & {
  graftOptions?: GraftComponentOptions<T>;
};

/**
 * Configuration for the component.
 */
export type GraftComponentOptions<T> = {
  /**
   * The kind of display the component is. This is useful when showing drop markers.
   * The default value is block.
   */
  display?: 'block' | 'inline';
  /**
   * Whether this component is a canvas. If it is then the component must accept a children
   * prop.
   */
  isCanvas?: boolean;
  /**
   * The default properties of the component. This can also be provided during creation and
   * the values provided here will be overrided.
   */
  defaultProps?: T;
  /**
   *  A preview component that is shown while dragging this component.
   */
  preview?: ElementType;
};

/**
 * The context to provide resolver map down the tree.
 */
const ResolverContext = createContext<ResolverMap>({});

/**
 * Provider to provide a map of resolvers within the editor.
 */
/** @internal */
export const ResolverProvider = ResolverContext.Provider;

/**
 * Hook to get the component resolver within the editor.
 */
/** @internal */
export function useResolver(component: string): GraftComponent<any> {
  const map = useContext(ResolverContext);

  if (!map[component]) {
    throw new Error(`\`${component}\` is not registered in the Editor resolvers prop.`);
  }

  return map[component];
}