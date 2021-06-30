/** @jsxImportSource @emotion/react */
import { useEditorStore, useOnDelete } from '@graftini/graft';
import { Box, IconButton, Typography } from '@material-ui/core';
import { TrashIcon } from '@modulz/radix-icons';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';

export default function ActionBar({ componentId }) {
  const name = useEditorStore(
    useCallback((state) => state.componentMap[componentId].props.name, [componentId])
  );
  const onDelete = useOnDeleteComponent({ componentId });

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pl: 1 }}>
      <Typography
        variant="caption"
        sx={{
          color: 'white',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {name || 'Untitled'}
      </Typography>
      <IconButton size="small" css={{ ml: 2, color: 'white' }} onClick={onDelete}>
        <TrashIcon />
      </IconButton>
    </Box>
  );
}

function useOnDeleteComponent({ componentId }) {
  const unselectComponent = useDesignerState(useCallback((state) => state.unselectComponent, []));
  const onDeleteComponent = useOnDelete();

  return useCallback(
    (ev) => {
      ev.stopPropagation();
      unselectComponent();
      onDeleteComponent(componentId);
    },
    [componentId, onDeleteComponent, unselectComponent]
  );
}
