import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

export default function TextInputWithLabel({ name, label }) {
  const { register } = useFormContext();

  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        fontSize="sm"
        height="100%"
        width={14}
        color="gray.600"
        justifyContent="flex-end"
        pr={2}
      >
        {label}
      </InputLeftElement>
      <Input
        {...register(name)}
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
