import React, {
  ForwardedRef,
  forwardRef,
  MouseEvent,
  UIEvent,
  useCallback,
  useContext,
  useState,
} from 'react';
import mergeRefs from 'react-merge-refs';
import { GraftComponentProps } from './componentTypes';
import { RootOverrideContext } from './context';
import { useDrawComponent } from './create';
import { useRefreshHoverRegion, useSyncHoverRegion } from './hover';
import { useScrollWhenDragging } from './scroll';
import { useRootScrollStoreApi } from './store/rootScroll';

/**
 * A canvas root component returns the children as-is.
 */
/** @internal */
export const Root__Graft__Component = forwardRef(
  ({ children, ...rest }: GraftComponentProps, ref: ForwardedRef<any>) => {
    const { setState: setRootScroll } = useRootScrollStoreApi();

    const { onMouseUp, onMouseMove: onMouseMoveToDraw, onMouseDown } = useDrawComponent();
    const onMouseMoveToHover = useSyncHoverRegion();
    const onRefreshHover = useRefreshHoverRegion();

    const [rootRef, setRootRef] = useState<HTMLElement | null>(null);
    const mergedRef = mergeRefs([setRootRef, ref]);

    // Scroll the canvas when the item being dragged in near the vertical edges.
    useScrollWhenDragging(rootRef);

    const onScroll = useCallback(
      (event: UIEvent) => {
        onRefreshHover();
        setRootScroll({
          position: {
            top: event.currentTarget.scrollTop,
            left: event.currentTarget.scrollLeft,
          },
        });
      },
      [onRefreshHover, setRootScroll]
    );

    const onMouseMove = useCallback(
      (event: MouseEvent) => {
        onMouseMoveToDraw(event);
        onMouseMoveToHover(event);
      },
      [onMouseMoveToDraw, onMouseMoveToHover]
    );

    const RootOverrideComponent = useContext(RootOverrideContext);
    if (!RootOverrideComponent) {
      return (
        <div
          ref={mergedRef}
          style={{ width: '100%', height: '100%', overflow: 'auto' }}
          onScroll={onScroll}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDown}
        >
          {children}
        </div>
      );
    }

    return (
      <RootOverrideComponent
        ref={mergedRef}
        onScroll={onScroll}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        {...rest}
      >
        {children}
      </RootOverrideComponent>
    );
  }
);
