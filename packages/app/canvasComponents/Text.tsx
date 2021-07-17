/** @jsxImportSource @emotion/react */
import { GraftComponent, useComponentId } from '@graftini/graft';
import { componentContextMenuId } from 'components/editor/ComponentContextMenu';
import { useContextMenu } from 'components/editor/ContextMenu';
import { EditorState, RawDraftContentState, SelectionState } from 'draft-js';
import useSelectOnRightClick from 'hooks/useSelectOnRightClick';
import { forwardRef, MouseEvent, useCallback, useMemo } from 'react';
import { useDesignerState, useIsDraggingDisabled } from 'store/designer';
import ProseEditor from './proseEditor/ProseEditor';
import { TextSelectionProvider } from './textEditor/textSelection';

export type TextComponentProps = {
  name?: string;
  content: RawDraftContentState;
  editor?: EditorState;
  textSelection?: SelectionState;
};

const Text: GraftComponent<TextComponentProps> = forwardRef(({ onMouseDown }, ref) => {
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

  // The text component keeps on changing with changing props.
  // The text editor does not need to update to those extra props.
  return (
    <>
      {useMemo(
        () => (
          <TextSelectionProvider>
            <ProseEditor
              ref={ref}
              onMouseDown={!isDraggingDisabled ? onMouseDown : null}
              onClick={onClick}
              onDoubleClick={startEditingText}
              onContextMenu={onContextMenu}
            />
          </TextSelectionProvider>
        ),
        [isDraggingDisabled, onClick, onContextMenu, onMouseDown, ref, startEditingText]
      )}
    </>
  );
});

Text.graftOptions = {
  defaultProps: {
    name: 'Text',
    // The standard format for DraftJS.
    content: {
      blocks: [],
      entityMap: {},
    },
    // This is the actual editor state that is used on the browser.
    // This is not synced to the backend. On the first run, it is derived
    // from the [content] field. After that, it is self sufficient.
    // We needed a separate editor state because it also captures other
    // runtime metadata such as selection. Also, keeping it here is helpful
    // to manipulate it anywhere within the Editor context (for example
    // from the sidebar).
    editor: null,
    // Normally the above editor stores the current editor selection. But when
    // the editor loses focus, it is reset. So using this prop to store the
    // last text selection position before the editor loses focus.
    textSelection: null,
  },
};

export default Text;
