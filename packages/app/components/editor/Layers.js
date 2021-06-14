import { Box, Button, ButtonGroup, IconButton, Text } from '@chakra-ui/react';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import Icon from 'components/Icon';
import { useDimensions } from 'hooks/useDimensions';
import { useCallback, useRef } from 'react';
import { useDesignerState } from 'store/designer';
import { Tree } from 'tread';

export default function Layers() {
  const componentMap = useDesignerState(
    useCallback((state) => state.pages[state.currentOpenPage], [])
  );

  const textRef = useRef();
  const { height } = useDimensions(textRef);

  return (
    <Box mt={8} height="50%" position="relative" overflow="hidden">
      <Text ref={textRef} as="span" px={3} fontSize="sm" fontWeight="bold">
        Layers
      </Text>

      <Box
        height={`calc(100% - ${height}px)`}
        overflowY="scroll"
        position="absolute"
        top={`${height + 16}px`}
        left={0}
        bottom={0}
        right="-17px"
      >
        <Box px={3}>
          <Tree tree={componentMap} renderItem={LayerItem} renderSubTree={SubTree} />
        </Box>
      </Box>
    </Box>
  );
}

function LayerItem({ item, onToggle, isCollapsed }) {
  const isSelected = useDesignerState(
    useCallback((state) => state.selectedComponentId === item.id, [item.id])
  );

  const isChevronVisible = item.isCanvas && item.childrenNodes.length > 0;

  return (
    <ButtonGroup display="flex" isAttached colorScheme={isSelected ? 'primary' : 'gray'}>
      {isChevronVisible && (
        <IconButton size="sm" minWidth="initial" onClick={onToggle} pl={2}>
          <Icon icon={isCollapsed ? mdiChevronDown : mdiChevronUp} />
        </IconButton>
      )}
      <Button
        fontSize="sm"
        size="sm"
        fontWeight="normal"
        display="block"
        isFullWidth
        textAlign="left"
        pl={isChevronVisible ? 1 : 3}
      >
        {!item.parentId ? 'Root' : item.props.name || 'Untitled'}
      </Button>
    </ButtonGroup>
  );
}

function SubTree({ children }) {
  return <Box ml={4}>{children}</Box>;
}
