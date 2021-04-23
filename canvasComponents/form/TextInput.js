import { Flex, Input, Text } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

export default function TextInput({ name, label }) {
  const { register } = useFormContext();

  return (
    <Flex alignItems="center">
      <Text fontSize="xs" mr={2}>
        {label}
      </Text>
      <Input {...register(name)} size="sm" bg="white" />
    </Flex>
  );
}
