import { useComponentId } from '@graftini/graft';
import { Box } from '@material-ui/core';
import { Editor } from 'draft-js';
import 'draft-js/dist/Draft.css';
import React, { useCallback, useEffect, useRef } from 'react';
import { useDesignerState, useDesignerStateApi } from 'store/designer';
import styleMap from './styleMap';
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

/**
 * Manages focus on the editor whenever it gains or loses editable status.
 */
function useFocusOnEditingMode({ editorRef }) {
  const componentId = useComponentId();

  const isSelected = useDesignerState(
    useCallback((state) => state.selectedComponentId === componentId, [componentId])
  );

  const isEditable = useDesignerState(
    useCallback(
      (state) => state.selectedComponentId === componentId && state.isTextEditingEnabled,
      [componentId]
    )
  );

  const { subscribe } = useDesignerStateApi();
  useEffect(() => {
    return subscribe(
      (isEditable) => {
        if (!editorRef.current) {
          return;
        }

        // Forcefully focus the editor. Sometimes it does not automatically
        // give the focus when the editor turns off readOnly mode.
        if (isEditable) {
          editorRef.current.focus();
        } else {
          editorRef.current.blur();
        }
      },
      (state) => state.selectedComponentId === componentId && state.isTextEditingEnabled
    );
  }, [componentId, editorRef, subscribe]);

  return { isSelected, isEditable };
}
