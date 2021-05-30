import { Input } from '@chakra-ui/input';
import { Flex } from '@chakra-ui/layout';
import { Select } from '@chakra-ui/select';
import { useFormContext } from 'react-hook-form';

const units = ['px', '%'];

export default function SizeInput({ name }) {
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
        {units.map((it) => (
          <option key={it} value={it}>
            {it}
          </option>
        ))}
      </Select>
    </Flex>
  );
}
