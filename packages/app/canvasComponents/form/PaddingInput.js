import { Box, Stack, Typography, TextField, InputAdornment } from '@material-ui/core';
import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { parsePositiveInteger } from 'utils/parser';

export default function PaddingInput({ name }) {
  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Padding
      </Typography>

      <Stack direction="row" spacing={1}>
        <NumberInputWithLabel name={`${name}.top`} label="T" />
        <NumberInputWithLabel name={`${name}.right`} label="R" />
        <NumberInputWithLabel name={`${name}.bottom`} label="B" />
        <NumberInputWithLabel name={`${name}.left`} label="L" />
      </Stack>
    </Box>
  );
}

function NumberInputWithLabel({ name, label }) {
  const { control, setValue } = useFormContext();
  const value = useWatch({ control, name });

  return (
    <TextField
      name={name}
      value={value}
      onChange={useCallback(
        (event) => {
          setValue(name, parsePositiveInteger(event.target.value) || 0);
        },
        [name, setValue]
      )}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Typography variant="body2">{label}</Typography>
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          paddingLeft: 1,
        },
      }}
    />
  );
}
