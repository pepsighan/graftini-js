import { useComponentId } from '@graftini/graft';
import { useProseEditor } from './ProseEditorContext';
import useGetSelection from './useGetSelection';
import useIsEditing from './useIsEditing';

/**
 * A unique id for the current selection.
 */
export default function useCurrentSelectionId() {
  const { getCurrentSelection } = useProseEditor();
  const isEditing = useIsEditing();
  const componentId = useComponentId();

  // This selection is based on whether the component is actively editing or not.
  // If not in editing, then the whole thing is deemed to be selected.
  const getSelection = useGetSelection(componentId);

  const selection = getCurrentSelection();

  // We need to the id for a selection based on whether they are editing or not.
  // Otherwise, the text options form looses focus.
  const resolvedSelection = isEditing ? selection : getSelection();

  return selection ? `${resolvedSelection.from}-${resolvedSelection.to}` : 'no-selection';
}
