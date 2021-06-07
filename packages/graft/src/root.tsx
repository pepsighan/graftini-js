import React, {
  createContext,
  DragEventHandler,
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
  useContext,
} from 'react';
import { GraftComponentProps } from './resolver';

/**
 * A canvas root component returns the children as-is.
 */
/** @internal */
export const Root__Graft__Component = forwardRef(
  ({ onDragOver, children }: GraftComponentProps, ref: ForwardedRef<any>) => {
    const RootOverrideComponent = useContext(RootOverrideContext);

    if (!RootOverrideComponent) {
      return (
        <div
          ref={ref}
          style={{ width: '100%', height: '100%', overflow: 'auto' }}
          onDragOver={onDragOver}
        >
          {children}
        </div>
      );
    }

    return <RootOverrideComponent ref={ref} onDragOver={onDragOver} />;
  }
);

/**
 * Context to override the default root component. The root component receives
 * a subset of Graft component props.
 */
/** @internal */
export const RootOverrideContext = createContext<RootComponent | null>(null);

export type RootComponent = ForwardRefExoticComponent<
  RefAttributes<{}> & {
    onDragOver: DragEventHandler;
  }
>;
