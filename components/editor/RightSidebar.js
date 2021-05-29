import { Box } from '@chakra-ui/react';
import { useCallback } from 'react';
import { RightSidebarOpenPane, useDesignerState } from 'store/designer';
import Queries from './Queries';
import ComponentOptions from './ComponentOptions';

export default function RightSidebar() {
  const openPane = useDesignerState(useCallback((state) => state.rightSidebarOpenPane, []));

  return (
    <Box width="300px" bg="gray.100" py={4} px={3} borderLeft="1px" borderLeftColor="gray.400">
      {openPane === RightSidebarOpenPane.ComponentOptions && <ComponentOptions />}
      {openPane === RightSidebarOpenPane.QueryBuilder && <Queries />}
    </Box>
  );
}
