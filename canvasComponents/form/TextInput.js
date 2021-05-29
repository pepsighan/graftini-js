import { Flex, Input, Text } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

export default function TextInput({ name, label, spaceTop }) {
  const { register } = useFormContext();

  return (
    <Flex alignItems="center" mt={spaceTop ? 2 : null}>
      <Text fontSize="sm" mr={2}>
        {label}
      </Text>
      <Input {...register(name)} size="sm" bg="white" />
    </Flex>
  );
}
