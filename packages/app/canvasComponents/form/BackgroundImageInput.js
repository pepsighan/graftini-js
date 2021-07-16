import { Box, InputAdornment, Popover, TextField, Typography } from '@material-ui/core';
import { useCallback, useState } from 'react';
import { wideLabelAlignmentStyle } from './formLabels';

export default function BackgroundImageInput() {
  const imageUrl = null;

  const [open, setOpen] = useState(null);
  const onOpen = useCallback((event) => setOpen(event.currentTarget), []);
  const onClose = useCallback(() => setOpen(null), []);

  return (
    <>
      <TextField
        placeholder="Add"
        onClick={onOpen}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start" sx={wideLabelAlignmentStyle}>
              <Typography variant="body2">Image</Typography>
            </InputAdornment>
          ),
          endAdornment: imageUrl ? (
            <InputAdornment position="end">
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  bgcolor: 'grey.200',
                  borderRadius: 1,
                  backgroundImage: `url(${imageUrl})`,
                }}
              />
            </InputAdornment>
          ) : null,
        }}
        sx={{
          '& .MuiOutlinedInput-root, & .MuiOutlinedInput-input': {
            cursor: 'pointer',
          },
        }}
      />

      <ImagePickerPopover open={open} onClose={onClose} />
    </>
  );
}

function ImagePickerPopover({ value, onChange, open, onClose }) {
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
      <Box sx={{ p: 1 }}>Hello World</Box>
    </Popover>
  );
}
