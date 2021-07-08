import { useEditorStore } from '@graftini/graft';
import { TextComponentProps } from 'canvasComponents/Text';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import { useCallback } from 'react';
import { useDesignerStateApi } from 'store/designer';

type SetterCallback = (state: EditorState) => EditorState;
export type EditorStateSetter = (state: EditorState | SetterCallback) => void;

type UseTextEditorStateOptions = {
  componentId: string;
};

/**
 * Uses the graft editor store as the place to store the text editor state as-is.
 * This is only for used locally and not synced to the backend (check out
 * [SyncEditorAndDesignerState]).
 *
 * Why we do it this way? So that we can manipulate the text editor state anywhere
 * within the Editor Context (for ex: from the sidebar).
 */
export default function useTextEditorState({
  componentId,
}: UseTextEditorStateOptions): [EditorState, EditorStateSetter] {
  const editor = useEditorStore(
    useCallback(
      (state) => getTextEditorState(state.componentMap[componentId].props as TextComponentProps),
      [componentId]
    )
  );

  const setEditor = useTextEditorStateSetter({ componentId });

  return [editor, setEditor];
}

/**
 * Hook to set the text editor state.
 */
export function useTextEditorStateSetter({
  componentId,
}: UseTextEditorStateOptions): EditorStateSetter {
  const immerSet = useEditorStore(useCallback((state) => state.immerSet, []));

  const setEditor = useCallback(
    (value) => {
      immerSet((state) => {
        const props = state.componentMap[componentId].props as TextComponentProps;
        let textEditor: EditorState;

        // If the value is a callback, then pass the existing editor state which will
        // return an updated editor.
        if (typeof value === 'function') {
          textEditor = value(getTextEditorState(props));
        } else {
          // Otherwise the value is the editor state which is to be stored.
          textEditor = value;
        }

        props.editor = textEditor;
        props.content = convertToRaw(textEditor.getCurrentContent());
      });
    },
    [componentId, immerSet]
  );

  return setEditor;
}

/**
 * Gets the text editor state from the text component props.
 */
export function getTextEditorState(props: TextComponentProps): EditorState {
  return (
    props.editor ??
    // If the editor is yet not created, create it from raw.
    EditorState.createWithContent(convertFromRaw(props.content))
  );
}

/**
 * Gets whether the given component is being edited or not.
 */
export function useIsTextEditingEnabledGetter({ componentId }: { componentId: string }) {
  const { getState } = useDesignerStateApi();

  return useCallback(() => {
    const state = getState();
    return state.selectedComponentId === componentId && state.isTextEditingEnabled;
  }, [componentId, getState]);
}
