import { InputAdornment, TextField, Typography } from '@material-ui/core';
import { useCallback, useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import ColorBox from './ColorBox';

export default function BorderInput({ name }) {
  const { control } = useFormContext();

  // Since all the borders are going to be same for now. Lets just show the top.
  const border = useWatch({ control, name: `${name}.top` });

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
            value={border?.style ?? '-'}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <Typography variant="body2">Border</Typography>
                </InputAdornment>
              ),
              // Show a chessboard bg to signify if there is transparency in the color.
              endAdornment: border ? (
                <InputAdornment position="end">
                  <ColorBox value={border.color} />
                </InputAdornment>
              ) : null,
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
