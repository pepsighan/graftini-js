import { gql, useQuery } from '@apollo/client';
import { buildClientSchema, getIntrospectionQuery, IntrospectionQuery } from 'graphql/utilities';
import { useMemo } from 'react';

/**
 * Gets graphql schema of the endpoint that is provided by the user.
 */
export function useClientGraphQLSchema() {
  const query = getIntrospectionQuery();
  const { data, ...rest } = useQuery<IntrospectionQuery>(gql(query));
  const schema = useMemo(() => (data ? buildClientSchema(data) : null), [data]);
  return { schema, ...rest };
}
