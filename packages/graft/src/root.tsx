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
import { useDrop } from './drag';
import { useRefreshHoverRegion, useSyncHoverRegion } from './hover';
import { useScrollWhenDragging } from './scroll';
import { useRootScrollStoreApi } from './store/rootScroll';

/**
 * A canvas root component returns the children as-is.
 */
/** @internal */
export const Root__Graft__Component = forwardRef(
  ({ children, onMouseDown: _, ...rest }: GraftComponentProps, ref: ForwardedRef<any>) => {
    const { setState: setRootScroll } = useRootScrollStoreApi();

    const {
      onMouseUp: onMouseUpToDraw,
      onMouseMove: onMouseMoveToDraw,
      onMouseDown: onMouseDownToDraw,
    } = useDrawComponent();
    const { onMouseUp: onMouseUpToDrop, onMouseMove: onMouseMoveToDrop } = useDrop();

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
        onMouseMoveToDrop(event);
      },
      [onMouseMoveToDraw, onMouseMoveToDrop, onMouseMoveToHover]
    );

    const onMouseUp = useCallback(
      (event) => {
        onMouseUpToDraw(event);
        onMouseUpToDrop(event);
      },
      [onMouseUpToDraw, onMouseUpToDrop]
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
          onMouseDown={onMouseDownToDraw}
        >
          {children}
        </div>
      );
    }

    return (
      <RootOverrideComponent
        {...rest}
        ref={mergedRef}
        onScroll={onScroll}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDownToDraw}
      >
        {children}
      </RootOverrideComponent>
    );
  }
);
