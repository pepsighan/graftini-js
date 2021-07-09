import { InputAdornment, MenuItem, Popover, Stack, TextField, Typography } from '@material-ui/core';
import { capitalize } from 'lodash-es';
import { useCallback, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import ColorBox from './ColorBox';
import ColorPicker from './ColorPicker';

export default function BorderInput({ name }) {
  const { control, getValues } = useFormContext();

  // Since all the borders are going to be same for now. Lets just show the top.
  const borderAll = useWatch({ control, name });
  const border = borderAll?.top;

  const { onSetDefault } = useSetFields({ name });

  const [open, setOpen] = useState(null);
  const onOpen = useCallback(
    (event) => {
      const border = getValues().border;
      if (!border) {
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
        value={border?.style}
        placeholder="Add"
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
        <ColorPickerWrapper value={borderColor} />

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

function useSetFields({ name }) {
  const { setValue } = useFormContext();

  const onSetValue = useCallback(
    (key, value) => setValue(key, value, { shouldValidate: true, shouldDirty: true }),
    [setValue]
  );

  const onSetDefault = useCallback(() => {
    const borderSide = {
      style: 'solid',
      color: { r: 0, g: 0, b: 0 },
      width: 1,
    };

    onSetValue(name, {
      top: borderSide,
      right: borderSide,
      bottom: borderSide,
      left: borderSide,
    });
  }, [name, onSetValue]);

  const onSetStyle = useCallback(
    (value) => {
      onSetValue(`${name}.top.style`, value);
      onSetValue(`${name}.right.style`, value);
      onSetValue(`${name}.bottom.style`, value);
      onSetValue(`${name}.left.style`, value);
    },
    [name, onSetValue]
  );

  const onSetColor = useCallback(
    (value) => {
      onSetValue(`${name}.top.color`, value);
      onSetValue(`${name}.right.color`, value);
      onSetValue(`${name}.bottom.color`, value);
      onSetValue(`${name}.left.color`, value);
    },
    [name, onSetValue]
  );

  const onSetWidth = useCallback(
    (value) => {
      onSetValue(`${name}.top.width`, value);
      onSetValue(`${name}.right.width`, value);
      onSetValue(`${name}.bottom.width`, value);
      onSetValue(`${name}.left.width`, value);
    },
    [name, onSetValue]
  );

  const onReset = useCallback(() => {
    onSetValue(name, null);
  }, [name, onSetValue]);

  return { onSetDefault, onSetStyle, onSetColor, onSetWidth, onReset };
}
