import { useComponentId } from '@graftini/graft';
import { FocusEventHandler, useCallback } from 'react';
import { useDesignerStateApi } from 'store/designer';
import { useMarkTextAsSelected, useResetTextSelection } from './textSelection';
import { EditorStateSetter } from './useTextEditorState';

/**
 * Hook that retains focus on the selected text within the editor when the user is interacting
 * with the rest of the app.
 */
export default function useRetainFocusOnText(
  setState: EditorStateSetter
): [FocusEventHandler, FocusEventHandler] {
  const componentId = useComponentId();
  const { getState } = useDesignerStateApi();
  const markTextAsSelected = useMarkTextAsSelected(setState, componentId);
  const resetTextSelection = useResetTextSelection(setState, componentId);

  // This adds the text selection style when the editor goes out of focus.
  const onBlur = useCallback(() => {
    const state = getState();
    const isSelected = state.selectedComponentId === componentId;

    if (isSelected) {
      // If the text editor is still selected, even if the editor loses
      // focus, the following style will emulate selection.
      markTextAsSelected();
    }
  }, [componentId, getState, markTextAsSelected]);

  // This removes the text selection style when the editor comes back
  // to focus.
  const onFocus = useCallback(() => {
    const state = getState();
    const isSelected = state.selectedComponentId === componentId;

    // Remove the selection style done onBlur when it comes to focus again.
    if (isSelected) {
      resetTextSelection();
    }
  }, [componentId, getState, resetTextSelection]);

  return [onFocus, onBlur];
}
