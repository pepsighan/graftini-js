import { ROOT_NODE_ID } from '@graftini/graft';
import { Box, Tab, Tabs } from '@material-ui/core';
import { useCallback, useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { useDesignerState } from 'store/designer';
import { rightSidebarWidth } from 'utils/constants';
import ComponentOptions from './ComponentOptions';
import InteractionOptions from './InteractionOptions';
import SEOOptions from './SEOOptions';

export default function RightSidebar() {
  const [currentTab, setCurrentTab] = useState(0);
  const onChange = useCallback((_, index) => setCurrentTab(index), []);

  const isRootSelected = useDesignerState(
    useCallback((state) => state.selectedComponentId === ROOT_NODE_ID, [])
  );

  useEffect(() => {
    if (!isRootSelected) {
      // If the root component is no longer selected, then the SEO tab will
      // hide. So, if the current tab is the SEO tab when that happens, switch
      // the tab to the initial one.
      setCurrentTab((tab) => (tab === 2 ? 0 : tab));
    }
  }, [isRootSelected]);

  return (
    <Scrollbars
      autoHide
      autoHideTimeout={1000}
      autoHideDuration={200}
      style={{
        width: rightSidebarWidth,
      }}
    >
      <Box
        sx={{
          px: 1.5,
          pb: 4,
        }}
      >
        <Tabs value={currentTab} onChange={onChange} centered sx={{ mt: 1, minHeight: 'auto' }}>
          <Tab label="Design" sx={{ padding: 1, minHeight: 0 }} />
          <Tab label="Interaction" sx={{ padding: 1, minHeight: 0 }} />
          {isRootSelected && <Tab label="SEO" sx={{ padding: 1, minHeight: 0 }} />}
        </Tabs>

        <TabPanel value={currentTab} index={0}>
          <ComponentOptions />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <InteractionOptions />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <SEOOptions />
        </TabPanel>
      </Box>
    </Scrollbars>
  );
}

function TabPanel({ value, index, children }) {
  return <Box sx={{ display: value === index ? 'block' : 'none' }}>{children}</Box>;
}
