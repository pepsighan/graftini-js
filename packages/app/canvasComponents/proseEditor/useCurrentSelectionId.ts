import { useProseEditor } from './ProseEditorContext';

/**
 * A unique id for the current selection.
 */
export default function useCurrentSelectionId() {
  const { getCurrentSelection } = useProseEditor();
  const selection = getCurrentSelection();
  return selection ? `${selection.from}-${selection.to}` : 'no-selection';
}
