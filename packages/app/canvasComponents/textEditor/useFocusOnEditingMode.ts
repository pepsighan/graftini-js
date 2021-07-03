import { useComponentId } from '@graftini/graft';
import { Editor, EditorState, Modifier } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { MutableRefObject, useEffect } from 'react';
import { useDesignerStateApi } from 'store/designer';
import { StyleOption } from './styleMap';
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
          setEditorState((editorState) =>
            EditorState.createWithContent(
              Modifier.removeInlineStyle(
                editorState.getCurrentContent(),
                selectAll(editorState),
                StyleOption.TextSelection
              )
            )
          );
        }
      },
      (state) => state.selectedComponentId === componentId && state.isTextEditingEnabled
    );
  }, [componentId, editorRef, setEditorState, subscribe]);
}

/**
 * Creates a selection that spans everything within the editor.
 */
export function selectAll(editorState: EditorState) {
  const currentContent = editorState.getCurrentContent();

  return editorState.getSelection().merge({
    anchorKey: currentContent.getFirstBlock().getKey(),
    anchorOffset: 0,
    focusOffset: currentContent.getLastBlock().getText().length,
    focusKey: currentContent.getLastBlock().getKey(),
  });
}
