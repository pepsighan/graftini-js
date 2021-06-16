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
        justifyContent="flex-end"
        pr={1}
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
        sx={{
          paddingInlineStart: 14,
        }}
      />
    </InputGroup>
  );
}
