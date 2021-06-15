import { Box, Button } from '@chakra-ui/react';
import { useRef } from 'react';
import { useClickAway } from 'react-use';

export default function PageContextMenu({ context, onClose }) {
  const ref = useRef();
  useClickAway(ref, onClose);

  return (
    <Box
      ref={ref}
      position="fixed"
      top={`${context.y}px`}
      left={`${context.x}px`}
      zIndex="popover"
      bg="white"
      shadow="md"
      width={200}
      py={1}
      borderRadius="md"
    >
      <Button
        size="sm"
        px={5}
        isFullWidth
        borderRadius="none"
        justifyContent="flex-start"
        fontWeight="normal"
        bg="white"
      >
        Edit
      </Button>
      <Button
        size="sm"
        px={5}
        isFullWidth
        borderRadius="none"
        justifyContent="flex-start"
        fontWeight="normal"
        bg="white"
      >
        Delete
      </Button>
    </Box>
  );
}
