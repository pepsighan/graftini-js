import { Flex, FormLabel, Input } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

export default function TextInput({ name, label }) {
  const { register } = useFormContext();

  return (
    <Flex>
      <FormLabel>{label}</FormLabel>
      <Input {...register(name)} />
    </Flex>
  );
}
