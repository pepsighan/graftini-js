import { useComponentId, useEditorStore } from '@graftini/graft';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import { useCallback } from 'react';

type SetterCallback = (state: EditorState) => EditorState;
export type EditorStateSetter = (state: EditorState | SetterCallback) => void;

/**
 * Uses the graft editor store as the place to store the text editor state as-is.
 * This is only for used locally and not synced to the backend (check out
 * [SyncEditorAndDesignerState]).
 *
 * Why we do it this way? So that we can manipulate the text editor state anywhere
 * within the Editor Context (for ex: from the sidebar).
 */
export default function useTextEditorState(): [EditorState, EditorStateSetter] {
  const componentId = useComponentId();

  const editor = useEditorStore(
    useCallback(
      (state) =>
        state.componentMap[componentId].props.editor ??
        // If the editor is yet not created, create it from raw.
        EditorState.createWithContent(
          convertFromRaw(state.componentMap[componentId].props.content)
        ),
      [componentId]
    )
  );

  const immerSet = useEditorStore(useCallback((state) => state.immerSet, []));
  const setEditor = useCallback(
    (value) => {
      immerSet((state) => {
        const props = state.componentMap[componentId].props;
        let textEditor: EditorState;

        // If the value is a callback, then pass the existing editor state which will
        // return an updated editor.
        if (typeof value === 'function') {
          textEditor = value(
            props.editor ??
              EditorState.createWithContent(
                convertFromRaw(state.componentMap[componentId].props.content)
              )
          );
        } else {
          // Otherwise the value is the editor state which is to be stored.
          textEditor = value;
        }

        state.componentMap[componentId].props.editor = textEditor;
        state.componentMap[componentId].props.content = convertToRaw(
          textEditor.getCurrentContent()
        );
      });
    },
    [componentId, immerSet]
  );

  return [editor, setEditor];
}
