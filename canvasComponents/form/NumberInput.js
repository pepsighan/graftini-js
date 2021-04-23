import { Flex, Input, Text } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

export default function NumberInput({ name, label, spaceTop }) {
  const { register } = useFormContext();

  return (
    <Flex alignItems="center" mt={spaceTop ? 2 : 0}>
      <Text fontSize="xs" mr={2}>
        {label}
      </Text>
      <Input {...register(name)} type="number" size="sm" bg="white" />
    </Flex>
  );
}
