import { Text } from '@graftini/bricks';
import { Editor } from 'draft-js';
import { motion } from 'framer-motion';
import React, { forwardRef, MouseEventHandler, useRef } from 'react';
import styleMap from './styleMap';
import useCursor from './useCursor';
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
  useFocusOnEditingMode({ editorRef, setEditorState });
  const [onFocus, onBlur] = useRetainFocus(setEditorState);
  const cursor = useCursor();

  return (
    <Text
      ref={ref}
      isEditor
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      <motion.div style={{ cursor }}>
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={onChange}
          customStyleMap={styleMap}
        />
      </motion.div>
    </Text>
  );
});

export default TextEditor;
