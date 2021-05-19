import { Box, Text } from '@chakra-ui/react';
import components from 'canvasComponents';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';

export default function StyleOptions() {
  const selectedComponent = useDesignerState(
    useCallback(
      (state) =>
        state.selectedComponentId
          ? state.pages[state.currentOpenPage]?.[state.selectedComponentId] ?? null
          : null,
      []
    )
  );

  if (!selectedComponent) {
    return (
      <Box px={3} py={2} bg="gray.200" borderRadius="md">
        <Text fontSize="sm">Select a component from the canvas to view options.</Text>
      </Box>
    );
  }

  const nodeType = selectedComponent.type;
  const Component = nodeType ? components[nodeType] : null;

  return (
    <>
      <Text fontWeight="bold" mb={2}>
        Styles
      </Text>
      {Component?.Options != null ? (
        <Component.Options key={selectedComponent.id} componentId={selectedComponent.id} />
      ) : null}
    </>
  );
}
