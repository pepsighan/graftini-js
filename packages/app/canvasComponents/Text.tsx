/** @jsxImportSource @emotion/react */
import { GraftComponent, useComponentId } from '@graftini/graft';
import { componentContextMenuId } from 'components/editor/ComponentContextMenu';
import { useContextMenu } from 'components/editor/ContextMenu';
import useSelectOnRightClick from 'hooks/useSelectOnRightClick';
import { forwardRef, MouseEvent, useCallback, useMemo } from 'react';
import { useDesignerState, useIsDraggingDisabled } from 'store/designer';
import ProseEditor from './proseEditor/ProseEditor';

export type TextComponentProps = {
  name?: string;
  content: any;
};

const Text: GraftComponent<TextComponentProps> = forwardRef(({ onMouseDown, content }, ref) => {
  const componentId = useComponentId();
  const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));
  const selectComponentOnRightClick = useSelectOnRightClick();
  const isDraggingDisabled = useIsDraggingDisabled();

  const { onOpen: onOpenContextMenu, onClose: onCloseContextMenu } = useContextMenu();

  const onClick = useCallback(
    (ev: MouseEvent) => {
      ev.stopPropagation();
      selectComponent(componentId);
      onCloseContextMenu();
    },
    [componentId, onCloseContextMenu, selectComponent]
  );

  const startEditingText = useDesignerState(useCallback((state) => state.startEditingText, []));

  const onContextMenu = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      selectComponentOnRightClick(componentId);
      onOpenContextMenu(event, componentContextMenuId);
    },
    [componentId, onOpenContextMenu, selectComponentOnRightClick]
  );

  const onInitializeContent = useCallback(
    () => content ?? Text.graftOptions.defaultProps.content,
    // We only initialize the content once. The state of the editor is
    // controlled by the editor itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // The text component keeps on changing with changing props.
  // The text editor does not need to update to those extra props.
  return (
    <>
      {useMemo(
        () => (
          <ProseEditor
            ref={ref}
            onInitialize={onInitializeContent}
            onMouseDown={!isDraggingDisabled ? onMouseDown : null}
            onClick={onClick}
            onDoubleClick={startEditingText}
            onContextMenu={onContextMenu}
          />
        ),
        [
          isDraggingDisabled,
          onClick,
          onContextMenu,
          onInitializeContent,
          onMouseDown,
          ref,
          startEditingText,
        ]
      )}
    </>
  );
});

Text.graftOptions = {
  defaultProps: {
    name: 'Text',
    // The serialized format of the document with empty text.
    // This format is defined by us in the ProseEditor.
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Write some text here.',
            },
          ],
        },
      ],
    },
  },
};

export default Text;
