import { Box, Typography } from '@material-ui/core';
import { ROOT_NODE_ID } from '@graftini/graft';
import { componentOptions } from 'canvasComponents';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';

export default function StyleOptions() {
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

  if (!selectedComponentId) {
    return (
      <Box mt={2}>
        <Typography variant="body2">Select a component from the canvas to view options.</Typography>
      </Box>
    );
  }

  const Options = type ? componentOptions[type] : null;

  return (
    <>
      {Options != null ? (
        <Options key={selectedComponentId} componentId={selectedComponentId} />
      ) : null}
    </>
  );
}
