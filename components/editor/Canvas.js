import { Box } from '@chakra-ui/layout';
import { Canvas as Canvs } from '@graftini/graft';

export default function Canvas() {
  return (
    <Box
      sx={{
        width: '100%',
        // The height of the nav is substracted, so that the editor does not cause window-wide scroll.
        height: 'calc(100vh - 64px)',
        border: '1px',
        borderColor: 'gray.300',
        userSelect: 'none',
        // Any content that overflows vertically will have the scrollbar on this box itself.
        overflowY: 'auto',
      }}
    >
      <Canvs />
    </Box>
  );
}
