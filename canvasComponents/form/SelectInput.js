import { Select } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

export default function SelectInput({ name, children }) {
  const { register } = useFormContext();
  return (
    <Select {...register(name)} size="sm" bg="white" autoComplete="off">
      {children}
    </Select>
  );
}
