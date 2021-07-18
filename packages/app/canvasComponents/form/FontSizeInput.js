import { InputAdornment, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { setFontSize } from 'canvasComponents/proseEditor/commands';
import { useProseEditor } from 'canvasComponents/proseEditor/ProseEditorContext';
import { useCallback, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { parsePositiveFloat, parsePositiveInteger, toTwoDecimalPlaces } from 'utils/parser';
import { wideLabelAlignmentStyle } from './formLabels';

const nonNumberChars = /[^0-9.]+/g;

export default function FontSizeInput({ name }) {
  const { control, setValue } = useFormContext();
  const size = useWatch({ control, name: `${name}.size` });
  const unit = useWatch({ control, name: `${name}.unit` });

  // To support floating values.
  const [sizeLocal, setSizeLocal] = useState(size);

  const { getEditorView } = useProseEditor();
  const onUpdateStyle = useCallback(
    (size, unit) => {
      const view = getEditorView();
      setFontSize({ size, unit }, view);
    },
    [getEditorView]
  );

  return (
    <TextField
      name={name}
      value={sizeLocal}
      onChange={useCallback(
        (event) => {
          // Remove any non numerical character.
          const sanitized = event.target.value.replaceAll(nonNumberChars, '');

          const size = parseFontSize({ value: sanitized, unit, setSizeLocal });
          setValue(`${name}.size`, size);
          onUpdateStyle(size, unit);
        },
        [name, onUpdateStyle, setValue, unit]
      )}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={wideLabelAlignmentStyle}>
            <Typography variant="body2">Size</Typography>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <Select
              value={unit}
              onChange={useCallback(
                (event) => {
                  const unit = event.target.value;
                  const newSize = parseFontSize({ value: size.toString(), unit, setSizeLocal });

                  // Changing units may also change the type of size. px can only be integer
                  // and rem can by float.
                  setValue(`${name}.size`, newSize);
                  setValue(`${name}.unit`, unit);

                  onUpdateStyle(newSize, unit);
                },
                [name, onUpdateStyle, setValue, size]
              )}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 0,
                },
              }}
            >
              <MenuItem value="px">px</MenuItem>
              <MenuItem value="rem">rem</MenuItem>
            </Select>
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          paddingRight: 0,
        },
      }}
    />
  );
}

function parseFontSize({ value, unit, setSizeLocal }) {
  let size;

  // Allow setting floating values to `rem` units and integer values to `px` units.
  if (unit === 'rem') {
    const parsed = parsePositiveFloat(value);
    size = toTwoDecimalPlaces(parsed || 0);

    if (value === toTwoDecimalPlaces(parsed).toString() || value.endsWith('.')) {
      // This path only has two decimal places in the input text.
      setSizeLocal(value);
    } else {
      // Do not allow a number more than two decimal places in the input. Also do not
      // allow prefix 0's. Those have no meaning other than noise.
      setSizeLocal(`${toTwoDecimalPlaces(parsed)}`);
    }
  } else {
    size = parsePositiveInteger(value) || 0;
    setSizeLocal(`${size}`);
  }

  return size;
}
