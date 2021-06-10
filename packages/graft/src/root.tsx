import React, {
  createContext,
  DragEvent,
  DragEventHandler,
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  MouseEvent,
  MouseEventHandler,
  ReactNode,
  RefAttributes,
  UIEvent,
  UIEventHandler,
  useCallback,
  useContext,
  useState,
} from 'react';
import mergeRefs from 'react-merge-refs';
import { useDrawComponent } from './create';
import { useSyncHoverRegion } from './hover';
import { GraftComponentOptions, GraftComponentProps } from './resolver';
import { useScrollWhenDragging } from './scroll';
import { DraggedOverStore, useDraggedOverStore } from './store/draggedOver';
import { HoverStore, useHoverStore } from './store/hover';
import { useRootScrollStoreApi } from './store/rootScroll';

/**
 * A canvas root component returns the children as-is.
 */
/** @internal */
export const Root__Graft__Component = forwardRef(
  (
    { onDragOver, onDragStart, onDragEnd, onDrag, children, ...rest }: GraftComponentProps,
    ref: ForwardedRef<any>
  ) => {
    const { setState } = useRootScrollStoreApi();
    const [onDragEnter, onDragLeave] = useIdentifyIfCursorOnRootDuringDrag();
    const [onMouseEnter, onMouseLeave] = useIdentifyIfCursorOnRoot();

    const { onMouseUp, onMouseMove: onMouseMoveToDraw, onMouseDown } = useDrawComponent();
    const onMouseMoveToHover = useSyncHoverRegion();

    const [rootRef, setRootRef] = useState<HTMLElement | null>(null);
    const mergedRef = mergeRefs([setRootRef, ref]);

    // Scroll the canvas when the item being dragged in near the vertical edges.
    useScrollWhenDragging(rootRef);

    const onScroll = useCallback(
      (event: UIEvent) => {
        setState({
          position: {
            top: event.currentTarget.scrollTop,
            left: event.currentTarget.scrollLeft,
          },
        });
      },
      [setState]
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
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onScroll={onScroll}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDown}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {children}
        </div>
      );
    }

    return (
      <RootOverrideComponent
        ref={mergedRef}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onScroll={onScroll}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...rest}
      >
        {children}
      </RootOverrideComponent>
    );
  }
);

/**
 * Context to override the default root component. The root component receives
 * a subset of Graft component props and some additional props.
 */
/** @internal */
export const RootOverrideContext = createContext<RootComponent<any> | null>(null);

export type RootComponent<T extends object> = ForwardRefExoticComponent<
  RefAttributes<{}> & {
    onDragEnter: DragEventHandler;
    onDragLeave: DragEventHandler;
    onDragOver: DragEventHandler;
    onScroll: UIEventHandler;
    onMouseUp: MouseEventHandler;
    onMouseDown: MouseEventHandler;
    onMouseMove: MouseEventHandler;
    onMouseEnter: MouseEventHandler;
    onMouseLeave: MouseEventHandler;
    children: ReactNode;
  } & T
> & {
  graftOptions?: GraftComponentOptions<T>;
};

/**
 * Hook that identifies whether the cursor is over the root component during a drag operation.
 */
function useIdentifyIfCursorOnRootDuringDrag(): [DragEventHandler, DragEventHandler] {
  const immerSet = useDraggedOverStore(useCallback((state) => state.immerSet, []));

  const onDragEnter = useCallback(() => {
    immerSet((state: DraggedOverStore) => {
      state.draggedOver.isOnRoot = true;
    });
  }, [immerSet]);

  const onDragLeave = useCallback(
    (event: DragEvent) => {
      // The weird thing about drag leave is that the event is tracked even when the
      // cursor moves from the root to its own child (which normally is not actually
      // leaving). So the following filters such events and only tracks the out
      // going out from the root.
      if (!event.currentTarget.contains(event.relatedTarget as any)) {
        immerSet((state: DraggedOverStore) => {
          state.draggedOver.isOnRoot = false;
        });
      }
    },
    [immerSet]
  );

  return [onDragEnter, onDragLeave];
}

/**
 * Identifies if the cursor is over the root component during non-drag operation.
 */
function useIdentifyIfCursorOnRoot(): [MouseEventHandler, MouseEventHandler] {
  const immerSet = useHoverStore(useCallback((state: HoverStore) => state.immerSet, []));

  const onMouseEnter = useCallback(() => {
    immerSet((state) => {
      state.isOnRoot = true;
    });
  }, [immerSet]);

  const onMouseLeave = useCallback(() => {
    immerSet((state) => {
      state.isOnRoot = false;
      state.hoverRegion = null;
    });
  }, [immerSet]);

  return [onMouseEnter, onMouseLeave];
}
