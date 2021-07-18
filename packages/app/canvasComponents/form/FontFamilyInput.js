import { InputAdornment, MenuItem, TextField, Typography } from '@material-ui/core';
import { Controller, useFormContext } from 'react-hook-form';
import { wideLabelAlignmentStyle } from './formLabels';

export default function FontFamilyInput({ componentId }) {
  const { control } = useFormContext();

  return (
    <Controller
      name="fontFamily"
      control={control}
      render={({ field: { ref, value, onChange } }) => (
        <TextField
          ref={ref}
          onChange={(event) => {
            onChange(event);
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
