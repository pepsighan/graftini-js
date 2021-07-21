import { Box, InputAdornment, Stack, TextField, Typography } from '@material-ui/core';
import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { parsePositiveInteger } from 'utils/parser';
import { thinLabelAlignmentStyle } from './formLabels';
import useEnableContextMenu from './useEnableContextMenu';

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
          <InputAdornment position="start" sx={thinLabelAlignmentStyle}>
            <Typography variant="body2">{label}</Typography>
          </InputAdornment>
        ),
      }}
      inputProps={{
        onContextMenu: useEnableContextMenu(),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          paddingLeft: 1,
        },
      }}
    />
  );
}
