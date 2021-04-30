import { Box } from '@chakra-ui/layout';
import { Element, Frame } from '@craftjs/core';
import Root from 'canvasComponents/Root';

export default function Canvas() {
  return (
    <Box sx={{ width: '100%', height: '100vh', boxShadow: 'md', zIndex: 1 }}>
      <Frame>
        <Element is={Root} canvas />
      </Frame>
    </Box>
  );
}
