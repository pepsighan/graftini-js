import { Box } from '@chakra-ui/react';
import { useCallback } from 'react';
import { RightSidebarOpenPane, useDesignerState } from 'store/designer';
import { rightSidebarWidth } from 'utils/constants';
import ComponentOptions from './ComponentOptions';
import Queries from './Queries';

export default function RightSidebar() {
  const openPane = useDesignerState(useCallback((state) => state.rightSidebarOpenPane, []));

  return (
    <Box
      minWidth={rightSidebarWidth + 'px'}
      width={rightSidebarWidth + 'px'}
      height="100%"
      overflowY="auto"
      bg="gray.100"
      py={4}
      px={3}
      borderLeft="1px"
      borderLeftColor="gray.400"
    >
      {openPane === RightSidebarOpenPane.ComponentOptions && <ComponentOptions />}
      {openPane === RightSidebarOpenPane.QueryBuilder && <Queries />}
    </Box>
  );
}
