import { useEffect } from 'react';
import { useProseEditor } from './ProseEditorContext';

export default function useMakeEditorEditable(isEditing: boolean) {
  const { getEditorView } = useProseEditor();

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const view = getEditorView();
    view.setProps({
      editable: () => true,
    });
  }, [getEditorView, isEditing]);
}
