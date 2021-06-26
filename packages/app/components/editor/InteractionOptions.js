import { Box, Text } from '@chakra-ui/react';
import { ROOT_NODE_ID } from '@graftini/graft';
import CanvasForm from 'canvasComponents/form/CanvasForm';
import TextInputWithLabel from 'canvasComponents/form/TextInputWithLabel';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';

export default function InteractionOptions() {
  const selectedComponentId = useDesignerState(
    useCallback((state) => state.selectedComponentId, [])
  );

  const type = useDesignerState(
    useCallback((state) => {
      if (state.selectedComponentId === ROOT_NODE_ID) {
        return 'Root';
      }

      return state.selectedComponentId
        ? state.pages[state.currentOpenPage]?.[state.selectedComponentId]?.type ?? null
        : null;
    }, [])
  );

  if (!selectedComponentId || type === 'Root') {
    return (
      <Box px={3} py={2} bg="gray.200" borderRadius="md">
        <Text fontSize="sm">Select a component from the canvas to view options.</Text>
      </Box>
    );
  }

  if (type !== 'Box') {
    return (
      <Box px={3} py={2} bg="gray.200" borderRadius="md">
        <Text fontSize="sm">Select a box from the canvas to view options.</Text>
      </Box>
    );
  }

  return (
    <CanvasForm
      componentId={selectedComponentId}
      onInitialize={(initialState) => initialState}
      onTransformValues={() => {}}
    >
      <Box as="form">
        <TextInputWithLabel label="Link" name="link.to" />
      </Box>
    </CanvasForm>
  );
}
