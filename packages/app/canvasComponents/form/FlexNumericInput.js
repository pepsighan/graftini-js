import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { parsePositiveInteger } from 'utils/parser';

export default function FlexNumericInput({ name, label }) {
  const { control, setValue } = useFormContext();
  const value = useWatch({ control, name });

  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        fontSize="sm"
        height="100%"
        width={14}
        justifyContent="flex-end"
        pr={1}
        color="gray.600"
      >
        {label}
      </InputLeftElement>
      <Input
        onChange={useCallback(
          (event) => {
            setValue(name, parsePositiveInteger(event.target.value) || 0);
          },
          [name, setValue]
        )}
        value={value}
        size="sm"
        bg="white"
        autoComplete="off"
        pb="1px" // Align the input text with the label.
        sx={{
          paddingInlineStart: 14,
        }}
      />
    </InputGroup>
  );
}
