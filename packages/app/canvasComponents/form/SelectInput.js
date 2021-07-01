import { InputAdornment, TextField, Typography } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';

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
              <InputAdornment position="start">
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
