import { Box, Tab, Tabs } from '@material-ui/core';
import { useCallback, useState } from 'react';
import { rightSidebarWidth } from 'utils/constants';
import ComponentOptions from './ComponentOptions';
import InteractionOptions from './InteractionOptions';

export default function RightSidebar() {
  const [currentTab, setCurrentTab] = useState(0);
  const onChange = useCallback((_, index) => setCurrentTab(index), []);

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
      <Tabs value={currentTab} onChange={onChange} centered sx={{ minHeight: 'auto' }}>
        <Tab label="Design" sx={{ padding: 1, minHeight: 0 }} />
        <Tab label="Interaction" sx={{ padding: 1, minHeight: 0 }} />
      </Tabs>

      <TabPanel value={currentTab} index={0}>
        <ComponentOptions />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <InteractionOptions />
      </TabPanel>
    </Box>
  );
}

function TabPanel({ value, index, children }) {
  return <Box sx={{ display: value === index ? 'block' : 'none' }}>{children}</Box>;
}
