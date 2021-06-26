import { Box, Text } from '@chakra-ui/react';
import { ROOT_NODE_ID } from '@graftini/graft';
import CanvasForm from 'canvasComponents/form/CanvasForm';
import TextInput from 'canvasComponents/form/TextInput';
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

  const onSync = useCallback((props, state) => {
    if (!state.link) {
      props.link = null;
      return;
    }

    props.link ??= {};
    props.link.pageId = state.link.pageId;
    props.link.href = state.link.pageId ? null : state.link.href;
  }, []);

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
    <CanvasForm componentId={selectedComponentId} onSync={onSync}>
      <Box as="form">
        <TextInput label="Link" name="link.pageId" />
      </Box>
    </CanvasForm>
  );
}
