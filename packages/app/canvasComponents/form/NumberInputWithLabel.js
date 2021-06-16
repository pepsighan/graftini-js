import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

export default function NumberInputWithLabel({ name, label }) {
  const { register } = useFormContext();

  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        fontSize="sm"
        height="100%"
        width={14}
        textAlign="left"
        color="gray.600"
      >
        {label}
      </InputLeftElement>
      <Input
        {...register(name)}
        type="number"
        size="sm"
        bg="white"
        autoComplete="off"
        display="flex"
        sx={{
          paddingInlineStart: 14,
        }}
      />
    </InputGroup>
  );
}
