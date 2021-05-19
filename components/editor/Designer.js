import { Flex } from '@chakra-ui/layout';
import { Editor, useEditor } from '@graftini/graft';
import components from 'canvasComponents';
import Canvas from 'components/editor/Canvas';
import EditorNavigation from 'components/editor/DesignerNavigation';
import LeftSidebar from 'components/editor/LeftSidebar';
import RightSidebar from 'components/editor/RightSidebar';
import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useDesignerState, useDesignerStateApi } from 'store/designer';
import config from 'utils/config';
import { initializeUserApollo, UserApolloProvider } from 'utils/graphqlUser';

export const ProjectIdContext = createContext();

/**
 * Gets the project id that is currently opened in the editor. This is only
 * to be used within an editor.
 */
export function useProjectId() {
  return useContext(ProjectIdContext);
}

// TODO: Make sure that the sync of the editor state that is done every 5 seconds are not dropped between
// route changes. Also, they should be done before the browser tab is closed. And also when there is
// failure, retries should be done.
export default function Designer({ projectId }) {
  const currentPageId = useDesignerState(useCallback((state) => state.currentOpenPage, []));
  const userApollo = useMemo(() => initializeUserApollo(), []);

  return (
    <ProjectIdContext.Provider value={projectId}>
      <UserApolloProvider client={userApollo}>
        <Editorial key={currentPageId} />
      </UserApolloProvider>
    </ProjectIdContext.Provider>
  );
}

function Editorial() {
  const editorState = useDesignerState(
    useCallback((state) => state.pages[state.currentOpenPage], []),
    // Only get the editor state once on load. No need after that.
    useCallback(() => true, [])
  );

  return (
    <Editor resolvers={components} initialState={editorState}>
      {config.ENV === 'local' && <TrackChanges />}
      <SyncEditorAndDesignerState />
      <EditorNavigation />
      <Flex>
        <LeftSidebar />
        <Canvas />
        <RightSidebar />
      </Flex>
    </Editor>
  );
}

// Add this component within the editor to track the changes of the state.
// This is only to be use when debugging.
// eslint-disable-next-line no-unused-vars
function TrackChanges() {
  const { subscribe } = useEditor();

  useEffect(() => subscribe((state) => console.log(state)));

  return <></>;
}

/**
 * This component is renderless and just syncs the internal state of editor and the designer in
 * that direction.
 */
function SyncEditorAndDesignerState() {
  const { subscribe } = useEditor();
  const { setState } = useDesignerStateApi();

  useEffect(() => {
    return subscribe((editorState) => {
      setState((designerState) => ({
        ...designerState,
        pages: {
          ...designerState.pages,
          [designerState.currentOpenPage]: editorState,
        },
      }));
    });
  }, [setState, subscribe]);

  return <></>;
}
