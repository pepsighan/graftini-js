import { applyStyleOption, StyleOption } from 'canvasComponents/textEditor/styleMap';
import { useResolveCurrentSelection } from 'canvasComponents/textEditor/textSelection';
import { useTextEditorStateSetter } from 'canvasComponents/textEditor/useTextEditorState';
import { useCallback } from 'react';
import ColorPickerInput from './ColorPickerInput';

export default function TextColorPickerInput({ componentId }) {
  const setTextEditor = useTextEditorStateSetter({ componentId });
  const resolveCurrentSelection = useResolveCurrentSelection({ componentId });

  return (
    <ColorPickerInput
      name="color"
      label="Color"
      onChange={useCallback(
        (rgba) => {
          setTextEditor((editor) => {
            const selection = resolveCurrentSelection();
            return applyStyleOption(editor, selection, StyleOption.TextColor, rgba);
          });
        },
        [resolveCurrentSelection, setTextEditor]
      )}
    />
  );
}
