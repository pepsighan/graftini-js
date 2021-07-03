import { useComponentId } from '@graftini/graft';
import { Editor } from 'draft-js';
import { MutableRefObject, useEffect } from 'react';
import { useDesignerStateApi } from 'store/designer';
import { resetTextSelection } from './textSelection';
import { EditorStateSetter } from './useSyncEditorState';

type UseFocusOnEditingModeOptions = {
  editorRef: MutableRefObject<Editor | null>;
  setEditorState: EditorStateSetter;
};

/**
 * Manages focus on the editor whenever it gains or loses editable status.
 */
export default function useFocusOnEditingMode({
  editorRef,
  setEditorState,
}: UseFocusOnEditingModeOptions) {
  const componentId = useComponentId();

  const { subscribe } = useDesignerStateApi();
  useEffect(() => {
    return subscribe(
      (isEditable) => {
        if (!editorRef.current) {
          return;
        }

        // Forcefully focus the editor. Sometimes it does not automatically
        // give the focus when the editor turns off readOnly mode.
        if (!isEditable) {
          editorRef.current.blur();

          // Remove any artificial text selection.
          resetTextSelection(setEditorState);
        }
      },
      (state) => state.selectedComponentId === componentId && state.isTextEditingEnabled
    );
  }, [componentId, editorRef, setEditorState, subscribe]);
}
