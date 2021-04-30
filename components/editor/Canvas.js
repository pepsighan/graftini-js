import { Box } from '@chakra-ui/layout';
import { Element, Frame } from '@craftjs/core';
import Root from 'canvasComponents/Root';
import { useCallback } from 'react';
import { useEditorState } from 'store/editor';

export default function Canvas() {
  const defaultMarkup = useEditorState(
    useCallback((state) => state.markup, []),
    // Only load the markup on startup because craftjs handles the internal state itself.
    useCallback(() => true, [])
  );

  return (
    <Box sx={{ width: '100%', height: '100vh', boxShadow: 'md', zIndex: 1 }}>
      <Frame data={defaultMarkup}>
        <Element is={Root} canvas />
      </Frame>
    </Box>
  );
}
