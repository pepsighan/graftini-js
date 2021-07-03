import { Text } from '@graftini/bricks';
import { Editor } from 'draft-js';
import React, { forwardRef, MouseEventHandler, useRef } from 'react';
import styleMap from './styleMap';
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
  const { isSelected, isEditable } = useFocusOnEditingMode({ editorRef, setEditorState });
  const [onFocus, onBlur] = useRetainFocus(setEditorState);

  return (
    <Text
      ref={ref}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseDown={onMouseDown}
      onClick={onClick}
      cursor={isSelected ? 'text' : 'default'}
    >
      <Editor
        ref={editorRef}
        editorState={editorState}
        onChange={onChange}
        readOnly={!isEditable}
        customStyleMap={styleMap}
      />
    </Text>
  );
});

export default TextEditor;
