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
      {options.map(({ value: valueOpt, label, tooltip, ...rest }) => {
        const button = (
          <Button
            key={valueOpt}
            bg={valueOpt === value ? 'white' : 'gray.200'}
            color={valueOpt === value ? 'black' : 'gray.600'}
            onClick={() => onChange(valueOpt)}
            flex={isFullWidth ? 1 : null}
            {...rest}
          >
            {label}
          </Button>
        );

        if (tooltip) {
          return (
            <Tooltip key={valueOpt} label={tooltip}>
              {button}
            </Tooltip>
          );
        }

        return button;
      })}
    </ButtonGroup>
  );
}
