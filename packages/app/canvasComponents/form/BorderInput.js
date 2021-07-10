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
import { Controller, useFormContext, useWatch } from 'react-hook-form';
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

function BorderDialog({ name, open, onClose }) {
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
        <ColorPickerInput name={`${name}.color`} />
        <BorderStyleInput name={`${name}.style`} />
        <BorderWidthInput name={`${name}.width`} />
      </Stack>
    </Popover>
  );
}

function ColorPickerInput({ name }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <>
          <ColorPicker value={field.value} onChange={field.onChange} padding={0} />
          <TextField
            value={rgbaToCss({ ...field.value, a: null })}
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
                  <ColorBox value={field.value} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 200 }}
          />
        </>
      )}
    />
  );
}

const borderStyles = ['solid', 'dashed', 'dotted'];

function BorderStyleInput({ name }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          inputRef={field.ref}
          name={field.name}
          value={field.value}
          onChange={field.onChange}
          select
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography variant="body2">Style</Typography>
              </InputAdornment>
            ),
          }}
          sx={{ width: 200 }}
        >
          {borderStyles.map((it) => (
            <MenuItem key={it} value={it}>
              {capitalize(it)}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}

function BorderWidthInput({ name }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          inputRef={field.ref}
          name={field.name}
          value={field.value}
          onChange={(event) => {
            field.onChange(parsePositiveInteger(event.target.value) || 0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography variant="body2">Width</Typography>
              </InputAdornment>
            ),
          }}
          sx={{ width: 200 }}
        />
      )}
    />
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
