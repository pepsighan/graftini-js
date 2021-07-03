import { useComponentId } from '@graftini/graft';
import 'draft-js/dist/Draft.css';
import { useCallback, useEffect } from 'react';
import { useDesignerState, useDesignerStateApi } from 'store/designer';

/**
 * Manages focus on the editor whenever it gains or loses editable status.
 */
export default function useFocusOnEditingMode({ editorRef }) {
  const componentId = useComponentId();

  const isSelected = useDesignerState(
    useCallback((state) => state.selectedComponentId === componentId, [componentId])
  );

  const isEditable = useDesignerState(
    useCallback(
      (state) => state.selectedComponentId === componentId && state.isTextEditingEnabled,
      [componentId]
    )
  );

  const { subscribe } = useDesignerStateApi();
  useEffect(() => {
    return subscribe(
      (isEditable) => {
        if (!editorRef.current) {
          return;
        }

        // Forcefully focus the editor. Sometimes it does not automatically
        // give the focus when the editor turns off readOnly mode.
        if (isEditable) {
          editorRef.current.focus();
        } else {
          editorRef.current.blur();
        }
      },
      (state) => state.selectedComponentId === componentId && state.isTextEditingEnabled
    );
  }, [componentId, editorRef, subscribe]);

  return { isSelected, isEditable };
}
