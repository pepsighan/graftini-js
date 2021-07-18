import { setTextColor } from 'canvasComponents/proseEditor/commands';
import { useProseEditor } from 'canvasComponents/proseEditor/ProseEditorContext';
import { useCallback } from 'react';
import ColorPickerInput from './ColorPickerInput';

export default function TextColorPickerInput() {
  const { getEditorView } = useProseEditor();

  return (
    <ColorPickerInput
      name="color"
      label="Color"
      onChange={useCallback(
        (rgba) => {
          const view = getEditorView();
          setTextColor(rgba, view);
        },
        [getEditorView]
      )}
    />
  );
}
