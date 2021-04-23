import { FormProvider, useForm } from 'react-hook-form';

export default function CanvasForm({ children }) {
  const form = useForm();
  return <FormProvider {...form}>{children}</FormProvider>;
}
