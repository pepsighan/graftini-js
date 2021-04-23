import { Flex } from '@chakra-ui/layout';
import { Editor } from '@craftjs/core';
import Button from 'canvasComponents/Button';
import Container from 'canvasComponents/Container';
import Root from 'canvasComponents/Root';
import Text from 'canvasComponents/Text';
import Canvas from 'components/Canvas';
import LeftSidebar from 'components/LeftSidebar';
import Navigation from 'components/Navigation';
import RightSidebar from 'components/RightSidebar';

export default function Home() {
  return (
    <Editor resolver={{ Root, Container, Button, Text }}>
      <Navigation />
      <Flex>
        <LeftSidebar />
        <Canvas />
        <RightSidebar />
      </Flex>
    </Editor>
  );
}
