import { Flex } from '@chakra-ui/layout';
import { Editor as Edt, useEditor } from '@graftini/graft';
import components from 'canvasComponents';
import Canvas from 'components/editor/Canvas';
import EditorNavigation from 'components/editor/EditorNavigation';
import LeftSidebar from 'components/editor/LeftSidebar';
import RightSidebar from 'components/editor/RightSidebar';
import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useEditorState } from 'store/editor';
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
export default function Editor({ projectId }) {
  const currentPageId = useEditorState(useCallback((state) => state.currentOpenPage, []));
  const userApollo = useMemo(() => initializeUserApollo(), []);

  return (
    <ProjectIdContext.Provider value={projectId}>
      <UserApolloProvider client={userApollo}>
        <Edt resolvers={components}>
          {config.ENV === 'local' && <TrackChanges />}
          <EditorNavigation />
          <Flex>
            <LeftSidebar projectId={projectId} />
            <Canvas key={currentPageId} />
            <RightSidebar />
          </Flex>
        </Edt>
      </UserApolloProvider>
    </ProjectIdContext.Provider>
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
