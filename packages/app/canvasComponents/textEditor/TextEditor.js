import { useComponentId, useEditorStore } from '@graftini/graft';
import { Box } from '@material-ui/core';
import { convertFromRaw, convertToRaw, Editor, EditorState } from 'draft-js';
import { useCallback, useState } from 'react';
import { useDesignerState } from 'store/designer';

export default function TextEditor({ value }) {
  const componentId = useComponentId();
  const immerSet = useEditorStore(useCallback((state) => state.immerSet, []));

  const isSelected = useDesignerState(
    useCallback((state) => state.selectedComponentId === componentId, [componentId])
  );

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
    <Box sx={{ cursor: isSelected ? 'text' : 'default' }}>
      {/* [isSelected] makes the editor to be functional only after the second click. */}
      <Editor editorState={editorState} onChange={onChange} readOnly={!isSelected} />
    </Box>
  );
}
