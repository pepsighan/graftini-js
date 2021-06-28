import React, {
  ForwardedRef,
  forwardRef,
  MouseEvent,
  useCallback,
  useContext,
  useState,
} from 'react';
import mergeRefs from 'react-merge-refs';
import { GraftComponentProps } from './componentTypes';
import { RootOverrideContext, RootRefContext } from './context';
import { useDrawComponent } from './create';
import { useDrop } from './drag';
import { useSyncHoverRegion } from './hover';
import { useScroll } from './scroll';

/**
 * A canvas root component returns the children as-is.
 */
/** @internal */
export const Root__Graft__Component = forwardRef(
  ({ children, onMouseDown: _, ...rest }: GraftComponentProps, ref: ForwardedRef<any>) => {
    const {
      onMouseUp: onMouseUpToDraw,
      onMouseMove: onMouseMoveToDraw,
      onMouseDown: onMouseDownToDraw,
    } = useDrawComponent();
    const { onMouseUp: onMouseUpToDrop, onMouseMove: onMouseMoveToDrop } = useDrop();

    const onMouseMoveToHover = useSyncHoverRegion();

    const [rootRef, setRootRef] = useState<HTMLElement | null>(null);
    const mergedRef = mergeRefs([setRootRef, ref]);

    // Link the scroll to enable hover, region map and drag to scroll.
    const onScroll = useScroll(rootRef);

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
        <RootRefContext.Provider value={rootRef}>
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
        </RootRefContext.Provider>
      );
    }

    return (
      <RootRefContext.Provider value={rootRef}>
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
      </RootRefContext.Provider>
    );
  }
);
