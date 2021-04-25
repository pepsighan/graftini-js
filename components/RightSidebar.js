import { Box } from '@chakra-ui/react';
import { useCallback } from 'react';
import { RightSidebarOpenPane, useEditorState } from 'store/editor';
import Queries from './Queries';
import StyleOptions from './StyleOptions';

export default function RightSidebar() {
  const openPane = useEditorState(useCallback((state) => state.rightSidebarOpenPane, []));

  return (
    <Box sx={{ width: 300, bg: 'gray.50', p: 4 }}>
      {openPane === RightSidebarOpenPane.StyleOptions && <StyleOptions />}
      {openPane === RightSidebarOpenPane.QueryBuilder && <Queries />}
    </Box>
  );
}
