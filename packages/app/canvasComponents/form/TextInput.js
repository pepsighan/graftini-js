import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

export default function TextInput({ name, label, labelWidth = '14' }) {
  const { register } = useFormContext();

  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        fontSize="sm"
        height="100%"
        width={labelWidth}
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
          paddingInlineStart: labelWidth,
        }}
      />
    </InputGroup>
  );
}
