import { Button, ButtonGroup } from '@chakra-ui/button';
import { Tooltip } from '@chakra-ui/tooltip';
import { Controller, useFormContext } from 'react-hook-form';

export default function SegmentedInput({ name, size = 'sm', isFullWidth = false, options }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <SegmentedInputInner
          options={options}
          value={field.value}
          size={size}
          isFullWidth={isFullWidth}
          onChange={field.onChange}
        />
      )}
    />
  );
}

function SegmentedInputInner({ size, options, value, isFullWidth, onChange }) {
  return (
    <ButtonGroup size={size} isAttached variant="outline" width={isFullWidth ? '100%' : null}>
      {options.map((opt) => {
        const button = (
          <Button
            key={opt.value}
            bg={value === opt.value ? 'white' : 'gray.200'}
            color={value === opt.value ? 'black' : 'gray.600'}
            onClick={() => onChange(opt.value)}
            flex={isFullWidth ? 1 : null}
          >
            {opt.label}
          </Button>
        );

        if (opt.tooltip) {
          return (
            <Tooltip key={opt.value} label={opt.tooltip}>
              {button}
            </Tooltip>
          );
        }

        return button;
      })}
    </ButtonGroup>
  );
}
