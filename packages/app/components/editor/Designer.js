import { Box } from '@material-ui/core';
import { Editor } from '@graftini/graft';
import components from 'canvasComponents';
import Root from 'canvasComponents/Root';
import Canvas from 'components/editor/Canvas';
import EditorNavigation from 'components/editor/DesignerNavigation';
import LeftSidebar from 'components/editor/LeftSidebar';
import RightSidebar from 'components/editor/RightSidebar';
import useSyncDesignerStateToBackend from 'hooks/useSyncDesignerStateToBackend';
import { useCallback, useMemo } from 'react';
import { useDesignerState } from 'store/designer';
import { initializeUserApollo, UserApolloProvider } from 'utils/graphqlUser';
import SyncEditorAndDesignerState from './SyncEditorAndDesignerState';

export default function Designer({ projectId }) {
  const currentPageId = useDesignerState(useCallback((state) => state.currentOpenPage, []));
  const userApollo = useMemo(() => initializeUserApollo(), []);

  // TODO: Make sure that this is run even before the browser is closed abruptly.
  useSyncDesignerStateToBackend({ projectId });

  return (
    <UserApolloProvider client={userApollo}>
      <Editorial key={currentPageId} />
    </UserApolloProvider>
  );
}

function Editorial() {
  const editorState = useDesignerState(
    useCallback((state) => state.pages[state.currentOpenPage], []),
    // Only get the editor state once on load. No need after that.
    useCallback(() => true, [])
  );

  return (
    <Editor resolvers={components} initialState={editorState} rootComponentOverride={Root}>
      <SyncEditorAndDesignerState />
      <EditorNavigation />
      {/* The height of the nav is substracted, so that any of the following does not cause window-wide scroll. 
          Any scroll they have should be within their boundaries.*/}
      <Box sx={{ display: 'flex', height: 'calc(100vh - 54px)' }}>
        <LeftSidebar />
        <Canvas />
        <RightSidebar />
      </Box>
    </Editor>
  );
}
