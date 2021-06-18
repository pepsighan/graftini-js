import { Box, Button, ButtonGroup } from '@chakra-ui/react';
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
    <ButtonGroup isAttached display="flex" justifyContent="center">
      <Controller
        name="flexDirection"
        control={control}
        render={({ field }) => (
          <Options options={options} value={field.value} onChange={field.onChange} />
        )}
      />
    </ButtonGroup>
  );
}

function Options({ options, value, onChange }) {
  return (
    <>
      {options.map(({ value: valueOpt, icon, label, ...rest }) => {
        return (
          <Button
            key={valueOpt}
            color={valueOpt === value ? 'primary.600' : 'gray.600'}
            onClick={() => onChange(valueOpt)}
            flexDirection="column"
            justifyContent="center"
            height="auto"
            width={24}
            py={2}
            {...rest}
          >
            <Box>{icon}</Box>
            <Box mt={1} fontSize="sm">
              {label}
            </Box>
          </Button>
        );
      })}
    </>
  );
}
