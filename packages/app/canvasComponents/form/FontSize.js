import { InputAdornment, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { parsePositiveInteger } from 'utils/parser';

export default function FontSize({ name }) {
  const { control, setValue } = useFormContext();
  const size = useWatch({ control, name: `${name}.size` });
  const unit = useWatch({ control, name: `${name}.unit` });

  return (
    <TextField
      name={name}
      value={size}
      onChange={useCallback(
        (event) => {
          setValue(`${name}.size`, parsePositiveInteger(event.target.value) || 0);
        },
        [name, setValue]
      )}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Typography variant="body2">Size</Typography>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <Select
              value={unit}
              onChange={useCallback(
                (event) => setValue(`${name}.unit`, event.target.value),
                [name, setValue]
              )}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 0,
                },
              }}
            >
              <MenuItem value="px">px</MenuItem>
              <MenuItem value="rem">rem</MenuItem>
            </Select>
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          paddingRight: 0,
        },
      }}
    />
  );
}
