import React, {
  createContext,
  DragEventHandler,
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
  UIEvent,
  UIEventHandler,
  useCallback,
  useContext,
} from 'react';
import { GraftComponentProps } from './resolver';
import { useRootScrollStoreApi } from './store/rootScroll';

/**
 * A canvas root component returns the children as-is.
 */
/** @internal */
export const Root__Graft__Component = forwardRef(
  ({ onDragOver, children }: GraftComponentProps, ref: ForwardedRef<any>) => {
    const { setState } = useRootScrollStoreApi();

    const onScroll = useCallback(
      (event: UIEvent) => {
        setState({
          top: event.currentTarget.scrollTop,
          left: event.currentTarget.scrollLeft,
        });
      },
      [setState]
    );

    const RootOverrideComponent = useContext(RootOverrideContext);
    if (!RootOverrideComponent) {
      return (
        <div
          ref={ref}
          style={{ width: '100%', height: '100%', overflow: 'auto' }}
          onDragOver={onDragOver}
          onScroll={onScroll}
        >
          {children}
        </div>
      );
    }

    return <RootOverrideComponent ref={ref} onDragOver={onDragOver} onScroll={onScroll} />;
  }
);

/**
 * Context to override the default root component. The root component receives
 * a subset of Graft component props and some additional props.
 */
/** @internal */
export const RootOverrideContext = createContext<RootComponent | null>(null);

export type RootComponent = ForwardRefExoticComponent<
  RefAttributes<{}> & {
    onDragOver: DragEventHandler;
    onScroll: UIEventHandler;
  }
>;
