import { useComponentId, useEditorStore } from '@graftini/graft';
import { Box } from '@material-ui/core';
import { convertFromRaw, convertToRaw, Editor, EditorState } from 'draft-js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDesignerState, useDesignerStateApi } from 'store/designer';

export default function TextEditor({ value }) {
  const editorRef = useRef();
  const { isSelected, isEditable } = useFocusOnEditingMode({ editorRef });
  const [editorState, onChange] = useSyncEditorState({ value });

  return (
    <Box sx={{ cursor: isSelected ? 'text' : 'default' }}>
      <Editor
        ref={editorRef}
        editorState={editorState}
        onChange={onChange}
        readOnly={!isEditable}
      />
    </Box>
  );
}

/**
 * Syncs the state between the editor and the component props.
 */
function useSyncEditorState({ value }) {
  const componentId = useComponentId();
  const immerSet = useEditorStore(useCallback((state) => state.immerSet, []));

  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(convertFromRaw(value))
  );

  const onChange = useCallback(
    (editorState) => {
      setEditorState(editorState);

      // Store the standard editor state in the component props.
      immerSet((state) => {
        state.componentMap[componentId].props.content = convertToRaw(
          editorState.getCurrentContent()
        );
      });
    },
    [componentId, immerSet]
  );

  return [editorState, onChange];
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
