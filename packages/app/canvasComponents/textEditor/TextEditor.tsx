import { Box } from '@material-ui/core';
import { Editor } from 'draft-js';
import 'draft-js/dist/Draft.css';
import React, { useRef } from 'react';
import styleMap from './styleMap';
import useFocusOnEditingMode from './useFocusOnEditingMode';
import useRetainFocus from './useRetainFocus';
import useSyncEditorState from './useSyncEditorState';

export default function TextEditor({ value }) {
  const editorRef = useRef<Editor | null>(null);
  const { isSelected, isEditable } = useFocusOnEditingMode({ editorRef });
  const [editorState, onChange, setEditorState] = useSyncEditorState({ value });

  const onBlur = useRetainFocus(setEditorState);

  return (
    <Box
      sx={{
        cursor: isSelected ? 'text' : 'default',
      }}
      onBlur={onBlur}
    >
      <Editor
        ref={editorRef}
        editorState={editorState}
        onChange={onChange}
        readOnly={!isEditable}
        customStyleMap={styleMap}
      />
    </Box>
  );
}
