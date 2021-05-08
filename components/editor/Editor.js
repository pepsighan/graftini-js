import { Flex } from '@chakra-ui/layout';
import { Editor as Edt } from '@craftjs/core';
import components from 'canvasComponents';
import Canvas from 'components/editor/Canvas';
import EditorNavigation from 'components/editor/EditorNavigation';
import LeftSidebar from 'components/editor/LeftSidebar';
import RightSidebar from 'components/editor/RightSidebar';
import { debounce } from 'lodash-es';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { transformMarkup, useEditorState } from 'store/editor';
import { useUpdatePageMarkup } from 'store/projects';
import { useImmerSetter } from 'store/zustand';
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
  const updateEditorState = useImmerSetter(useEditorState);
  const [updatePageMarkup] = useUpdatePageMarkup();

  const currentPageId = useEditorState(useCallback((state) => state.currentOpenPage, []));

  // Only update the page markup at max once every 5 seconds.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updatePageMarkupDebounced = useMemo(() => debounce(updatePageMarkup, 5000), [
    updatePageMarkup,
    // So that when the page changes, the debouncer also changes. This will let the older
    // mutation to run even when new ones from a different page are fired up.
    currentPageId,
  ]);

  const onNodesChange = useCallback(
    (query) => {
      const serialized = query.getSerializedNodes();

      // When the editor is first rendered, it returns an empty serialized object.
      // We want to ignore it. The default nodes are going to be rendered which
      // at least has a `ROOT` node.
      const hasSome = Object.keys(serialized).length !== 0;

      if (hasSome) {
        // This is for the local switches of the page.
        updateEditorState((state) => {
          state.markup = serialized;
        });

        updatePageMarkupDebounced({
          variables: {
            input: {
              projectId,
              pageId: currentPageId,
              markup: transformMarkup(serialized),
            },
          },
        });
      }
    },
    [currentPageId, projectId, updateEditorState, updatePageMarkupDebounced]
  );

  const userApollo = useMemo(() => initializeUserApollo(), []);

  return (
    <ProjectIdContext.Provider value={projectId}>
      <UserApolloProvider client={userApollo}>
        <Edt resolver={components} onNodesChange={onNodesChange}>
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
