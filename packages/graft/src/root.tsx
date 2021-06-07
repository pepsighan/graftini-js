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
import create from 'zustand';
import { GraftComponentProps } from './resolver';

/**
 * A canvas root component returns the children as-is.
 */
/** @internal */
export const Root__Graft__Component = forwardRef(
  ({ onDragOver, children }: GraftComponentProps, ref: ForwardedRef<any>) => {
    const onScroll = useCallback((event: UIEvent) => {
      useRootScrollStore.setState({
        top: event.currentTarget.scrollTop,
        left: event.currentTarget.scrollLeft,
      });
    }, []);

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

/** @internal */
type RootScrollStore = {
  top: number;
  left: number;
};

/**
 * A hook that shares the root component's scroll position to the rest of the app.
 */
/** @internal */
export const useRootScrollStore = create<RootScrollStore>(() => ({
  top: 0,
  left: 0,
}));
