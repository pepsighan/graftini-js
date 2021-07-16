import { ComponentMap, useEditorStore } from '@graftini/graft';
import { convertFromRaw, EditorState, SelectionState } from 'draft-js';
import { useCallback } from 'react';

export default function useTextSelectionId(componentId: string): string {
  return useEditorStore(
    useCallback(
      (state) => {
        const selection = getTextSelectionForComponent(state.componentMap, componentId);
        return (
          `${selection.getAnchorKey()}-${selection.getAnchorOffset()}-` +
          `${selection.getFocusKey()}-${selection.getFocusOffset()}`
        );
      },
      [componentId]
    )
  );
}

/**
 * Gets the current selection for the text component.
 */
export function getTextSelectionForComponent(
  componentMap: ComponentMap,
  componentId: string
): SelectionState {
  // This may be the selection which exists when the text editor is no longer in focus.
  const backupSelection = componentMap[componentId].props.textSelection;

  const activeSelection = (
    componentMap[componentId].props.editor ??
    // If the editor is yet not created, create it from raw.
    EditorState.createWithContent(convertFromRaw(componentMap[componentId].props.content))
  ).getSelection();

  return backupSelection ?? activeSelection;
}
