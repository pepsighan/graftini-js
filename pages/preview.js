import PreviewNavigation from 'components/preview/PreviewNavigation';
import Render from 'components/Render';
import RenderQueries from 'components/RenderQueries';
import SEO from 'components/SEO';
import { useCallback, useMemo } from 'react';
import { useEditorState } from 'store/editor';
import { protectedPage } from 'utils/auth';
import { initializeUserApollo, UserApolloProvider } from 'utils/graphqlUser';

export default protectedPage(function Preview() {
  const markup = useEditorState(useCallback((state) => state.markup, []));
  const userApolloClient = useMemo(() => initializeUserApollo(), []);

  return (
    <>
      <SEO title="Preview" />
      <PreviewNavigation />
      <UserApolloProvider client={userApolloClient}>
        <RenderQueries>
          <Render markup={markup} />
        </RenderQueries>
      </UserApolloProvider>
    </>
  );
});
