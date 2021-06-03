import { nanoid } from 'nanoid';
import { DragEventHandler, useCallback } from 'react';
import { useOnDragEnd } from './drag';
import { useResolver } from './resolver';
import { ChildAppendDirection, ComponentProps, useEditorStoreApiInternal } from './schema';

/**
 * Options to configure the kind of components to create during drag operation.
 */
export type CreateComponentOptions = {
  type: string;
  isCanvas?: boolean;
  childAppendDirection?: ChildAppendDirection;
  defaultProps?: ComponentProps;
};

type CreateComponentHandlers = {
  onDragStart: DragEventHandler;
  onDragEnd: DragEventHandler;
  draggable: true;
};

/**
 * Hook that returns drag handlers which initiates creation of a new component when dropped onto
 * the canvas.
 */
export function useCreateComponent({
  type,
  isCanvas = false,
  childAppendDirection,
  defaultProps,
}: CreateComponentOptions): CreateComponentHandlers {
  const { setState } = useEditorStoreApiInternal();

  // Use the configuration provided in the component definition.
  const Component = useResolver(type);
  const elementDefaultProps = Component.graftOptions?.defaultProps;

  const onDragStart = useCallback(() => {
    const id = nanoid();

    // We are just registering the new component here and preparing for a
    // drag.
    setState((state) => ({
      ...state,
      draggedOver: {
        ...state.draggedOver,
        isDragging: true,
        componentKind: 'new',
        component: {
          id,
          type,
          childAppendDirection,
          // The default props provided in the hook have higher precedence.
          props: { ...(elementDefaultProps ?? []), ...(defaultProps ?? {}) },
          isCanvas: isCanvas,
          // This null is temporary until it dropped at some location.
          parentId: null,
          childrenNodes: [],
        },
      },
    }));
  }, [childAppendDirection, defaultProps, elementDefaultProps, isCanvas, setState, type]);

  return {
    onDragStart,
    onDragEnd: useOnDragEnd(),
    draggable: true,
  };
}
