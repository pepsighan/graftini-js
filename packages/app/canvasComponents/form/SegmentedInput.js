import { Button, ButtonGroup } from '@chakra-ui/button';
import { Tooltip } from '@chakra-ui/tooltip';
import { Controller, useFormContext } from 'react-hook-form';

export default function SegmentedInput({ name, options }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <SegmentedInputInner options={options} value={field.value} onChange={field.onChange} />
      )}
    />
  );
}

function SegmentedInputInner({ options, value, onChange }) {
  return (
    <ButtonGroup size="sm" isAttached variant="outline">
      {options.map((opt) => {
        const button = (
          <Button
            key={opt.value}
            bg={value === opt.value ? 'white' : 'gray.200'}
            color={value === opt.value ? 'black' : 'gray.600'}
            onClick={() => onChange(opt.value)}
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
