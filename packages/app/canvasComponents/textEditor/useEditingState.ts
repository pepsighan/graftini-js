import { useComponentId } from '@graftini/graft';
import { EditorState } from 'draft-js';
import { useCallback, useEffect } from 'react';
import { useDesignerState } from 'store/designer';
import { cursorAtLast } from './textSelection';
import { EditorStateSetter } from './useTextEditorState';

export default function useEditingState(setEditorState: EditorStateSetter) {
  const componentId = useComponentId();

  const isEditing = useDesignerState(
    useCallback(
      (state) => state.selectedComponentId === componentId && state.isTextEditingEnabled,
      [componentId]
    )
  );

  // Focus the cursor at the last point when editing mode is enabled.
  useEffect(() => {
    if (isEditing) {
      setEditorState((state) => EditorState.forceSelection(state, cursorAtLast(state)));
    }
  }, [isEditing, setEditorState]);

  return isEditing;
}
