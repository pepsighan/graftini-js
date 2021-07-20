import { InputAdornment, TextField, Typography } from '@material-ui/core';
import useMaterialFormRegister from 'hooks/useMaterialFormRegister';

export default function TextareaInput({ name, label }) {
  return (
    <TextField
      {...useMaterialFormRegister(name)}
      multiline
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            sx={{
              alignSelf: 'flex-start',
              marginTop: 1.2,
              marginBottom: 1.8,
            }}
          >
            <Typography variant="body2">{label}</Typography>
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          flexDirection: 'column',
        },
      }}
    />
  );
}
