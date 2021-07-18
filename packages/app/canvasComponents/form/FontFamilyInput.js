import { InputAdornment, MenuItem, TextField, Typography } from '@material-ui/core';
import { setFontFamily } from 'canvasComponents/proseEditor/commands';
import { useProseEditor } from 'canvasComponents/proseEditor/ProseEditorContext';
import { Controller, useFormContext } from 'react-hook-form';
import { wideLabelAlignmentStyle } from './formLabels';

export default function FontFamilyInput() {
  const { control } = useFormContext();
  const { getEditorView } = useProseEditor();

  return (
    <Controller
      name="fontFamily"
      control={control}
      render={({ field: { ref, value, onChange } }) => (
        <TextField
          ref={ref}
          onChange={(event) => {
            onChange(event);

            const view = getEditorView();
            setFontFamily(event.target.value, view);
          }}
          value={value ?? ''}
          select
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={wideLabelAlignmentStyle}>
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
