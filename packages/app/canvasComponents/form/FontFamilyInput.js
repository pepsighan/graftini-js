import { InputAdornment, MenuItem, TextField, Typography } from '@material-ui/core';
import { setFontFamily } from 'canvasComponents/proseEditor/commands';
import { useProseEditor } from 'canvasComponents/proseEditor/ProseEditorContext';
import useGetSelectionForForm from 'canvasComponents/proseEditor/useGetSelectionForForm';
import { useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { wideLabelAlignmentStyle } from './formLabels';

const families = [
  ['sans-serif', 'Sans Serif'],
  ['serif', 'Serif'],
  ['monospace', 'Monospace'],
];

export default function FontFamilyInput({ componentId }) {
  const { control } = useFormContext();
  const { getEditorView } = useProseEditor();
  const getSelection = useGetSelectionForForm(componentId);

  const onSet = useCallback(
    (value) => {
      const view = getEditorView();
      setFontFamily(value, view, getSelection());
    },
    [getEditorView, getSelection]
  );

  return (
    <Controller
      name="fontFamily"
      control={control}
      render={({ field: { ref, value, onChange } }) => (
        <TextField
          ref={ref}
          onChange={(event) => {
            onChange(event);
            onSet(event.target.value);
          }}
          value={value ?? ''}
          select
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={wideLabelAlignmentStyle}>
                <Typography variant="body2">Font</Typography>
              </InputAdornment>
            ),
          }}
        >
          {families.map(([val, label]) => (
            // Apply the style even when the value may not change.
            <MenuItem key={val} value={val} onClick={val === value ? () => onSet(value) : null}>
              {label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
