import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

export default function OpacityInput({ name }) {
  const { register } = useFormContext();

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
        {...register(name)}
        type="number"
        size="sm"
        bg="white"
        autoComplete="off"
        textAlign="right"
        pb="1px" // Align the input text with the label.
        sx={{
          paddingInlineStart: 14,
        }}
      />
    </InputGroup>
  );
}
