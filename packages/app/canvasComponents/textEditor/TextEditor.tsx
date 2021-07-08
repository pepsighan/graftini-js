import { Text } from '@graftini/bricks';
import { useComponentId } from '@graftini/graft';
import { textDefaultOptions } from 'canvasComponents/TextOptions';
import { Editor } from 'draft-js';
import React, { forwardRef, MouseEventHandler, useRef } from 'react';
import { blockMap } from './blocks';
import useEditingState from './useEditingState';
import useFocusOnEditingMode from './useFocusOnEditingMode';
import useRetainFocusOnText from './useRetainFocusOnText';
import useStyleMap from './useStyleMap';
import useTextEditorState from './useTextEditorState';

type TextEditorProps = {
  onMouseDown?: MouseEventHandler;
  onClick: MouseEventHandler;
};

const TextEditor = forwardRef(({ onMouseDown, onClick }: TextEditorProps, ref) => {
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
      // These are the default text style that is used to standardize how
      // every text looks. The user can override it within the text content below.
      {...textDefaultOptions}
      cursor={isEditing ? 'text' : 'default'}
    >
      <Editor
        ref={editorRef}
        editorState={editorState}
        onChange={setEditorState}
        customStyleMap={styleMap}
        blockRenderMap={blockMap}
        readOnly={!isSelected}
      />
    </Text>
  );
});

export default TextEditor;
