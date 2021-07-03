import { useComponentId } from '@graftini/graft';
import { EditorState, Modifier } from 'draft-js';
import { FocusEventHandler, useCallback } from 'react';
import { useDesignerStateApi } from 'store/designer';
import { StyleOption } from './styleMap';
import { selectAll } from './useFocusOnEditingMode';
import { EditorStateSetter } from './useSyncEditorState';

export default function useRetainFocus(
  setState: EditorStateSetter
): [FocusEventHandler, FocusEventHandler] {
  const componentId = useComponentId();
  const { getState } = useDesignerStateApi();

  // This adds the text selection style when the editor goes out of focus.
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

  // This removes the text selection style when the editor comes back
  // to focus.
  const onFocus = useCallback(() => {
    const state = getState();
    const isSelected = state.selectedComponentId === componentId;

    if (isSelected) {
      // Remove the selection style done onBlur when it comes to focus again.
      setState((editorState) =>
        EditorState.createWithContent(
          Modifier.removeInlineStyle(
            editorState.getCurrentContent(),
            // We remove selection from all because the cursor selection onBlur
            // may still not be present.
            selectAll(editorState),
            StyleOption.TextSelection
          )
        )
      );
    }
  }, [componentId, getState, setState]);

  return [onFocus, onBlur];
}
