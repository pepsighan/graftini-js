import { Box, IconButton, Text } from '@chakra-ui/react';
import { useEditor, useNode } from '@craftjs/core';
import { useCallback } from 'react';
import { MdDelete } from 'react-icons/md';
import theme from 'utils/theme';

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
  } = useNode(
    useCallback(
      (state) => ({
        isSelected: state.events.selected,
        isHovered: state.events.hovered,
      }),
      []
    )
  );

  const onDelete = useCallback(() => {
    del(id);
  }, [del, id]);

  return (
    <Box
      ref={connect}
      sx={{
        boxShadow: isSelected || isHovered ? `0 0 0 1px ${theme.colors.blue[600]}` : null,
        // To show the border on top even if there is some overlap in components.
        position: isSelected || isHovered ? 'relative' : null,
        // Width is only considered in the case of container, since its width can be modified.
        width: `${width}px`,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          display: isSelected || isHovered ? 'flex' : 'none',
          top: 0,
          left: '-1px',
          transform: 'translateY(-100%)',
          px: 1,
          py: 0.5,
          backgroundColor: isHovered && !isSelected ? 'white' : 'blue.600',
          border: '1px',
          borderColor: 'blue.600',
          alignItems: 'center',
        }}
      >
        <Text
          fontSize="xs"
          lineHeight="normal"
          color={isHovered && !isSelected ? 'blue.600' : 'white'}
        >
          {name || 'Untitled'}
        </Text>

        <IconButton
          height="unset"
          width="unset"
          minWidth="unset"
          sx={{ ml: 1 }}
          colorScheme={isHovered && !isSelected ? 'blue' : 'grey'}
          onClick={onDelete}
        >
          <MdDelete />
        </IconButton>
      </Box>

      {children}
    </Box>
  );
}
