import { Box, Text } from '@chakra-ui/react';
import components from 'canvasComponents';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';

export default function StyleOptions() {
  const selectedComponentId = useDesignerState(
    useCallback((state) => state.selectedComponentId, [])
  );

  const type = useDesignerState(
    useCallback(
      (state) =>
        state.selectedComponentId
          ? state.pages[state.currentOpenPage]?.[state.selectedComponentId]?.type ?? null
          : null,
      []
    )
  );

  if (!selectedComponentId) {
    return (
      <Box px={3} py={2} bg="gray.200" borderRadius="md">
        <Text fontSize="sm">Select a component from the canvas to view options.</Text>
      </Box>
    );
  }

  const Component = type ? components[type] : null;

  return (
    <>
      <Text fontSize="sm" fontWeight="bold" mb={4}>
        Styles
      </Text>
      {Component?.Options != null ? (
        <Component.Options key={selectedComponentId} componentId={selectedComponentId} />
      ) : null}
    </>
  );
}
