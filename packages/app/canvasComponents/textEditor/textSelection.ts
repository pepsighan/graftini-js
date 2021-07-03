import { EditorState, Modifier } from 'draft-js';
import { StyleOption } from './styleMap';
import { EditorStateSetter } from './useSyncEditorState';

/**
 * Marks the currently selected text (that is selected using cursor) as selected (in metadata)
 * so that it is retained even when the text editor is not in focus.
 */
export function markTextAsSelected(setState: EditorStateSetter) {
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

/**
 * Resets the currently selected text (in metadata).
 */
export function resetTextSelection(setState: EditorStateSetter) {
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

/**
 * Creates a selection that spans everything within the editor.
 */
export function selectAll(editorState: EditorState) {
  const currentContent = editorState.getCurrentContent();

  return editorState.getSelection().merge({
    anchorKey: currentContent.getFirstBlock().getKey(),
    anchorOffset: 0,
    focusKey: currentContent.getLastBlock().getKey(),
    focusOffset: currentContent.getLastBlock().getText().length,
  });
}
