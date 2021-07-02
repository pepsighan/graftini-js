import { InputAdornment, TextField, Typography } from '@material-ui/core';
import useMaterialFormRegister from 'hooks/useMaterialFormRegister';

export default function TextInput({ name, label, error = null, helperText = null }) {
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
