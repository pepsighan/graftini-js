import { useComponentId, useEditorStore } from '@graftini/graft';
import { Box } from '@material-ui/core';
import { convertToRaw, convertFromRaw, Editor, EditorState } from 'draft-js';
import { useCallback, useState } from 'react';

export default function TextEditor({ value, isEditable }) {
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

  return (
    <Box sx={{ cursor: isEditable ? 'text' : 'default' }}>
      <Editor editorState={editorState} onChange={onChange} readOnly={!isEditable} />
    </Box>
  );
}
