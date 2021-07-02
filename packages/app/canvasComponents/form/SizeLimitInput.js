import { InputAdornment, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { parsePositiveInteger } from 'utils/parser';

const units = ['px', '%'];

export default function SizeLimitInput({ name, label }) {
  const { setValue, control } = useFormContext();
  const size = useWatch({ control, name: `${name}.size` });
  const unit = useWatch({ control, name: `${name}.unit` });

  return (
    <TextField
      name={name}
      value={size}
      onChange={useCallback(
        (event) => {
          const value = event.target.value.trim();
          setValue(`${name}.size`, value ? parsePositiveInteger(value) || 0 : '');
        },
        [name, setValue]
      )}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Typography variant="body2">{label}</Typography>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <Select
              value={unit}
              onChange={useCallback(
                (event) =>
                  setValue(`${name}.unit`, event.target.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  }),
                [name, setValue]
              )}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 0,
                },
              }}
            >
              {units.map((it) => (
                <MenuItem key={it} value={it}>
                  {it}
                </MenuItem>
              ))}
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
