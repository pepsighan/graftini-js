import { rgbaToCss } from '@graftini/bricks';
import {
  Button,
  InputAdornment,
  MenuItem,
  Popover,
  Stack,
  TextField,
  Typography,
} from '@material-ui/core';
import { Cross1Icon } from '@modulz/radix-icons';
import { capitalize } from 'lodash-es';
import { useCallback, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { parsePositiveInteger } from 'utils/parser';
import ColorBox from './ColorBox';
import ColorPicker from './ColorPicker';

export default function BorderInput({ name }) {
  const { control, getValues } = useFormContext();

  const borderSide = useWatch({ control, name });
  const { onSetDefault, onReset } = useSetFields({ name });

  const [open, setOpen] = useState(null);
  const onOpen = useCallback(
    (event) => {
      const borderSide = getValues().borderSide;
      if (!borderSide.width) {
        // If there is no border, on opening the border add a default one.
        onSetDefault();
      }

      setOpen(event.currentTarget);
    },
    [getValues, onSetDefault]
  );

  const onClose = useCallback(() => setOpen(null), []);

  return (
    <>
      <TextField
        onClick={onOpen}
        value={borderSide.width ? capitalize(borderSide.style) : ''}
        placeholder="Add"
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">
              <Typography variant="body2">Border</Typography>
            </InputAdornment>
          ),
          // Show a chessboard bg to signify if there is transparency in the color.
          endAdornment: borderSide.width ? (
            <InputAdornment position="end">
              <ColorBox value={borderSide.color} />

              <Button sx={{ ml: 1, width: 32, minWidth: 'auto' }} onClick={onReset}>
                <Cross1Icon />
              </Button>
            </InputAdornment>
          ) : null,
        }}
        sx={{
          '& .MuiOutlinedInput-root, & .MuiOutlinedInput-input': {
            cursor: 'pointer',
          },
          '& .MuiOutlinedInput-root': {
            paddingRight: 0,
          },
        }}
      />

      <BorderDialog name={name} open={open} onClose={onClose} borderSide={borderSide} />
    </>
  );
}

const borderStyles = ['solid', 'dashed', 'dotted'];

function BorderDialog({ name, open, onClose, borderSide }) {
  const { setValue } = useFormContext();
  const onSetStyle = useCallback((value) => setValue(`${name}.style`, value), [name, setValue]);
  const onSetColor = useCallback((value) => setValue(`${name}.color`, value), [name, setValue]);
  const onSetWidth = useCallback((value) => setValue(`${name}.width`, value), [name, setValue]);

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
        <ColorPickerWrapper value={borderSide.color} onChange={onSetColor} />

        <TextField
          value={borderSide.style}
          select
          sx={{ width: 200 }}
          onChange={useCallback(
            (event) => {
              onSetStyle(event.target.value);
            },
            [onSetStyle]
          )}
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
          value={borderSide.width}
          sx={{ width: 200 }}
          onChange={useCallback(
            (event) => {
              onSetWidth(parsePositiveInteger(event.target.value) || 0);
            },
            [onSetWidth]
          )}
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
        value={rgbaToCss({ ...value, a: null })}
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
              <ColorBox value={value} />
            </InputAdornment>
          ),
        }}
        sx={{ width: 200 }}
      />
    </>
  );
}

export const defaultBorderSide = {
  style: 'solid',
  color: { r: 0, g: 0, b: 0 },
  width: 1,
};

function useSetFields({ name }) {
  const { setValue } = useFormContext();

  const onSetValue = useCallback(
    (key, value) => setValue(key, value, { shouldValidate: true, shouldDirty: true }),
    [setValue]
  );

  const onSetDefault = useCallback(() => {
    onSetValue(name, defaultBorderSide);
  }, [name, onSetValue]);

  const onReset = useCallback(
    (event) => {
      event.stopPropagation();
      onSetValue(name, { ...defaultBorderSide, width: 0 });
    },
    [name, onSetValue]
  );

  return { onSetDefault, onReset };
}
