import { ComponentMap, useEditorStore } from '@graftini/graft';
import { convertFromRaw, EditorState } from 'draft-js';
import { useCallback } from 'react';

export default function useTextSelectionId(componentId: string): string {
  return useEditorStore(
    useCallback(
      (state) => {
        const selection = getEditorState(state.componentMap, componentId).getSelection();
        return (
          `${selection.getAnchorKey()}-${selection.getAnchorOffset()}-` +
          `${selection.getFocusKey()}-${selection.getFocusOffset()}`
        );
      },
      [componentId]
    )
  );
}

function getEditorState(componentMap: ComponentMap, componentId: string): EditorState {
  return (
    componentMap[componentId].props.editor ??
    // If the editor is yet not created, create it from raw.
    EditorState.createWithContent(convertFromRaw(componentMap[componentId].props.content))
  );
}
