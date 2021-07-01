import { InputAdornment, TextField, Typography } from '@material-ui/core';
import useMaterialFormRegister from 'hooks/useMaterialFormContext';

export default function TextInput({ name, label, error, helperText }) {
  return (
    <TextField
      {...useMaterialFormRegister(name)}
      error={error}
      helperText={helperText}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Typography variant="body2">{label}</Typography>
          </InputAdornment>
        ),
      }}
    />
  );
}
