import {
  ForwardRefExoticComponent,
  MouseEventHandler,
  ReactNode,
  RefAttributes,
  UIEventHandler,
} from 'react';

export type RootComponent<T extends object> = ForwardRefExoticComponent<
  RefAttributes<{}> & {
    onScroll: UIEventHandler;
    onMouseUp: MouseEventHandler;
    onMouseDown: MouseEventHandler;
    onMouseMove: MouseEventHandler;
    children: ReactNode;
  } & T
> & {
  graftOptions?: GraftComponentOptions<T>;
};

/**
 * The props that are available to components. All these props should be passed to as is for the
 * component to be made draggable within the canvas.
 */
export type GraftComponentProps = {
  /**
   * This event handler triggers a drag operation.
   */
  onMouseDown?: MouseEventHandler | null;
  /**
   * This event commits the new location of the component.
   */
  onMouseUp?: MouseEventHandler | null;
  /**
   * The children of the component.
   */
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
};
