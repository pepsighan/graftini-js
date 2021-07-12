import { useComponentId } from '@graftini/graft';
import { Editor } from 'draft-js';
import { MutableRefObject, useEffect } from 'react';
import { useDesignerStateApi } from 'store/designer';
import { useResetTextSelection } from './textSelection';
import { EditorStateSetter } from './useTextEditorState';

type UseResetTextSelectionOnBlur = {
  editorRef: MutableRefObject<Editor | null>;
  setEditorState: EditorStateSetter;
};

export default function useResetTextSelectionOnBlur({
  editorRef,
  setEditorState,
}: UseResetTextSelectionOnBlur) {
  const componentId = useComponentId();
  const resetTextSelection = useResetTextSelection(setEditorState, componentId);

  const { subscribe } = useDesignerStateApi();
  useEffect(() => {
    return subscribe(
      (isEditable) => {
        if (!editorRef.current) {
          return;
        }

        // Reset the artificial text selection when it is no longer editable.
        if (!isEditable) {
          editorRef.current.blur();
          resetTextSelection();
        }
      },
      (state) => state.selectedComponentId === componentId && state.isTextEditingEnabled
    );
  }, [componentId, editorRef, resetTextSelection, setEditorState, subscribe]);
}
