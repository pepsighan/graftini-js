import { Box, InputAdornment, Stack, TextField, Typography } from '@material-ui/core';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { parseInteger } from 'utils/parser';
import { thinLabelAlignmentStyle } from './formLabels';

// TODO: Typing negative numbers is kind of weird. Cannot start typing with - right now.
// Has to be some non-zero positive number written first and then - prepended. Which is
// not good experience.
export default function MarginInput({ name }) {
  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Margin
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
  const { register, setValue } = useFormContext();
  const { ref: inputRef } = register(name);

  return (
    <TextField
      inputRef={inputRef}
      name={name}
      onChange={useCallback(
        (event) => {
          setValue(name, parseInteger(event.target.value) || 0, {
            shouldDirty: true,
            shouldValidate: true,
          });
        },
        [name, setValue]
      )}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={thinLabelAlignmentStyle}>
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
