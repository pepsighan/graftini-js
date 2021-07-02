import { InputAdornment, Stack, TextField, Typography } from '@material-ui/core';
import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { parsePositiveInteger } from 'utils/parser';

export default function FlexProperties() {
  return (
    <Stack direction="row" spacing={1}>
      <FlexNumericInput name="flexGrow" label="Grow" />
      <FlexNumericInput name="flexShrink" label="Shrink" />
      <FlexNumericInput name="flexGap" label="Gap" />
    </Stack>
  );
}

function FlexNumericInput({ name, label }) {
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
