import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { useFormContext } from 'react-hook-form';

export default function FieldName() {
  const { register } = useFormContext();

  return (
    <FormControl>
      <FormLabel>Variable Name</FormLabel>
      <Input {...register('variableName')} />
    </FormControl>
  );
}
