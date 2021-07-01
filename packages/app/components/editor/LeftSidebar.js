import { Box } from '@material-ui/core';
import Layers from './Layers';
import Pages from './Pages';

export default function LeftSidebar() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', py: 1, width: 250 }}>
      <Pages />
      <Layers />
    </Box>
  );
}
