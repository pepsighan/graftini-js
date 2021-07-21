import {
  InputAdornment,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@material-ui/core';
import { BoxIcon, CornersIcon } from '@modulz/radix-icons';
import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { parsePositiveInteger } from 'utils/parser';
import { wideLabelAlignmentStyle } from './formLabels';
import useEnableContextMenu from './useEnableContextMenu';

export default function RadiusInput({ name }) {
  const { control, setValue } = useFormContext();
  const singleValue = useWatch({ control, name: `${name}.topLeft` });
  const toggle = useWatch({ control, name: `${name}.toggle` });

  const setV = useCallback(
    (name, value) => setValue(name, value, { shouldDirty: true, shouldValidate: true }),
    [setValue]
  );

  return (
    <>
      <TextField
        value={toggle === 'all' ? singleValue : ''}
        onChange={useCallback(
          (event) => {
            setV(`${name}.toggle`, 'all');

            const v = parsePositiveInteger(event.target.value) || 0;
            setV(`${name}.topLeft`, v);
            setV(`${name}.topRight`, v);
            setV(`${name}.bottomLeft`, v);
            setV(`${name}.bottomRight`, v);
          },
          [name, setV]
        )}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={wideLabelAlignmentStyle}>
              <Typography variant="body2">Radius</Typography>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <ToggleButtonGroup
                size="small"
                value={toggle}
                exclusive
                onChange={useCallback(
                  (_, value) => {
                    setV(`${name}.toggle`, value);
                  },
                  [name, setV]
                )}
              >
                <ToggleButton value="all">
                  <BoxIcon />
                </ToggleButton>
                <ToggleButton value="each">
                  <CornersIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </InputAdornment>
          ),
        }}
        inputProps={{
          onContextMenu: useEnableContextMenu(),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            paddingRight: 0,
          },
        }}
      />

      {toggle === 'each' && (
        <Stack direction="row" spacing={1}>
          <NumberInputWithLabel name={`${name}.topLeft`} label="TL" />
          <NumberInputWithLabel name={`${name}.topRight`} label="TR" />
          <NumberInputWithLabel name={`${name}.bottomLeft`} label="BL" />
          <NumberInputWithLabel name={`${name}.bottomRight`} label="BR" />
        </Stack>
      )}
    </>
  );
}

function NumberInputWithLabel({ name, label }) {
  const { control, setValue } = useFormContext();
  const value = useWatch({ control, name });

  const onChange = useCallback(
    (event) => {
      setValue(name, parsePositiveInteger(event.target.value) || 0);
    },
    [name, setValue]
  );

  return (
    <TextField
      name={name}
      value={value}
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Typography variant="body2">{label}</Typography>
          </InputAdornment>
        ),
      }}
      inputProps={{
        onContextMenu: useEnableContextMenu(),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          paddingLeft: 1,
        },
      }}
    />
  );
}
