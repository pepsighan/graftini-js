import { InputAdornment, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { applyStyleOption, StyleOption } from 'canvasComponents/textEditor/styleMap';
import { useResolveCurrentSelection } from 'canvasComponents/textEditor/textSelection';
import { useTextEditorStateSetter } from 'canvasComponents/textEditor/useTextEditorState';
import { useCallback, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { parsePositiveFloat, parsePositiveInteger, toTwoDecimalPlaces } from 'utils/parser';
import { wideLabelAlignmentStyle } from './formLabels';

const nonNumberChars = /[^0-9.]+/g;

export default function FontSizeInput({ name, componentId }) {
  const { control, setValue } = useFormContext();
  const size = useWatch({ control, name: `${name}.size` });
  const unit = useWatch({ control, name: `${name}.unit` });

  // To support floating values.
  const [sizeLocal, setSizeLocal] = useState(size);

  const setTextEditor = useTextEditorStateSetter({ componentId });
  const resolveCurrentSelection = useResolveCurrentSelection({ componentId });

  const onUpdateStyle = useCallback(
    (size, unit) => {
      setTextEditor((editor) => {
        const selection = resolveCurrentSelection();

        return applyStyleOption(editor, selection, StyleOption.FontSize, {
          size,
          unit,
        });
      });
    },
    [resolveCurrentSelection, setTextEditor]
  );

  return (
    <TextField
      name={name}
      value={sizeLocal}
      onChange={useCallback(
        (event) => {
          // Remove any non numerical character.
          const sanitized = event.target.value.replaceAll(nonNumberChars, '');
          let size;

          // Allow setting floating values to `rem` units and integer values to `px` units.
          if (unit === 'rem') {
            const parsed = parsePositiveFloat(sanitized);
            size = toTwoDecimalPlaces(parsed || 0);

            if (sanitized === toTwoDecimalPlaces(parsed).toString() || sanitized.endsWith('.')) {
              // This path only has two decimal places in the input text.
              setSizeLocal(sanitized);
            } else {
              // Do not allow a number more than two decimal places in the input. Also do not
              // allow prefix 0's. Those have no meaning other than noise.
              setSizeLocal(`${toTwoDecimalPlaces(parsed)}`);
            }
          } else {
            size = parsePositiveInteger(sanitized) || 0;
          }

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
                  setValue(`${name}.unit`, event.target.value);
                  onUpdateStyle(size, event.target.value);
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
