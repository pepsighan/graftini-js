import { Checkbox } from '@chakra-ui/checkbox';
import { useFormContext } from 'react-hook-form';

export default function CheckboxField({ name, label }) {
  const { register } = useFormContext();
  return (
    <Checkbox {...register(name)} display="block">
      {label}
    </Checkbox>
  );
}
