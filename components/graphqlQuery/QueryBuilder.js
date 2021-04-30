import { Box, Flex } from '@chakra-ui/layout';
import { useMemo } from 'react';
import { useClientGraphQLSchema } from 'store/graphqlIntrospection';
import FieldName from './FieldName';
import QueryText from './QueryText';
import QueryTree from './QueryTree';

export default function QueryBuilder() {
  const { schema } = useClientGraphQLSchema();
  const schemaFields = useMemo(() => (schema ? schema.getQueryType().getFields() : null), [schema]);

  if (!schema) {
    return 'Loading...';
  }

  return (
    <Flex>
      <Box flex={1} pr={1}>
        <QueryTree fields={schemaFields} />
      </Box>
      <Box flex={1} pl={1}>
        <FieldName />
        <Box mt={4}>
          <QueryText />
        </Box>
      </Box>
    </Flex>
  );
}
