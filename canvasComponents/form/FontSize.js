import { Input } from '@chakra-ui/input';
import { Flex } from '@chakra-ui/layout';
import { useFormContext } from 'react-hook-form';

export default function FontSize({ name }) {
  const { register } = useFormContext();
  return (
    <Flex>
      <Input
        {...register(`${name}.size`)}
        type="number"
        size="sm"
        bg="white"
        autoComplete="off"
        flex={3}
      />
      <Input {...register(`${name}.unit`)} size="sm" bg="white" autoComplete="off" flex={1} />
    </Flex>
  );
}
