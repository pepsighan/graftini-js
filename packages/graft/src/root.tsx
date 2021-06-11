import React, {
  DragEvent,
  DragEventHandler,
  ForwardedRef,
  forwardRef,
  MouseEvent,
  MouseEventHandler,
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
import { DraggedOverStore, useDraggedOverStore } from './store/draggedOver';
import { HoverStore, useHoverStore } from './store/hover';
import { useRootScrollStoreApi } from './store/rootScroll';

/**
 * A canvas root component returns the children as-is.
 */
/** @internal */
export const Root__Graft__Component = forwardRef(
  (
    {
      onDragStart,
      onDragEnd,
      onDrag,
      draggable,
      // Only the following props are used. Rest are not applicable for the root.
      onDragOver,
      children,
      ...rest
    }: GraftComponentProps,
    ref: ForwardedRef<any>
  ) => {
    const { setState: setRootScroll } = useRootScrollStoreApi();
    const [onDragEnter, onDragLeave] = useIdentifyIfCursorOnRootDuringDrag();
    const [onMouseEnter, onMouseLeave] = useIdentifyIfCursorOnRoot();

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
