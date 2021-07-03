import { EditorState, Modifier } from 'draft-js';
import { createContext, PropsWithChildren, useCallback, useContext } from 'react';
import { useGetSet } from 'react-use';
import { StyleOption } from './styleMap';
import { EditorStateSetter } from './useSyncEditorState';

const TextSelectionContext = createContext<ReturnType<typeof useGetSet> | null>(null);

export function TextSelectionProvider({ children }: PropsWithChildren<{}>) {
  const getset = useGetSet(false);
  return <TextSelectionContext.Provider value={getset}>{children}</TextSelectionContext.Provider>;
}

/**
 * Marks the currently selected text (that is selected using cursor) as selected (in metadata)
 * so that it is retained even when the text editor is not in focus.
 */
export function useMarkTextAsSelected(setState: EditorStateSetter) {
  const setSelected = useContext(TextSelectionContext)[1];

  return useCallback(() => {
    setSelected(true);

    return setState((editorState) =>
      EditorState.createWithContent(
        Modifier.applyInlineStyle(
          editorState.getCurrentContent(),
          editorState.getSelection(),
          StyleOption.TextSelection
        )
      )
    );
  }, [setSelected, setState]);
}

/**
 * Resets the currently selected text (in metadata).
 */
export function useResetTextSelection(setState: EditorStateSetter) {
  const [getSelected] = useContext(TextSelectionContext);

  return useCallback(() => {
    const isSelected = getSelected();
    if (!isSelected) {
      // No reason to remove selection if it was not selected. This fixes
      // issue with weird text selection issues.
      return;
    }

    setState((editorState) => {
      return EditorState.createWithContent(
        Modifier.removeInlineStyle(
          editorState.getCurrentContent(),
          // We remove selection from all because the cursor selection onBlur
          // may still not be present.
          selectAll(editorState),
          StyleOption.TextSelection
        )
      );
    });
  }, [getSelected, setState]);
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
