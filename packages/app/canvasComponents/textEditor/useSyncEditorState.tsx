import { useComponentId, useEditorStore } from '@graftini/graft';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';

type OnEditorStateChange = (editorState: EditorState) => void;
export type EditorStateSetter = Dispatch<SetStateAction<EditorState>>;

/**
 * Syncs the state between the editor and the component props.
 */
export default function useSyncEditorState(): [
  EditorState,
  OnEditorStateChange,
  EditorStateSetter
] {
  const componentId = useComponentId();
  const immerSet = useEditorStore(useCallback((state) => state.immerSet, []));

  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(ContentState.createFromText('Abc'))
  );

  const onChange = useCallback(
    (editorState: EditorState) => {
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

  return [editorState, onChange, setEditorState];
}
