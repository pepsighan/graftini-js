import { Editor } from '@graftini/graft';
import { Box, GlobalStyles, useTheme } from '@material-ui/core';
import components from 'canvasComponents';
import { ProseEditorProvider } from 'canvasComponents/proseEditor/ProseEditorContext';
import Root from 'canvasComponents/Root';
import Canvas from 'components/editor/Canvas';
import EditorNavigation from 'components/editor/DesignerNavigation';
import LeftSidebar from 'components/editor/LeftSidebar';
import RightSidebar from 'components/editor/RightSidebar';
import useSyncDesignerStateToBackend from 'hooks/useSyncDesignerStateToBackend';
import { useCallback, useMemo } from 'react';
import { useDesignerState } from 'store/designer';
import { navBarHeight } from 'utils/constants';
import { initializeUserApollo, UserApolloProvider } from 'utils/graphqlUser';
import { ContextMenuProvider } from './ContextMenu';
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

  const { palette } = useTheme();

  return (
    <Box onContextMenu={useDisableContextMenu()}>
      <ContextMenuProvider>
        <Editor resolvers={components} initialState={editorState} rootComponentOverride={Root}>
          <ProseEditorProvider>
            <SyncEditorAndDesignerState />

            <GlobalStyles styles={` body { background-color: ${palette.grey[50]}; } `} />

            <EditorNavigation />
            {/* The height of the nav is subtracted, so that any of the following does not cause window-wide scroll. 
                Any scroll they have should be within their boundaries.
            */}
            <Box sx={{ display: 'flex', height: `calc(100vh - ${navBarHeight}px)` }}>
              <LeftSidebar />
              <Canvas />
              <RightSidebar />
            </Box>
          </ProseEditorProvider>
        </Editor>
      </ContextMenuProvider>
    </Box>
  );
}

/**
 * We only need context menu to be shown when explicitly required by the UI.
 * We need to disable the rest of the default context menu in the page so that
 * the user gets a consistent UX.
 */
function useDisableContextMenu() {
  return useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);
}
