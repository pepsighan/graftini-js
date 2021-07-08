import { InputAdornment, MenuItem, TextField, Typography } from '@material-ui/core';
import { applyStyleOption, StyleOption } from 'canvasComponents/textEditor/styleMap';
import { selectAll } from 'canvasComponents/textEditor/textSelection';
import {
  useIsTextEditingEnabledGetter,
  useTextEditorStateSetter,
} from 'canvasComponents/textEditor/useTextEditorState';
import { Controller, useFormContext } from 'react-hook-form';

const fontWeights = [
  { value: 100, label: 'Extra Thin' },
  { value: 200, label: 'Thin' },
  { value: 300, label: 'Light' },
  { value: 400, label: 'Normal' },
  { value: 500, label: 'Medium' },
  { value: 600, label: 'Semi Bold' },
  { value: 700, label: 'Bold' },
  { value: 800, label: 'Extra Bold' },
  { value: 900, label: 'Extra Extra Bold' },
];

export default function FontWeightInput({ componentId }) {
  const { control } = useFormContext();
  const getIsTextEditingEnabled = useIsTextEditingEnabledGetter({ componentId });
  const setTextEditor = useTextEditorStateSetter({ componentId });

  return (
    <Controller
      name="fontWeight"
      control={control}
      render={({ field: { ref, value, onChange } }) => (
        <TextField
          ref={ref}
          onChange={(event) => {
            const oldValue = value;
            onChange(event);

            setTextEditor((editor) => {
              // If the editing mode is yet not active but the component is selected to be configured
              // then the selection is deemed to be the whole text within the editor.
              const selection = getIsTextEditingEnabled()
                ? editor.getSelection()
                : selectAll(editor);

              return applyStyleOption(
                editor,
                selection,
                StyleOption.FontWeight,
                event.target.value,
                oldValue
              );
            });
          }}
          value={value ?? ''}
          select
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography variant="body2">Weight</Typography>
              </InputAdornment>
            ),
          }}
        >
          {fontWeights.map((weight) => (
            <MenuItem key={weight.value} value={weight.value}>
              {weight.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
