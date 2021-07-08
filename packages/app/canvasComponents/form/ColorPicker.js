import { rgbaToCss } from '@graftini/bricks';
import { Box, InputAdornment, Popover, TextField, Typography } from '@material-ui/core';
import { TransparencyGridIcon } from '@modulz/radix-icons';
import { useCallback, useState } from 'react';
import { RgbaColorPicker } from 'react-colorful';
import { Controller, useFormContext } from 'react-hook-form';

export default function ColorPicker({ name, label = null, onChange = null }) {
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
            value={field.value ? rgbaToCss({ ...field.value, a: null }) : ''}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <Typography variant="body2">{label}</Typography>
                </InputAdornment>
              ),
              // Show a chessboard bg to signify if there is transparency in the color.
              endAdornment: (
                <InputAdornment position="end">
                  <ColorBox value={field.value} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root, & .MuiOutlinedInput-input': {
                cursor: 'pointer',
              },
            }}
          />

          <ColorPickerInner
            open={open}
            onClose={onClose}
            value={field.value}
            onChange={(rgba) => {
              field.onChange(rgba);

              if (onChange) {
                onChange(rgba);
              }
            }}
          />
        </>
      )}
    />
  );
}

function ColorPickerInner({ value, onChange, open, onClose }) {
  return (
    <Popover
      open={!!open}
      anchorEl={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <Box
        sx={{
          '& .react-colorful': {
            padding: 1.2,
            borderRadius: 0,
            height: 200,
          },
          '& .react-colorful__saturation': {
            borderRadius: '0 !important',
            borderBottomWidth: 2,
          },
          '& .react-colorful__hue': {
            my: 1,
          },
          '& .react-colorful__hue, & .react-colorful__alpha': {
            borderRadius: '0 !important',
            height: 6,
          },
          ['& .react-colorful__saturation-pointer,' +
          ' & .react-colorful__hue-pointer, ' +
          ' & .react-colorful__alpha-pointer']: {
            height: 10,
            width: 10,
            cursor: 'pointer',
          },
          '& .react-colorful__last-control': {
            borderRadius: '0 !important',
          },
        }}
      >
        <RgbaColorPicker color={value} onChange={onChange} />
      </Box>
    </Popover>
  );
}

/**
 * Shows a preview of the color that is selected with a chessboard in the background if
 * there is transparency.
 */
function ColorBox({ value }) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 16,
        height: 16,
        borderRadius: 1,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'grey.400',
      }}
    >
      <TransparencyGridIcon width="100%" height="100%" />
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: value ? rgbaToCss(value) : null,
        }}
      />
    </Box>
  );
}
