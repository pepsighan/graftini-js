import { useEditorStore } from '@graftini/graft';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/core';
import { HeightIcon, WidthIcon } from '@modulz/radix-icons';
import { useCallback } from 'react';
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

export default function DirectionInput({ componentId }) {
  const { control } = useFormContext();
  const immerSetEditor = useEditorStore(useCallback((state) => state.immerSet, []));

  return (
    <Controller
      name="flexDirection"
      control={control}
      render={({ field }) => (
        <ToggleButtonGroup
          exclusive
          value={field.value}
          onChange={(_, value) => {
            // Sync the append direction based on the flex direction.
            immerSetEditor((state) => {
              state.componentMap[componentId].childAppendDirection =
                value === 'column' ? 'vertical' : 'horizontal';
            });

            field.onChange(value);
          }}
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
