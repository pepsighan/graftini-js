import { InputAdornment, Popover, TextField, Typography } from '@material-ui/core';
import { useCallback, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { rgbaToViewableText } from 'utils/color';
import ColorBox from './ColorBox';
import ColorPicker from './ColorPicker';
import { wideLabelAlignmentStyle } from './formLabels';

export default function ColorPickerInput({ name, label = null, onChange = null }) {
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
            value={field.value ? rgbaToViewableText(field.value) : ''}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start" sx={wideLabelAlignmentStyle}>
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
      <ColorPicker value={value} onChange={onChange} />
    </Popover>
  );
}
