import { ToggleButton, ToggleButtonGroup } from '@material-ui/core';
import { HeightIcon, WidthIcon } from '@modulz/radix-icons';
import { Controller, useFormContext } from 'react-hook-form';

const options = [
  {
    value: 'column',
    icon: <HeightIcon height={24} width={24} />,
    label: 'Vertical',
  },
  {
    value: 'row',
    icon: <WidthIcon height={24} width={24} />,
    label: 'Horizontal',
  },
];

export default function DirectionInput() {
  const { control } = useFormContext();

  return (
    <Controller
      name="flexDirection"
      control={control}
      render={({ field }) => (
        <ToggleButtonGroup
          exclusive
          value={field.value}
          onChange={(_, value) => field.onChange(value)}
          sx={{ justifyContent: 'center' }}
        >
          {options.map(({ value, icon, label }) => {
            return (
              <ToggleButton key={value} value={value}>
                {icon}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      )}
    />
  );
}
