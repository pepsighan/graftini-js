import { ToggleButton, ToggleButtonGroup } from '@material-ui/core';
import { AllSidesIcon, EyeClosedIcon, EyeOpenIcon, MagicWandIcon } from '@modulz/radix-icons';
import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

const options = [
  {
    value: 'visible',
    icon: <EyeOpenIcon width={20} height={20} />,
    label: 'Show',
  },
  {
    value: 'hidden',
    icon: <EyeClosedIcon width={20} height={20} />,
    label: 'Hide',
  },
  {
    value: 'scroll',
    icon: <AllSidesIcon width={20} height={20} />,
    label: 'Scroll',
  },
  {
    value: 'auto',
    icon: <MagicWandIcon width={20} height={20} />,
    label: 'Auto',
  },
];

export default function OverflowInput({ name }) {
  const { control, setValue } = useFormContext();
  const overflow = useWatch({ control, name: `${name}.x` });

  return (
    <ToggleButtonGroup
      value={overflow}
      onChange={useCallback(
        (_, value) => {
          // Update two parallel values. They are not configurable separately as of now.
          setValue(`${name}.x`, value, { shouldDirty: true, shouldValidate: true });
          setValue(`${name}.y`, value, { shouldDirty: true, shouldValidate: true });
        },
        [name, setValue]
      )}
      fullWidth
    >
      {options.map((it) => (
        <ToggleButton key={it.value} value={it.value}>
          {it.icon}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
