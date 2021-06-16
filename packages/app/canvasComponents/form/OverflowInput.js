import { Box, Button, Flex, Text, Tooltip } from '@chakra-ui/react';
import { AllSidesIcon, EyeClosedIcon, EyeOpenIcon, MagicWandIcon } from '@modulz/radix-icons';
import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

const options = [
  { value: 'visible', icon: <EyeOpenIcon width={20} height={20} />, tooltip: 'Show' },
  { value: 'hidden', icon: <EyeClosedIcon width={20} height={20} />, tooltip: 'Hide' },
  {
    value: 'scroll',
    icon: <AllSidesIcon width={20} height={20} />,
    tooltip: 'Scroll',
  },
  { value: 'auto', icon: <MagicWandIcon width={20} height={20} />, tooltip: 'Auto' },
];

export default function OverflowInput({ name }) {
  const { control, setValue } = useFormContext();
  const overflow = useWatch({ control, name: `${name}.x` });

  return (
    <Flex alignItems="baseline">
      <Options
        options={options}
        value={overflow}
        onChange={useCallback(
          (value) => {
            // Update two parallel values. They are not configurable separately as of now.
            setValue(`${name}.x`, value, { shouldDirty: true, shouldValidate: true });
            setValue(`${name}.y`, value, { shouldDirty: true, shouldValidate: true });
          },
          [name, setValue]
        )}
      />
    </Flex>
  );
}

function Options({ options, value, onChange }) {
  return (
    <>
      {options.map(({ value: valueOpt, icon, tooltip, ...rest }) => {
        return (
          <Tooltip key={valueOpt} label={tooltip}>
            <Button
              key={valueOpt}
              color={valueOpt === value ? 'primary.600' : 'gray.600'}
              onClick={() => onChange(valueOpt)}
              height="auto"
              flex={1}
              flexDirection="column"
              {...rest}
            >
              <Box>{icon}</Box>
              <Text as="span" fontSize="sm" mt={2}>
                {tooltip}
              </Text>
            </Button>
          </Tooltip>
        );
      })}
    </>
  );
}
