import { Flex } from '@chakra-ui/layout';
import { Editor } from '@craftjs/core';
import components from 'canvasComponents';
import Canvas from 'components/editor/Canvas';
import EditorNavigation from 'components/editor/EditorNavigation';
import LeftSidebar from 'components/editor/LeftSidebar';
import RightSidebar from 'components/editor/RightSidebar';
import SEO from 'components/SEO';
import { useRouter } from 'next/router';
import NotFound from 'pages/404';
import { useCallback, useMemo } from 'react';
import { useEditorState } from 'store/editor';
import { useMyProject } from 'store/projects';
import { useImmerSetter } from 'store/zustand';
import { protectedPage } from 'utils/auth';
import { decodeSlug } from 'utils/url';

export default protectedPage(function Project() {
  const { query } = useRouter();
  const projectId = useMemo(() => decodeSlug(query.projectId), [query.projectId]);

  const { project, loading } = useMyProject({ projectId });

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

  if (loading) {
    // TODO: Show some skeleton loading of the editor here.
    return null;
  }

  if (!project) {
    return <NotFound />;
  }

  return (
    <>
      <SEO title="Project" />
      <Editor resolver={components} onNodesChange={onNodesChange}>
        <EditorNavigation />
        <Flex>
          <LeftSidebar />
          <Canvas />
          <RightSidebar />
        </Flex>
      </Editor>
    </>
  );
});
