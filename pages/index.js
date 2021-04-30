import { Flex } from '@chakra-ui/layout';
import { Editor } from '@craftjs/core';
import components from 'canvasComponents';
import Canvas from 'components/editor/Canvas';
import LeftSidebar from 'components/editor/LeftSidebar';
import Navigation from 'components/editor/Navigation';
import RightSidebar from 'components/editor/RightSidebar';

export default function Home() {
  return (
    <Editor resolver={components}>
      <Navigation />
      <Flex>
        <LeftSidebar />
        <Canvas />
        <RightSidebar />
      </Flex>
    </Editor>
  );
}
