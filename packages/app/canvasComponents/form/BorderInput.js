import { rgbaToCss } from '@graftini/bricks';
import { InputAdornment, TextField, Typography } from '@material-ui/core';
import { useCallback, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import ColorBox from './ColorBox';

export default function BorderInput({ name }) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(null);

  const onOpen = useCallback((event) => {
    setOpen(event.currentTarget);
  }, []);
  const onClose = useCallback(() => setOpen(null), []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <>
          <TextField
            onClick={onOpen}
            value="Solid"
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <Typography variant="body2">Border</Typography>
                </InputAdornment>
              ),
              // Show a chessboard bg to signify if there is transparency in the color.
              endAdornment: (
                <InputAdornment position="end">
                  <ColorBox value={{ r: 0, g: 0, b: 0 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root, & .MuiOutlinedInput-input': {
                cursor: 'pointer',
              },
            }}
          />
        </>
      )}
    />
  );
}
