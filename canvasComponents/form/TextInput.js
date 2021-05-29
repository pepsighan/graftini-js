import { Input } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

export default function TextInput({ name }) {
  const { register } = useFormContext();
  return <Input {...register(name)} size="sm" bg="white" autoComplete="off" />;
}
