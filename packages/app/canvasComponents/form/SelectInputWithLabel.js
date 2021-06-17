import { InputGroup, InputLeftElement, Select } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

export default function SelectInputWithLabel({ name, children, label, labelWidth = '14' }) {
  const { register } = useFormContext();

  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        fontSize="sm"
        height="100%"
        width={labelWidth}
        justifyContent="flex-end"
        pr={2}
        color="gray.600"
      >
        {label}
      </InputLeftElement>
      <Select
        {...register(name)}
        size="sm"
        bg="white"
        autoComplete="off"
        pb="1px" // Align the input text with the label.
        sx={{
          paddingInlineStart: labelWidth,
        }}
      >
        {children}
      </Select>
    </InputGroup>
  );
}
