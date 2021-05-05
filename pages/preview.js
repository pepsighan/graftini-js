import { ApolloProvider } from '@apollo/client';
import PreviewNavigation from 'components/preview/PreviewNavigation';
import Render from 'components/Render';
import RenderQueries from 'components/RenderQueries';
import { useCallback, useMemo } from 'react';
import { useEditorState } from 'store/editor';
import { initializeUserApollo } from 'utils/graphqlUser';

export default function Preview() {
  const markup = useEditorState(useCallback((state) => state.markup, []));
  const userApolloClient = useMemo(() => initializeUserApollo(), []);

  return (
    <>
      <PreviewNavigation />
      <ApolloProvider client={userApolloClient}>
        <RenderQueries>
          <Render markup={markup} />
        </RenderQueries>
      </ApolloProvider>
    </>
  );
}
