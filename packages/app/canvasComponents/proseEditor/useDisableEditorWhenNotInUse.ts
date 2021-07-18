import { useComponentId } from '@graftini/graft';
import { EditorView } from 'prosemirror-view';
import { MutableRefObject, useEffect } from 'react';
import { useDesignerStateApi } from 'store/designer';

/**
 * Disabled the editor when it is not in use. To start editing, the text component
 * must be double clicked.
 */
export default function useDisableEditorWhenNotInUse(editorView: MutableRefObject<EditorView>) {
  const componentId = useComponentId();
  const { subscribe } = useDesignerStateApi();

  useEffect(() => {
    return subscribe(
      (isEditing: boolean) => {
        editorView.current.setProps({
          editable: () => isEditing,
        });
      },
      (state) => state.selectedComponentId === componentId && state.isTextEditingEnabled
    );
  }, [componentId, editorView, subscribe]);
}
