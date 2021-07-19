import { useProseEditor } from './ProseEditorContext';

/**
 * A unique id for the current selection.
 */
export default function useCurrentSelectionId() {
  const { getEditorView } = useProseEditor();
  const selection = getEditorView()?.state?.selection;
  return selection ? `${selection.from}-${selection.to}` : 'no-selection';
}
