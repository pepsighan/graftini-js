import { Box, Flex, Input, Text } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

export default function SpacingField({ name, label, spaceTop }) {
  const { register } = useFormContext();

  return (
    <Flex mt={spaceTop ? 2 : 0} alignItems="center">
      <Text fontSize="sm" mr={2}>
        {label}
      </Text>
      <Box flex={1}>
        <Flex>
          <Input size="sm" bg="white" {...register(`${name}.top`)} />
          <Input size="sm" bg="white" {...register(`${name}.right`)} />
        </Flex>
        <Flex mt={1}>
          <Input size="sm" bg="white" {...register(`${name}.left`)} />
          <Input size="sm" bg="white" {...register(`${name}.bottom`)} />
        </Flex>
      </Box>
    </Flex>
  );
}
