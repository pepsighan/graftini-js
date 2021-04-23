import { Box } from '@chakra-ui/react';
import StyleOptions from './StyleOptions';

export default function RightSidebar() {
  return (
    <Box sx={{ width: 300, bg: 'gray.50', p: 4 }}>
      <StyleOptions />
    </Box>
  );
}
