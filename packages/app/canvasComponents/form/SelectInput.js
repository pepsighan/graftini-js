import { InputAdornment, TextField, Typography } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';
import { wideLabelAlignmentStyle } from './formLabels';

export default function SelectInput({ name, children, label }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          value={field.value ?? ''}
          select
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={wideLabelAlignmentStyle}>
                <Typography variant="body2">{label}</Typography>
              </InputAdornment>
            ),
          }}
        >
          {children}
        </TextField>
      )}
    />
  );
}
