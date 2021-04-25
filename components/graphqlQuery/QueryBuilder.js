import { useClientGraphQLSchema } from 'store/graphqlIntrospection';

export default function QueryBuilder() {
  const { schema } = useClientGraphQLSchema();

  if (!schema) {
    return 'Loading...';
  }

  return 'Loaded';
}
