import { Flex } from '@chakra-ui/layout';
import { Editor } from '@craftjs/core';
import components from 'canvasComponents';
import Canvas from 'components/Canvas';
import LeftSidebar from 'components/LeftSidebar';
import Navigation from 'components/Navigation';
import RightSidebar from 'components/RightSidebar';

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
