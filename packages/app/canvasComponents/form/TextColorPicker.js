import { applyStyleOption, StyleOption } from 'canvasComponents/textEditor/styleMap';
import { useResolveCurrentSelection } from 'canvasComponents/textEditor/textSelection';
import { useTextEditorStateSetter } from 'canvasComponents/textEditor/useTextEditorState';
import { useCallback } from 'react';
import ColorPicker from './ColorPicker';

export default function TextColorPicker({ componentId }) {
  const setTextEditor = useTextEditorStateSetter({ componentId });
  const resolveCurrentSelection = useResolveCurrentSelection({ componentId });

  return (
    <ColorPicker
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
