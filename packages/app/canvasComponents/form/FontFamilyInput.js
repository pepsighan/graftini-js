import { InputAdornment, MenuItem, TextField, Typography } from '@material-ui/core';
import { applyStyleOption, StyleOption } from 'canvasComponents/textEditor/styleMap';
import { useResolveCurrentSelection } from 'canvasComponents/textEditor/textSelection';
import { useTextEditorStateSetter } from 'canvasComponents/textEditor/useTextEditorState';
import { Controller, useFormContext } from 'react-hook-form';

export default function FontFamilyInput({ componentId }) {
  const { control } = useFormContext();
  const setTextEditor = useTextEditorStateSetter({ componentId });
  const resolveCurrentSelection = useResolveCurrentSelection({ componentId });

  return (
    <Controller
      name="fontFamily"
      control={control}
      render={({ field: { ref, value, onChange } }) => (
        <TextField
          ref={ref}
          onChange={(event) => {
            onChange(event);

            setTextEditor((editor) => {
              const selection = resolveCurrentSelection();

              return applyStyleOption(
                editor,
                selection,
                StyleOption.FontFamily,
                event.target.value
              );
            });
          }}
          value={value ?? ''}
          select
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography variant="body2">Font</Typography>
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="sans-serif">Sans Serif</MenuItem>
          <MenuItem value="serif">Serif</MenuItem>
          <MenuItem value="monospace">Monospace</MenuItem>
        </TextField>
      )}
    />
  );
}
