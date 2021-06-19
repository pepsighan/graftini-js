import { Box, Button, ButtonGroup, IconButton, Text } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, SquareIcon, TextIcon } from '@modulz/radix-icons';
import { useDimensions } from 'hooks/useDimensions';
import { useCallback, useRef } from 'react';
import { useDesignerState } from 'store/designer';
import { ROOT_NODE_ID } from 'graft';
import { Tree } from 'tread';

export default function Layers() {
  const textRef = useRef();
  const { height } = useDimensions(textRef);

  return (
    <Box flex={1} position="relative" overflow="hidden">
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
          <Tree
            rootId={ROOT_NODE_ID}
            renderItem={LayerItem}
            renderSubTree={SubTree}
            useTreeItem={useTreeItem}
          />
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

  const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));
  const onSelect = useCallback(() => selectComponent(item.id), [item.id, selectComponent]);

  return (
    <ButtonGroup display="flex" isAttached colorScheme={isSelected ? 'primary' : 'gray'}>
      {isChevronVisible && (
        <IconButton
          size="sm"
          minWidth="initial"
          flexGrow={0}
          flexShrink={0}
          onClick={onToggle}
          width={6}
          sx={{ paddingInlineEnd: 0 }}
        >
          {isCollapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
        </IconButton>
      )}
      <Button
        fontSize="sm"
        size="sm"
        flexGrow={0}
        flexShrink={0}
        fontWeight="normal"
        isFullWidth
        justifyContent="flex-start"
        onClick={onSelect}
        sx={{ paddingInlineStart: isChevronVisible ? 1 : 7 }}
      >
        {item.type === 'Text' ? <TextIcon /> : <SquareIcon />}
        <Text ml={2}>{!item.parentId ? 'Root' : item.props.name || 'Untitled'}</Text>
      </Button>
    </ButtonGroup>
  );
}

function SubTree({ children }) {
  return <Box ml={4}>{children}</Box>;
}

function useTreeItem(itemId) {
  return useDesignerState(
    useCallback((state) => state.pages[state.currentOpenPage][itemId], [itemId]),
    // Only the following checked fields are needed to render a layer. So any changes
    // in other places won't cause a re-render.
    useCallback(
      (left, right) =>
        left.id === right.id &&
        left.childrenNodes === right.childrenNodes &&
        left.isCanvas === right.isCanvas &&
        left.type === right.type &&
        left.parentId === right.parentId &&
        left.props.name === right.props.name,
      []
    )
  );
}
