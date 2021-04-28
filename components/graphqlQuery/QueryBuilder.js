import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useClientGraphQLSchema } from 'store/graphqlIntrospection';
import QueryTree from './QueryTree';

export default function QueryBuilder() {
  const { schema } = useClientGraphQLSchema();
  const form = useForm();
  const schemaFields = useMemo(() => (schema ? schema.getQueryType().getFields() : null), [schema]);

  if (!schema) {
    return 'Loading...';
  }

  return (
    <FormProvider {...form}>
      <QueryTree fields={schemaFields} />
    </FormProvider>
  );
}
