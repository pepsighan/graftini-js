import { AllSelection, Selection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { useCallback } from 'react';
import { useDesignerStateApi } from 'store/designer';
import { useProseEditor } from './ProseEditorContext';

export default function useGetSelection(componentId: string) {
  const getIsEditing = useGetIsEditing(componentId);
  const { getEditorView, getCurrentSelection } = useProseEditor();

  return useCallback(() => {
    const view = getEditorView();
    if (!view) {
      return null;
    }

    const isEditing = getIsEditing();
    return isEditing ? view.state.selection : selectAll(view, getCurrentSelection());
  }, [getCurrentSelection, getEditorView, getIsEditing]);
}

function selectAll(view: EditorView, currentSelection: Selection) {
  if (!currentSelection.empty) {
    // When a text editor is newly selected, the view does not get updated immediately and
    // hence does not reflect the latest data.
    // As a stop-gap, we use [getCurrentSelection] which is immediately updated where all
    // the text is selected.
    // But once some changes are made the text editor (via style changes), the current selection
    // reflects the actual selection (i.e. the first character). So, we skip that once it happens
    // and use the actual view below (by then its updated).
    return currentSelection;
  }

  return new AllSelection(view.state.doc);
}

/**
 * Get the current editing state of the text editor on demand.
 */
function useGetIsEditing(componentId: string) {
  const { getState } = useDesignerStateApi();

  return useCallback(() => {
    const state = getState();
    return state.selectedComponentId === componentId && state.isTextEditingEnabled;
  }, [componentId, getState]);
}
