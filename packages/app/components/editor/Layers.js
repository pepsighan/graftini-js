import { Box, Button, Text } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';
import { Tree } from 'tread';

export default function Layers() {
  const componentMap = useDesignerState(
    useCallback((state) => state.pages[state.currentOpenPage], [])
  );

  return (
    <Box mt={8} px={3} height="50%" overflowY="auto">
      <Text as="span" fontSize="sm" fontWeight="bold">
        Layers
      </Text>

      <Box mt={2}>
        <Tree tree={componentMap} renderItem={LayerItem} renderSubTree={SubTree} />
      </Box>
    </Box>
  );
}

function LayerItem({ item }) {
  return (
    <Button
      fontSize="sm"
      size="sm"
      fontWeight="normal"
      display="block"
      isFullWidth
      textAlign="left"
    >
      {!item.parentId ? 'Root' : item.props.name || 'Untitled'}
    </Button>
  );
}

function SubTree({ children }) {
  return <Box ml={4}>{children}</Box>;
}
