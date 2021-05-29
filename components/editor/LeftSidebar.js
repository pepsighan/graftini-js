import { Box } from '@chakra-ui/layout';
import Pages from './Pages';

export default function LeftSidebar() {
  return (
    <Box p={4} width={300} bg="gray.100" borderRight="1px" borderRightColor="gray.400">
      <Pages />
    </Box>
  );
}
