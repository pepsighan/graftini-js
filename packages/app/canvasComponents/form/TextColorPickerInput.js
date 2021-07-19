import { setTextColor } from 'canvasComponents/proseEditor/commands';
import { useProseEditor } from 'canvasComponents/proseEditor/ProseEditorContext';
import useGetSelection from 'canvasComponents/proseEditor/useGetSelection';
import { useCallback } from 'react';
import ColorPickerInput from './ColorPickerInput';

export default function TextColorPickerInput({ componentId }) {
  const { getEditorView } = useProseEditor();
  const getSelection = useGetSelection(componentId);

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
