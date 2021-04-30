import { gql, useQuery } from '@apollo/client';
import { print } from 'graphql';
import { createContext, useCallback, useMemo } from 'react';
import { useEditorState } from 'store/editor';
import { generateGraphQLAST } from 'utils/graphqlAst';

export const QueryContext = createContext();

export default function RenderQueries({ children }) {
  const savedQueries = useEditorState(useCallback((state) => state.savedQueries, []));

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
  const gqlQuery = useMemo(() => print(generateGraphQLAST(variableName, query)), [
    query,
    variableName,
  ]);

  const result = useQuery(gql(gqlQuery));

  return children({ [variableName]: result, ...queryResults });
}
