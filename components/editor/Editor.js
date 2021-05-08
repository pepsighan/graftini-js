import { Flex } from '@chakra-ui/layout';
import { Editor as Edt } from '@craftjs/core';
import components from 'canvasComponents';
import Canvas from 'components/editor/Canvas';
import EditorNavigation from 'components/editor/EditorNavigation';
import LeftSidebar from 'components/editor/LeftSidebar';
import RightSidebar from 'components/editor/RightSidebar';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { useEditorState } from 'store/editor';
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

export default function Editor({ projectId }) {
  const updateEditorState = useImmerSetter(useEditorState);
  const onNodesChange = useCallback(
    (query) => {
      const serialized = query.getSerializedNodes();

      // When the editor is first rendered, it returns an empty serialized object.
      // We want to ignore it. The default nodes are going to be rendered which
      // at least has a `ROOT` node.
      const hasSome = Object.keys(serialized).length !== 0;

      if (hasSome) {
        updateEditorState((state) => {
          state.markup = serialized;
        });
      }
    },
    [updateEditorState]
  );

  const userApollo = useMemo(() => initializeUserApollo(), []);

  return (
    <ProjectIdContext.Provider value={projectId}>
      <UserApolloProvider client={userApollo}>
        <Edt resolver={components} onNodesChange={onNodesChange}>
          <EditorNavigation />
          <Flex>
            <LeftSidebar projectId={projectId} />
            <Canvas />
            <RightSidebar />
          </Flex>
        </Edt>
      </UserApolloProvider>
    </ProjectIdContext.Provider>
  );
}
