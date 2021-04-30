import { Flex } from '@chakra-ui/layout';
import { Editor } from '@craftjs/core';
import components from 'canvasComponents';
import Canvas from 'components/editor/Canvas';
import EditorNavigation from 'components/editor/EditorNavigation';
import LeftSidebar from 'components/editor/LeftSidebar';
import RightSidebar from 'components/editor/RightSidebar';

export default function Home() {
  return (
    <Editor resolver={components}>
      <EditorNavigation />
      <Flex>
        <LeftSidebar />
        <Canvas />
        <RightSidebar />
      </Flex>
    </Editor>
  );
}
