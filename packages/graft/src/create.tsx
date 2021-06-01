import { nanoid } from 'nanoid';
import { DragEvent, EventHandler, useCallback } from 'react';
import { useResolver } from './resolver';
import { ComponentProps, useEditorStoreApiInternal } from './schema';

/**
 * Options to configure the kind of components to create during drag operation.
 */
export type CreateComponentOptions = {
  type: string;
  defaultProps?: ComponentProps;
};

type CreateComponentHandlers = {
  onDragStart: EventHandler<DragEvent>;
  draggable: true;
};

/**
 * Hook that returns drag handlers which initiates creation of a new component when dropped onto
 * the canvas.
 */
export function useCreateComponent({
  type,
  defaultProps,
}: CreateComponentOptions): CreateComponentHandlers {
  const { setState } = useEditorStoreApiInternal();

  // Use the configuration provided in the component definition.
  const Component = useResolver(type);
  const display = Component.graftOptions?.display ?? 'block';
  const isCanvas = Component.graftOptions?.isCanvas ?? false;
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
          display: display,
          // The default props provided in the hook have higher precedence.
          props: { ...(elementDefaultProps ?? []), ...(defaultProps ?? {}) },
          isCanvas: isCanvas,
          // This null is temporary until it dropped at some location.
          parentId: null,
          childrenNodes: [],
        },
      },
    }));
  }, [defaultProps, display, elementDefaultProps, isCanvas, setState, type]);

  return {
    onDragStart,
    draggable: true,
  };
}
