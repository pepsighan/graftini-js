import { Box } from '@chakra-ui/layout';
import Layers from './Layers';
import Pages from './Pages';

export default function LeftSidebar() {
  return (
    <Box py={4} px={3} width={300} bg="gray.100" borderRight="1px" borderRightColor="gray.400">
      <Pages />
      <Layers />
    </Box>
  );
}
