import { Box } from '@chakra-ui/layout';
import Pages from './Pages';

export default function LeftSidebar({ projectId }) {
  return (
    <Box p={4} width={300} bg="gray.50">
      <Pages projectId={projectId} />
    </Box>
  );
}
