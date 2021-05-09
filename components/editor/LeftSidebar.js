import { Box } from '@chakra-ui/layout';
import Pages from './Pages';

export default function LeftSidebar() {
  return (
    <Box p={4} width={300} bg="gray.50">
      <Pages />
    </Box>
  );
}
