import { Box, Text } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';

export default function InteractionOptions() {
  const selectedComponentId = useDesignerState(
    useCallback((state) => state.selectedComponentId, [])
  );

  if (!selectedComponentId) {
    return (
      <Box px={3} py={2} bg="gray.200" borderRadius="md">
        <Text fontSize="sm">Select a component from the canvas to view options.</Text>
      </Box>
    );
  }

  return <>{selectedComponentId}</>;
}
