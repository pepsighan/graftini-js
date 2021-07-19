import { useProseEditor } from './ProseEditorContext';
import useGetSelection from './useGetSelection';
import useIsEditing from './useIsEditing';

/**
 * A unique id for the current selection.
 */
export default function useCurrentSelectionId(componentId: string) {
  const { getCurrentSelection, getEditorView } = useProseEditor();
  const isEditing = useIsEditing(componentId);

  const selection = getCurrentSelection() ?? getEditorView()?.state?.selection;

  // This selection is based on whether the component is actively editing or not.
  // If not in editing, then the whole thing is deemed to be selected.
  // Note: We cannot just use this because this is not reactive. [selection] makes
  // it reactive.
  const getSelection = useGetSelection(componentId);

  // We need to the id for a selection based on whether they are editing or not.
  // Otherwise, the text options form looses focus.
  const resolvedSelection = isEditing ? selection : getSelection();

  return resolvedSelection ? `${resolvedSelection.from}-${resolvedSelection.to}` : 'no-selection';
}
