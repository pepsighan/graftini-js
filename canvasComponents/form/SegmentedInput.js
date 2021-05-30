import { Button, ButtonGroup } from '@chakra-ui/button';
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
      {options.map((opt) => (
        <Button
          key={opt.value}
          bg={value === opt.value ? 'white' : 'gray.200'}
          color={value === opt.value ? 'black' : 'gray.600'}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </ButtonGroup>
  );
}
