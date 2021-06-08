import React, {
  createContext,
  DragEvent,
  DragEventHandler,
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
  UIEvent,
  UIEventHandler,
  useCallback,
  useContext,
  useState,
} from 'react';
import mergeRefs from 'react-merge-refs';
import { GraftComponentProps } from './resolver';
import { useScrollWhenDragging } from './scroll';
import { DraggedOverStore, useDraggedOverStore } from './store/draggedOver';
import { useRootScrollStoreApi } from './store/rootScroll';

/**
 * A canvas root component returns the children as-is.
 */
/** @internal */
export const Root__Graft__Component = forwardRef(
  ({ onDragOver, children }: GraftComponentProps, ref: ForwardedRef<any>) => {
    const { setState } = useRootScrollStoreApi();
    const [onDragEnter, onDragLeave] = useIdentifyIfCursorOnRoot();

    const [rootRef, setRootRef] = useState<HTMLElement | null>(null);
    const mergedRef = mergeRefs([setRootRef, ref]);

    // Scroll the canvas when the item being dragged in near the vertical edges.
    useScrollWhenDragging(rootRef);

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
          ref={mergedRef}
          style={{ width: '100%', height: '100%', overflow: 'auto' }}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onScroll={onScroll}
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
      />
    );
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
    onDragEnter: DragEventHandler;
    onDragLeave: DragEventHandler;
    onDragOver: DragEventHandler;
    onScroll: UIEventHandler;
  }
>;

/**
 * Hook that identifies whether the cursor is over a root component.
 */
function useIdentifyIfCursorOnRoot(): [DragEventHandler, DragEventHandler] {
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
