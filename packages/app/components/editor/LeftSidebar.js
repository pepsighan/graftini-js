import { Box, Divider } from '@material-ui/core';
import Layers from './Layers';
import Pages from './Pages';

export default function LeftSidebar() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        py: 1,
        width: 250,
        gap: 1.5,
      }}
    >
      <Pages />
      <Divider sx={{ mx: 1.5 }} />
      <Layers />
    </Box>
  );
}
