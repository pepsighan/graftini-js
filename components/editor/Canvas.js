import { Box } from '@chakra-ui/layout';
import { Canvas as Canvs, ROOT_NODE_ID } from '@graftini/graft';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';

export default function Canvas() {
  const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));

  return (
    <Box
      onClick={useCallback(() => {
        // The selection is not actually the root node. But since the root node is directly below.
        // Its the technically the same.
        selectComponent(ROOT_NODE_ID);
      }, [selectComponent])}
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
