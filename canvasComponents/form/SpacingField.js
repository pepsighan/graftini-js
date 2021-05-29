import { Box, Flex, Input } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

export default function SpacingField({ name }) {
  const { register } = useFormContext();
  return (
    <Box>
      <Flex>
        <Input size="sm" bg="white" {...register(`${name}.top`)} />
        <Input size="sm" bg="white" {...register(`${name}.right`)} />
      </Flex>
      <Flex mt={1}>
        <Input size="sm" bg="white" {...register(`${name}.left`)} />
        <Input size="sm" bg="white" {...register(`${name}.bottom`)} />
      </Flex>
    </Box>
  );
}
