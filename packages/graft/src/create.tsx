import { nanoid } from 'nanoid';
import { DragEvent, DragEventHandler, useCallback } from 'react';
import { hideDefaultDragPreview, useOnDrag, useOnDragEnd } from './drag';
import { useResolver } from './resolver';
import { ChildAppendDirection, ComponentProps, useEditorStateInternal } from './store/schema';

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
  onDrag: DragEventHandler;
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
  const immerSet = useEditorStateInternal(useCallback((state) => state.immerSet, []));

  // Use the configuration provided in the component definition.
  const Component = useResolver(type);
  const elementDefaultProps = Component.graftOptions?.defaultProps;

  const onDragStart = useCallback(
    (event: DragEvent) => {
      hideDefaultDragPreview(event);

      const id = nanoid();

      // We are just registering the new component here and preparing for a
      // drag.
      immerSet((state) => {
        state.draggedOver.isDragging = true;
        state.draggedOver.componentKind = 'new';
        state.draggedOver.component = {
          id,
          type,
          childAppendDirection,
          // The default props provided in the hook have higher precedence.
          props: { ...(elementDefaultProps ?? []), ...(defaultProps ?? {}) },
          isCanvas: isCanvas,
          // This null is temporary until it dropped at some location.
          parentId: null,
          childrenNodes: [],
        };
      });
    },
    [childAppendDirection, defaultProps, elementDefaultProps, immerSet, isCanvas, type]
  );

  return {
    onDragStart,
    onDrag: useOnDrag(),
    onDragEnd: useOnDragEnd(),
    draggable: true,
  };
}
