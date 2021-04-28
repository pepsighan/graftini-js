import { Box, Flex } from '@chakra-ui/layout';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useClientGraphQLSchema } from 'store/graphqlIntrospection';
import QueryText from './QueryText';
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
      <Flex>
        <Box flex={1} pr={1}>
          <QueryTree fields={schemaFields} />
        </Box>
        <Box flex={1} pl={1}>
          <QueryText />
        </Box>
      </Flex>
    </FormProvider>
  );
}
