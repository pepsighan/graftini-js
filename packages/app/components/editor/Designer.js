import { Flex } from '@chakra-ui/layout';
import { cleanupComponentMap, Editor, useEditor } from 'graft';
import components from 'canvasComponents';
import Canvas from 'components/editor/Canvas';
import EditorNavigation from 'components/editor/DesignerNavigation';
import LeftSidebar from 'components/editor/LeftSidebar';
import RightSidebar from 'components/editor/RightSidebar';
import { debounce } from 'lodash-es';
import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useDesignerState, useDesignerStateApi } from 'store/designer';
import { useUpdateProjectDesign } from 'store/projects';
import { initializeUserApollo, UserApolloProvider } from 'utils/graphqlUser';

export const ProjectIdContext = createContext();

/**
 * Gets the project id that is currently opened in the editor. This is only
 * to be used within an editor.
 */
export function useProjectId() {
  return useContext(ProjectIdContext);
}

export default function Designer({ projectId }) {
  const currentPageId = useDesignerState(useCallback((state) => state.currentOpenPage, []));
  const userApollo = useMemo(() => initializeUserApollo(), []);

  // TODO: Make sure that this is run even before the browser is closed abruptly.
  useSyncDesignerStateToBackend({ projectId });

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

/**
 * This renderless component syncs the internal state of editor and the designer in that direction.
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

/**
 * Hook that syncs the designer state to the backend. This hook is retained
 * until the project designer page is open. Changing pages does not affect this as
 * all the designs of all the pages are synced every time.
 */
function useSyncDesignerStateToBackend({ projectId }) {
  const { subscribe } = useDesignerStateApi();
  const [updateDesign] = useUpdateProjectDesign();

  useEffect(() => {
    // Update every two seconds.
    const debouncedUpdate = debounce(async (pages) => {
      await updateDesign({
        variables: {
          input: {
            projectId,
            pages: Object.keys(pages).map((pageId) => ({
              pageId,
              componentMap: pages[pageId]
                ? // Cleanup any deleted component nodes before saving them to
                  // backend.
                  JSON.stringify(cleanupComponentMap({ ...pages[pageId] }))
                : null,
            })),
          },
        },
      });
    }, 2000);

    return subscribe(debouncedUpdate, (state) => state.pages);
  }, [projectId, subscribe, updateDesign]);
}
