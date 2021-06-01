import { Input } from '@chakra-ui/input';
import { Flex } from '@chakra-ui/layout';
import { Select } from '@chakra-ui/select';
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
        flex={1}
      />
      <Select {...register(`${name}.unit`)} size="sm" bg="white" autoComplete="off" flex={1}>
        <option value="px">px</option>
        <option value="rem">rem</option>
      </Select>
    </Flex>
  );
}
