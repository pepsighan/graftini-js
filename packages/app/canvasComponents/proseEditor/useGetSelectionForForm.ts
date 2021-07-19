import { AllSelection } from 'prosemirror-state';
import { useCallback } from 'react';
import { useDesignerStateApi } from 'store/designer';
import { useProseEditor } from './ProseEditorContext';

export default function useGetSelectionForForm(componentId: string) {
  const getIsEditing = useGetIsEditing(componentId);
  const { getEditorView } = useProseEditor();

  return useCallback(() => {
    const view = getEditorView();
    if (!view) {
      return null;
    }

    const isEditing = getIsEditing();
    return isEditing ? view.state.selection : new AllSelection(view.state.doc);
  }, [getEditorView, getIsEditing]);
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
