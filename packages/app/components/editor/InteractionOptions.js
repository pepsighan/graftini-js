import { ROOT_NODE_ID } from '@graftini/graft';
import { Box, Typography } from '@material-ui/core';
import { componentInteractionOptions } from 'canvasComponents';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';

export default function InteractionOptions() {
  const selectedComponentId = useDesignerState(
    useCallback((state) => state.selectedComponentId, [])
  );

  const type = useDesignerState(
    useCallback((state) => {
      if (state.selectedComponentId === ROOT_NODE_ID) {
        return 'Root';
      }

      return state.selectedComponentId
        ? state.pages[state.currentOpenPage]?.[state.selectedComponentId]?.type ?? null
        : null;
    }, [])
  );

  if (type === 'Root') {
    return (
      <Box mt={2}>
        <Typography variant="body2">
          Select any layer other than the Root from the canvas to view options.
        </Typography>
      </Box>
    );
  }

  const Component = componentInteractionOptions[type];
  return <Component key={selectedComponentId} componentId={selectedComponentId} />;
}
