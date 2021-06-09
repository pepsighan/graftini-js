import {
  createContext,
  DragEventHandler,
  ElementType,
  ForwardRefExoticComponent,
  ReactNode,
  useContext,
} from 'react';

/**
 * Resolvers is a map of components which are used to render based on the component names
 * in the editor state.
 */
export type ResolverMap = {
  [component: string]: GraftComponent<object>;
};

/**
 * The props that are available to components. All these props should be passed to as is for the
 * component to be made draggable within the canvas.
 */
export type GraftComponentProps = {
  onDragStart: DragEventHandler;
  onDrag: DragEventHandler;
  onDragEnd: DragEventHandler;
  onDragOver: DragEventHandler;
  draggable: boolean;
  children?: ReactNode;
};

/**
 * A component that defines additional behaviour in the context of Graft.
 */
export type GraftComponent<T extends object> = ForwardRefExoticComponent<
  GraftComponentProps & T
> & {
  graftOptions?: GraftComponentOptions<T>;
};

/**
 * Configuration for the component.
 */
export type GraftComponentOptions<T extends object> = {
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
/** @internal */
export const ResolverContext = createContext<ResolverMap>({});

/**
 * Provider to provide a map of resolvers within the editor.
 */
/** @internal */
export const ResolverProvider = ResolverContext.Provider;

/**
 * Hook to get the component referred to by the component name within the editor.
 */
/** @internal */
export function useResolveComponent(component: string): GraftComponent<any> {
  const map = useContext(ResolverContext);

  if (!map[component]) {
    throw new Error(`\`${component}\` is not registered in the Editor resolvers prop.`);
  }

  return map[component];
}
