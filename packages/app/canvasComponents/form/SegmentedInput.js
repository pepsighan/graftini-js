import { ToggleButton, ToggleButtonGroup } from '@material-ui/core';
import { Controller, useFormContext } from 'react-hook-form';

export default function SegmentedInput({ name, options }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ToggleButtonGroup
          value={field.value}
          onChange={(_, value) => field.onChange(value)}
          sx={{ justifyContent: 'center' }}
          fullWidth
          exclusive
        >
          {options.map((it) => (
            <ToggleButton key={it.value} value={it.value}>
              {it.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
    />
  );
}
