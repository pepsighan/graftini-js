import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Popover,
  Stack,
  TextField,
  Typography,
} from '@material-ui/core';
import { useCallback, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { wideLabelAlignmentStyle } from './formLabels';
import SelectInput from './SelectInput';

export default function BackgroundImageInput() {
  const [open, setOpen] = useState(null);
  const onOpen = useCallback((event) => setOpen(event.currentTarget), []);
  const onClose = useCallback(() => setOpen(null), []);

  const { control } = useFormContext();
  const imageUrl = useWatch({ control, name: 'imageUrl' });

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

function ImagePickerPopover({ open, onClose }) {
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
      <Stack sx={{ p: 1.2 }} spacing={1}>
        <ImagePicker />

        <SelectInput name="backgroundFit" label="Fit">
          <MenuItem value="contain">Contain</MenuItem>
          <MenuItem value="cover">Cover</MenuItem>
        </SelectInput>
      </Stack>
    </Popover>
  );
}

function ImagePicker() {
  const inputRef = useRef();

  const onBrowse = useCallback(() => {
    // Open the file explorer.
    inputRef.current.click();
  }, []);

  return (
    <>
      <Box sx={{ height: 150, width: 200, bgcolor: 'grey.100', borderRadius: 1 }} />
      <Button fullWidth variant="contained" onClick={onBrowse}>
        Browse
      </Button>

      <Box
        ref={inputRef}
        component="input"
        type="file"
        sx={{ display: 'none' }}
        // Only the given mime-types are supported in the backend.
        // We'll add support for more as required.
        accept="image/jpeg,image/png,image/webp"
      />
    </>
  );
}
