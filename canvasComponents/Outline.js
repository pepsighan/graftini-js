import { Box, IconButton, Text } from '@chakra-ui/react';
import { useEditor, useNode } from '@craftjs/core';
import { useCallback } from 'react';
import { MdDelete } from 'react-icons/md';

/**
 * A border that is shown on user elements when hovered over or when selected.
 */
export default function Outline({ name, width, children }) {
  const {
    actions: { delete: del },
  } = useEditor();

  const {
    connectors: { connect },
    id,
    isSelected,
    isHovered,
  } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const onDelete = useCallback(() => {
    del(id);
  }, [del, id]);

  return (
    <Box
      ref={connect}
      sx={{
        boxShadow: () => (isSelected || isHovered ? `0 0 0 1px black` : null),
        // To show the border on top even if there is some overlap in components.
        position: isSelected || isHovered ? 'relative' : null,
        // Width is only considered in the case of container, since its width can be modified.
        width,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          display: isSelected || isHovered ? 'flex' : 'none',
          top: 0,
          left: -1,
          transform: 'translateY(-100%)',
          px: 1,
          py: 0.25,
          backgroundColor: () => (isHovered && !isSelected ? 'white' : 'black'),
          border: () => `1px solid black`,
          alignItems: 'center',
        }}
      >
        <Text
          variant="caption"
          sx={{
            color: isHovered && !isSelected ? 'black' : 'white',
            lineHeight: 'normal',
          }}
        >
          {name || 'Untitled'}
        </Text>

        <IconButton size="small" sx={{ ml: 1 }} onClick={onDelete}>
          <MdDelete />
        </IconButton>
      </Box>

      {children}
    </Box>
  );
}
