import { useComponentId } from '@graftini/graft';
import { EditorState, Modifier } from 'draft-js';
import { FocusEventHandler, useCallback } from 'react';
import { useDesignerStateApi } from 'store/designer';
import { StyleOption } from './styleMap';
import { EditorStateSetter } from './useSyncEditorState';

export default function useRetainFocus(setState: EditorStateSetter): FocusEventHandler {
  const componentId = useComponentId();
  const { getState } = useDesignerStateApi();

  const onBlur = useCallback(() => {
    const state = getState();
    const isSelected = state.selectedComponentId === componentId;

    if (isSelected) {
      // If the text editor is still selected, even if the editor loses
      // focus, the following style will emulate selection.
      setState((editorState) =>
        EditorState.createWithContent(
          Modifier.applyInlineStyle(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            StyleOption.TextSelection
          )
        )
      );
    }
  }, [componentId, getState, setState]);
  return onBlur;
}
