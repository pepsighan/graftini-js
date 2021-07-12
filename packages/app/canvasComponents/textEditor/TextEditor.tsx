import { Text } from '@graftini/bricks';
import { useComponentId } from '@graftini/graft';
import { Editor } from 'draft-js';
import React, { forwardRef, MouseEventHandler, useRef } from 'react';
import { blockMap, customBlockStyle } from './blocks';
import { defaultTextFormValues } from './formFields';
import useEditingState from './useEditingState';
import useResetTextSelectionOnBlur from './useResetTextSelectionOnBlur';
import useRetainTextSelection from './useRetainTextSelection';
import useStyleMap from './useStyleMap';
import useTextEditorState from './useTextEditorState';

type TextEditorProps = {
  onMouseDown?: MouseEventHandler;
  onClick: MouseEventHandler;
  onDoubleClick: MouseEventHandler;
  onContextMenu: MouseEventHandler;
};

const TextEditor = forwardRef(
  ({ onMouseDown, onClick, onDoubleClick, onContextMenu }: TextEditorProps, ref) => {
    const editorRef = useRef<Editor | null>(null);

    const componentId = useComponentId();
    const [editorState, setEditorState] = useTextEditorState({
      componentId,
    });
    const styleMap = useStyleMap({ componentId });

    const [onFocus, onBlur] = useRetainTextSelection(setEditorState);
    const isEditing = useEditingState(setEditorState);

    useResetTextSelectionOnBlur({ editorRef, setEditorState });

    return (
      <Text
        ref={ref}
        isEditor
        onFocus={onFocus}
        onBlur={onBlur}
        onMouseDown={onMouseDown}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
        {...defaultTextFormValues}
        cursor={isEditing ? 'text' : 'default'}
      >
        <Editor
          key={isEditing.toString()}
          ref={editorRef}
          editorState={editorState}
          onChange={setEditorState}
          customStyleMap={styleMap}
          blockRenderMap={blockMap}
          blockStyleFn={customBlockStyle(isEditing)}
          readOnly={!isEditing}
        />
      </Text>
    );
  }
);

export default TextEditor;
