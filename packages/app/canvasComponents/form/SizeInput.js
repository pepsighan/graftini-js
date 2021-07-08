import { Button, InputAdornment, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { parsePositiveInteger } from 'utils/parser';

const units = ['px', '%'];

export default function SizeInput({ name, label }) {
  const { control, setValue } = useFormContext();
  const size = useWatch({ control, name: `${name}.size` });
  const unit = useWatch({ control, name: `${name}.unit` });
  const toggle = useWatch({ control, name: `${name}.toggle` });

  const onSizeChange = useCallback(
    (event) => {
      setValue(`${name}.size`, parsePositiveInteger(event.target.value) || 0);
    },
    [name, setValue]
  );

  const onUnitChange = useCallback(
    (event) =>
      setValue(`${name}.unit`, event.target.value, {
        shouldDirty: true,
        shouldValidate: true,
      }),
    [name, setValue]
  );

  const onToggleAuto = useCallback(
    () =>
      setValue(`${name}.toggle`, toggle ? null : 'auto', {
        shouldDirty: true,
        shouldValidate: true,
      }),
    [name, setValue, toggle]
  );

  return (
    <TextField
      name={name}
      value={toggle === 'auto' ? 'Auto' : size}
      onChange={onSizeChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Typography variant="body2">{label}</Typography>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            {toggle !== 'auto' && (
              <Select
                value={unit}
                onChange={onUnitChange}
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
            )}

            <Button
              variant={toggle === 'auto' ? 'contained' : 'text'}
              color="inherit"
              onClick={onToggleAuto}
            >
              Auto
            </Button>
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
