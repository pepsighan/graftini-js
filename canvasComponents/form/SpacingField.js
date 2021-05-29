import { Box, Flex, Input } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

export default function SpacingField({ name }) {
  const { register } = useFormContext();
  return (
    <Box>
      <Flex>
        <Input size="sm" bg="white" {...register(`${name}.top`)} autoComplete="off" />
        <Input size="sm" bg="white" {...register(`${name}.right`)} autoComplete="off" />
      </Flex>
      <Flex mt={1}>
        <Input size="sm" bg="white" {...register(`${name}.left`)} autoComplete="off" />
        <Input size="sm" bg="white" {...register(`${name}.bottom`)} autoComplete="off" />
      </Flex>
    </Box>
  );
}
