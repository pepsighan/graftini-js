import React, { ForwardedRef, forwardRef, MouseEvent, useCallback, useContext } from 'react';
import { GraftComponentProps } from './componentTypes';
import { RootOverrideContext } from './context';
import { useDrawComponent } from './create';
import { useDrop } from './drag';
import { useSyncHoverRegion } from './hover';
import { useScroll } from './scroll';

/**
 * A canvas root component returns the children as-is.
 */
/** @internal */
export const Root__Graft__Component = forwardRef(
  ({ children, onMouseDown: _, ...rest }: GraftComponentProps, containerRef: ForwardedRef<any>) => {
    const {
      onMouseUp: onMouseUpToDraw,
      onMouseMove: onMouseMoveToDraw,
      onMouseDown: onMouseDownToDraw,
    } = useDrawComponent();
    const { onMouseUp: onMouseUpToDrop, onMouseMove: onMouseMoveToDrop } = useDrop();

    const onMouseMoveToHover = useSyncHoverRegion();

    // Link the scroll to enable hover, region map and drag to scroll.
    const onScroll = useScroll();

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
          ref={containerRef}
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
        // Pass both the refs separately so they can be managed
        // with full flexibility.
        ref={containerRef}
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
