import { Flex } from '@chakra-ui/layout';
import { Editor } from '@craftjs/core';
import components from 'canvasComponents';
import Canvas from 'components/editor/Canvas';
import EditorNavigation from 'components/editor/EditorNavigation';
import LeftSidebar from 'components/editor/LeftSidebar';
import RightSidebar from 'components/editor/RightSidebar';
import { useCallback } from 'react';
import { useEditorState } from 'store/editor';
import { useImmerSetter } from 'store/zustand';
import { protectedPage } from 'utils/auth';

export default protectedPage(function Dashboard() {
  const updateEditorState = useImmerSetter(useEditorState);

  return (
    <Editor
      resolver={components}
      onNodesChange={useCallback(
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
      )}
    >
      <EditorNavigation />
      <Flex>
        <LeftSidebar />
        <Canvas />
        <RightSidebar />
      </Flex>
    </Editor>
  );
});
