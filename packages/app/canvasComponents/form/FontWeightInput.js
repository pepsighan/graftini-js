import { InputAdornment, MenuItem, TextField, Typography } from '@material-ui/core';
import { Controller, useFormContext } from 'react-hook-form';
import { wideLabelAlignmentStyle } from './formLabels';

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

  return (
    <Controller
      name="fontWeight"
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
