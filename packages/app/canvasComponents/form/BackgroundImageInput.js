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
import { useCallback, useState } from 'react';
import { wideLabelAlignmentStyle } from './formLabels';
import SelectInput from './SelectInput';

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
        <Box sx={{ height: 150, width: 200, bgcolor: 'grey.100', borderRadius: 1 }} />
        <Button fullWidth variant="contained">
          Browse
        </Button>

        <SelectInput name="backgroundFit" label="Fit">
          <MenuItem value="contain">Contain</MenuItem>
          <MenuItem value="cover">Cover</MenuItem>
        </SelectInput>
      </Stack>
    </Popover>
  );
}
