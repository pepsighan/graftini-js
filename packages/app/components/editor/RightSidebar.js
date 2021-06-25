import { Box, Button, ButtonGroup } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { rightSidebarWidth } from 'utils/constants';
import ComponentOptions from './ComponentOptions';
import Queries from './Queries';

export default function RightSidebar() {
  const [index, setIndex] = useState(0);
  const onClick = useCallback((index) => () => setIndex(index), []);

  return (
    <Box
      minWidth={rightSidebarWidth + 'px'}
      width={rightSidebarWidth + 'px'}
      height="100%"
      overflowY="auto"
      bg="gray.100"
      py={3}
      px={3}
      borderLeft="1px"
      borderLeftColor="gray.400"
      sx={{
        // Hide scrollbars on all browsers.
        // https://stackoverflow.com/a/49278385
        scrollbarWidth: 'none',
        '-ms-overflow-style': 'none',
        '&::-webkit-scrollbar': {
          width: 0,
          height: 0,
        },
      }}
    >
      <ButtonGroup display="flex" size="xs" mb={4}>
        <Button flex={1} isActive={index === 0} onClick={onClick(0)}>
          Design
        </Button>
        <Button flex={1} isActive={index === 1} onClick={onClick(1)}>
          Interaction
        </Button>
        <Button flex={1} isActive={index === 2} onClick={onClick(2)}>
          Query
        </Button>
      </ButtonGroup>

      <Box>
        {index === 0 && <ComponentOptions />}
        {index === 2 && <Queries />}
      </Box>
    </Box>
  );
}
