import {
  InputAdornment,
  MenuItem,
  Popover,
  Stack,
  TextField,
  Typography,
  Box,
} from '@material-ui/core';
import { capitalize } from 'lodash-es';
import { useCallback, useState } from 'react';
import { RgbaColorPicker } from 'react-colorful';
import { useFormContext, useWatch } from 'react-hook-form';
import ColorBox from './ColorBox';
import ColorPicker from './ColorPicker';

export default function BorderInput({ name }) {
  const { control } = useFormContext();

  // Since all the borders are going to be same for now. Lets just show the top.
  const borderStyle = useWatch({ control, name: `${name}.top.style` });
  const borderColor = useWatch({ control, name: `${name}.top.color` });

  const [open, setOpen] = useState(null);
  const onOpen = useCallback((event) => {
    setOpen(event.currentTarget);
  }, []);
  const onClose = useCallback(() => setOpen(null), []);

  return (
    <>
      <TextField
        onClick={onOpen}
        value={borderStyle ?? '-'}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">
              <Typography variant="body2">Border</Typography>
            </InputAdornment>
          ),
          // Show a chessboard bg to signify if there is transparency in the color.
          endAdornment: borderColor ? (
            <InputAdornment position="end">
              <ColorBox value={borderColor} />
            </InputAdornment>
          ) : null,
        }}
        sx={{
          '& .MuiOutlinedInput-root, & .MuiOutlinedInput-input': {
            cursor: 'pointer',
          },
        }}
      />

      <BorderDialog control={control} open={open} onClose={onClose} />
    </>
  );
}

const borderStyles = ['solid', 'dashed', 'dotted'];

function BorderDialog({ control, name, open, onClose }) {
  const borderStyle = useWatch({ control, name: `${name}.top.style` });
  const borderColor = useWatch({ control, name: `${name}.top.color` });
  const borderWidth = useWatch({ control, name: `${name}.top.width` });

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
      <Stack spacing={2} p={2}>
        <ColorPickerWrapper />

        <TextField
          value={borderStyle}
          select
          sx={{ width: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography variant="body2">Style</Typography>
              </InputAdornment>
            ),
          }}
        >
          {borderStyles.map((it) => (
            <MenuItem key={it} value={it}>
              {capitalize(it)}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          value={borderWidth}
          sx={{ width: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography variant="body2">Width</Typography>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Popover>
  );
}

function ColorPickerWrapper({ value, onChange }) {
  return (
    <>
      <ColorPicker value={value} onChange={onChange} padding={0} />
      <TextField
        value="#FAFAFA"
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">
              <Typography variant="body2">Color</Typography>
            </InputAdornment>
          ),
          // Show a chessboard bg to signify if there is transparency in the color.
          endAdornment: (
            <InputAdornment position="end">
              <ColorBox value={{ r: 0, g: 0, b: 0, a: 0.2 }} />
            </InputAdornment>
          ),
        }}
        sx={{ width: 200 }}
      />
    </>
  );
}
