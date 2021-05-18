import { Box } from '@chakra-ui/layout';
import { Canvas as Canvs } from '@graftini/graft';

export default function Canvas() {
  return (
    <Box sx={{ width: '100%', height: '100vh', boxShadow: 'md', zIndex: 1 }}>
      <Canvs />
    </Box>
  );
}
