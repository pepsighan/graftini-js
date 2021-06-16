import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

const units = ['px', '%'];

export default function SizeLimitInput({ name, isWidth, isMin, label }) {
  const { register } = useFormContext();

  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        fontSize="sm"
        height="100%"
        width={16}
        color="gray.600"
        justifyContent="flex-end"
        pr={2}
      >
        {label}
      </InputLeftElement>

      <Input
        {...register(`${name}.size`)}
        type="number"
        size="sm"
        bg="white"
        autoComplete="off"
        flex={1}
        placeholder="Auto"
        sx={{ paddingInlineStart: 16 }}
      />
    </InputGroup>
  );
}
