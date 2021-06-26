import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

export default function OpacityInput({ name }) {
  const { register, setValue, getValues } = useFormContext();

  // Creating the form with register and manual onChange is the right balance
  // to implement a restricting 0 <= opacity <= 1 input.
  const { onChange, onBlur, ...rest } = register(name);

  const onInputChange = useCallback(
    (event) => {
      const num = event.target.value !== '' ? parseFloat(event.target.value) : 0;
      if (num <= 0) {
        setValue(name, 0, { shouldDirty: true, shouldValidate: true });
      } else if (num >= 1) {
        setValue(name, 1, { shouldDirty: true, shouldValidate: true });
      } else if (isNaN(num)) {
        // If invalid number provided, use the older one.
        setValue(name, getValues()[name]);
      } else {
        setValue(name, parseFloat(num.toFixed(2)), { shouldDirty: true, shouldValidate: true });
      }
    },
    [getValues, name, setValue]
  );

  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        fontSize="sm"
        height="100%"
        width={16}
        justifyContent="flex-end"
        pr={1}
        color="gray.600"
      >
        Opacity
      </InputLeftElement>
      <Input
        {...rest}
        onChange={onInputChange}
        type="number"
        size="sm"
        bg="white"
        autoComplete="off"
        textAlign="right"
        pb="1px" // Align the input text with the label.
        pr={4} // So that the cursor is visible on the right.
        sx={{
          paddingInlineStart: 14,
        }}
      />
    </InputGroup>
  );
}
