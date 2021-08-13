/** @jsxImportSource @emotion/react */
import { DimensionSize, ProseMirrorDocument } from '@graftini/bricks';
import { GraftComponent, useComponentId } from '@graftini/graft';
import { componentContextMenuId } from 'components/editor/ComponentContextMenu';
import { useContextMenu } from 'components/editor/ContextMenu';
import useSelectOnRightClick from 'hooks/useSelectOnRightClick';
import { forwardRef, MouseEvent, useCallback, useMemo } from 'react';
import { useDesignerState, useIsDraggingDisabled } from 'store/designer';
import { TextTag } from 'utils/constants';
import ProseEditor from './proseEditor/ProseEditor';
import useIsEditing from './proseEditor/useIsEditing';
import useIsSelected from './proseEditor/useIsSelected';

export type TextComponentProps = {
  name?: string;
  tag: TextTag;
  content: ProseMirrorDocument;
  width?: DimensionSize;
  height?: DimensionSize;
};

const Text: GraftComponent<TextComponentProps> = forwardRef(
  ({ onMouseDown, content, tag, width, height }, ref) => {
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

    const isEditing = useIsEditing(componentId);
    const isSelected = useIsSelected(componentId);
    const startEditingText = useDesignerState(useCallback((state) => state.startEditingText, []));

    const onContextMenu = useCallback(
      (event: MouseEvent) => {
        event.stopPropagation();
        if (isEditing) {
          // Show the browser's default context menu if it is in editing mode.
          return;
        }

        selectComponentOnRightClick(componentId);
        onOpenContextMenu(event, componentContextMenuId);
      },
      [componentId, isEditing, onOpenContextMenu, selectComponentOnRightClick]
    );

    const onInitializeContent = useCallback(
      () => content ?? Text.graftOptions.defaultProps.content,
      // We only initialize the content once or when the editing or selected state
      // changes. The state of the editor is controlled by the editor itself.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [isEditing, isSelected]
    );

    // The text component keeps on changing with changing props.
    // The text editor does not need to update to those extra props.
    return (
      <>
        {useMemo(
          () => (
            <ProseEditor
              ref={ref}
              tag={tag || Text.graftOptions.defaultProps.tag}
              width={width ?? Text.graftOptions.defaultProps.width!}
              height={height ?? Text.graftOptions.defaultProps.height!}
              isEditing={isEditing}
              onInitialState={onInitializeContent}
              onMouseDown={!isDraggingDisabled ? onMouseDown : null}
              onClick={onClick}
              onDoubleClick={startEditingText}
              onContextMenu={onContextMenu}
            />
          ),
          [
            height,
            isDraggingDisabled,
            isEditing,
            onClick,
            onContextMenu,
            onInitializeContent,
            onMouseDown,
            ref,
            startEditingText,
            tag,
            width,
          ]
        )}
      </>
    );
  }
);

Text.graftOptions = {
  defaultProps: {
    name: 'Text',
    tag: 'div',
    // The serialized format of the document with empty text.
    // This format is defined by us in the ProseEditor.
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          attrs: {
            textAlign: 'left',
          },
          content: [
            {
              type: 'text',
              marks: [],
              text: 'Write some text here.',
            },
          ],
        },
      ],
    },
    width: { size: 100, unit: '%' },
    height: 'auto',
  },
};

export default Text;
