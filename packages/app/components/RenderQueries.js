import { gql, useQuery } from '@apollo/client';
import { print } from 'graphql';
import { createContext, useCallback, useMemo } from 'react';
import { useDesignerState } from 'store/designer';
import { generateGraphQLAST } from 'utils/graphqlAst';
import { useUserApolloClient } from 'utils/graphqlUser';

export const QueryContext = createContext();

export default function RenderQueries({ children }) {
  const savedQueries = useDesignerState(useCallback((state) => state.savedQueries, []));

  const allQuery = useMemo(
    () =>
      savedQueries.reduce(
        (acc, cur) => {
          return (queryResults) => (
            <SingleQuery
              variableName={cur.variableName}
              query={cur.query}
              queryResults={queryResults}
            >
              {acc}
            </SingleQuery>
          );
        },
        (queryResults) => (
          <QueryContext.Provider value={queryResults}>{children}</QueryContext.Provider>
        )
      ),
    [children, savedQueries]
  );

  return allQuery({});
}

function SingleQuery({ variableName, query, queryResults, children }) {
  const gqlQuery = useMemo(
    () => print(generateGraphQLAST(variableName, query)),
    [query, variableName]
  );

  const userApollo = useUserApolloClient();
  const { data } = useQuery(gql(gqlQuery), { client: userApollo });
  return children({ [variableName]: data, ...queryResults });
}
