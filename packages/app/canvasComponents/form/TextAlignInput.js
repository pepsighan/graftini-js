import { ToggleButton, ToggleButtonGroup } from '@material-ui/core';
import {
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from '@modulz/radix-icons';
import { Controller, useFormContext } from 'react-hook-form';

const options = [
  {
    value: 'left',
    icon: <TextAlignLeftIcon width={20} height={20} />,
  },
  {
    value: 'center',
    icon: <TextAlignCenterIcon width={20} height={20} />,
  },
  {
    value: 'right',
    icon: <TextAlignRightIcon width={20} height={20} />,
  },
  {
    value: 'justify',
    icon: <TextAlignJustifyIcon width={20} height={20} />,
  },
];

export default function TextAlignInput({ name, componentId }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ToggleButtonGroup
          value={field.value}
          onChange={(_, value) => {
            // Update the form state. This value is only used within the form.
            field.onChange(value);
          }}
          exclusive
          sx={{
            justifyContent: 'center',
          }}
        >
          {options.map(({ value, icon }) => (
            <ToggleButton key={value} value={value}>
              {icon}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
    />
  );
}
