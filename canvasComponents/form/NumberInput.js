import { Input } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

export default function NumberInput({ name }) {
  const { register } = useFormContext();
  return <Input {...register(name)} type="number" size="sm" bg="white" />;
}
