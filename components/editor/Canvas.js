import { Box } from '@chakra-ui/layout';
import { Frame } from '@craftjs/core';
import { useCallback } from 'react';
import { useEditorState } from 'store/editor';

export default function Canvas() {
  const defaultMarkup = useEditorState(
    useCallback((state) => state.pages[state.currentOpenPage], []),
    // Only load the markup on startup because craftjs handles the internal state itself.
    // Make sure the canvas is re-created when page changes.
    useCallback(() => true, [])
  );

  return (
    <Box sx={{ width: '100%', height: '100vh', boxShadow: 'md', zIndex: 1 }}>
      <Frame data={defaultMarkup} />
    </Box>
  );
}
