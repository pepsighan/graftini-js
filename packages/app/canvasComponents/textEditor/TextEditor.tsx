import { Text } from '@graftini/bricks';
import { Editor } from 'draft-js';
import React, { forwardRef, MouseEventHandler, useRef } from 'react';
import styleMap from './styleMap';
import useEditingState from './useEditingState';
import useFocusOnEditingMode from './useFocusOnEditingMode';
import useRetainFocus from './useRetainFocus';
import useSyncEditorState from './useSyncEditorState';

type TextEditorProps = {
  onMouseDown?: MouseEventHandler;
  onClick: MouseEventHandler;
};

const TextEditor = forwardRef(({ onMouseDown, onClick }: TextEditorProps, ref) => {
  const editorRef = useRef<Editor | null>(null);
  const [editorState, onChange, setEditorState] = useSyncEditorState();
  const [onFocus, onBlur] = useRetainFocus(setEditorState);

  useFocusOnEditingMode({ editorRef, setEditorState });
  const { isSelected, isEditing } = useEditingState();

  return (
    <Text
      ref={ref}
      isEditor
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseDown={onMouseDown}
      onClick={onClick}
      cursor={isEditing ? 'text' : 'default'}
    >
      <Editor
        ref={editorRef}
        editorState={editorState}
        onChange={onChange}
        customStyleMap={styleMap}
        readOnly={!isSelected}
      />
    </Text>
  );
});

export default TextEditor;
