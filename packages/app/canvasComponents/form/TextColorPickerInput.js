import { setTextColor } from 'canvasComponents/proseEditor/commands';
import { useProseEditor } from 'canvasComponents/proseEditor/ProseEditorContext';
import useGetSelectionForForm from 'canvasComponents/proseEditor/useGetSelectionForForm';
import { useCallback } from 'react';
import ColorPickerInput from './ColorPickerInput';

export default function TextColorPickerInput({ componentId }) {
  const { getEditorView } = useProseEditor();
  const getSelection = useGetSelectionForForm(componentId);

  return (
    <ColorPickerInput
      name="color"
      label="Color"
      onChange={useCallback(
        (rgba) => {
          const view = getEditorView();
          setTextColor(rgba, view, getSelection());
        },
        [getEditorView, getSelection]
      )}
    />
  );
}
