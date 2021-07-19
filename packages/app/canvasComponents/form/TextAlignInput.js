import { ToggleButton, ToggleButtonGroup } from '@material-ui/core';
import {
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from '@modulz/radix-icons';
import { setTextAlign } from 'canvasComponents/proseEditor/commands';
import { useProseEditor } from 'canvasComponents/proseEditor/ProseEditorContext';
import { useCallback } from 'react';
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

export default function TextAlignInput({ name }) {
  const { control } = useFormContext();
  const { getEditorView } = useProseEditor();

  const onSet = useCallback(
    (value) => {
      const view = getEditorView();
      setTextAlign(value, view);
    },
    [getEditorView]
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ToggleButtonGroup
          value={field.value}
          onChange={(_, value) => {
            if (!value) {
              // This is not a toggle for on and off. The value for alignment is
              // required.
              return;
            }

            // Update the form state. This value is only used within the form.
            field.onChange(value);
            onSet(value);
          }}
          exclusive
          sx={{
            justifyContent: 'center',
          }}
        >
          {options.map(({ value, icon }) => (
            <ToggleButton
              key={value}
              value={value}
              // Update the style even when the value may still be the same.
              onClick={value === field.value ? () => onSet(value) : null}
            >
              {icon}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
    />
  );
}
