import { Text } from '@graftini/bricks';
import { useComponentId } from '@graftini/graft';
import { Editor } from 'draft-js';
import React, { forwardRef, MouseEventHandler, useRef } from 'react';
import { blockMap, customBlockStyle } from './blocks';
import { defaultTextFormValues } from './formFields';
import useEditingState from './useEditingState';
import useFocusOnEditingMode from './useFocusOnEditingMode';
import useRetainFocusOnText from './useRetainFocusOnText';
import useStyleMap from './useStyleMap';
import useTextEditorState from './useTextEditorState';

type TextEditorProps = {
  onMouseDown?: MouseEventHandler;
  onClick: MouseEventHandler;
  onContextMenu: MouseEventHandler;
};

const TextEditor = forwardRef(({ onMouseDown, onClick, onContextMenu }: TextEditorProps, ref) => {
  const editorRef = useRef<Editor | null>(null);

  const componentId = useComponentId();
  const [editorState, setEditorState] = useTextEditorState({
    componentId,
  });
  const [onFocus, onBlur] = useRetainFocusOnText(setEditorState);

  useFocusOnEditingMode({ editorRef, setEditorState });
  const { isSelected, isEditing } = useEditingState();

  const styleMap = useStyleMap({ componentId });

  return (
    <Text
      ref={ref}
      isEditor
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseDown={onMouseDown}
      onClick={onClick}
      onContextMenu={onContextMenu}
      {...defaultTextFormValues}
      cursor={isEditing ? 'text' : 'default'}
    >
      <Editor
        ref={editorRef}
        editorState={editorState}
        onChange={setEditorState}
        customStyleMap={styleMap}
        blockRenderMap={blockMap}
        blockStyleFn={customBlockStyle}
        readOnly={!isSelected}
      />
    </Text>
  );
});

export default TextEditor;
