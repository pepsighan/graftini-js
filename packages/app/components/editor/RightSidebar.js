import { Box, Tab, Tabs } from '@material-ui/core';
import { useCallback, useState } from 'react';
import { rightSidebarWidth } from 'utils/constants';
import ComponentOptions from './ComponentOptions';
import InteractionOptions from './InteractionOptions';

export default function RightSidebar() {
  const [index, setIndex] = useState(0);
  const onChange = useCallback((event, index) => setIndex(index), []);

  return (
    <Box
      sx={{
        px: 1.5,
        pb: 4,
        width: rightSidebarWidth,
        borderLeft: '1px solid',
        borderColor: 'grey.400',
        overflowY: 'auto',
        // Hide scrollbars on all browsers.
        // https://stackoverflow.com/a/49278385
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': {
          width: 0,
          height: 0,
        },
      }}
    >
      <Tabs value={index} onChange={onChange} centered sx={{ minHeight: 'auto' }}>
        <Tab label="Design" sx={{ padding: 1, minHeight: 0 }} />
        <Tab label="Interaction" sx={{ padding: 1, minHeight: 0 }} />
      </Tabs>

      <Box>
        {index === 0 && <ComponentOptions />}
        {index === 1 && <InteractionOptions />}
      </Box>
    </Box>
  );
}
