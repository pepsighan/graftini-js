import { ROOT_NODE_ID, useEditorStore, useEditorStoreApi } from '@graftini/graft';
import { Box, Button, ButtonGroup, Typography } from '@material-ui/core';
import { TreeItem, TreeView, useTreeItem } from '@material-ui/lab';
import { SquareIcon, TextIcon } from '@modulz/radix-icons';
import { forwardRef, useCallback, useMemo } from 'react';
import { useDesignerState } from 'store/designer';

export default function Layers() {
  const { getState } = useEditorStoreApi();

  const allExpanded = useMemo(() => Object.keys(getState().componentMap), [getState]);

  const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));
  const onSelect = useCallback((_, id) => selectComponent(id), [selectComponent]);

  const selectedId = useDesignerState(useCallback((state) => state.selectedComponentId, []));

  return (
    <Box sx={{ flex: 1, px: 1.5 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Layers
      </Typography>

      <TreeView expanded={allExpanded} selected={selectedId} onNodeSelect={onSelect}>
        <LayerItem id={ROOT_NODE_ID} />
      </TreeView>
    </Box>
  );
}

function LayerItem({ id }) {
  const { isCanvas, childrenNodes } = useEditorStore(
    useCallback((state) => state.componentMap[id], [id]),
    useCallback(
      (left, right) =>
        left.id === right.id &&
        left.childrenNodes === right.childrenNodes &&
        left.isCanvas === right.isCanvas,
      []
    )
  );

  return (
    <TreeItem nodeId={id} ContentComponent={LayerView}>
      {isCanvas && childrenNodes.map((it) => <LayerItem key={it} id={it} />)}
    </TreeItem>
  );
}

const LayerView = forwardRef(({ nodeId }, ref) => {
  const { type, props } = useEditorStore(
    useCallback((state) => state.componentMap[nodeId], [nodeId]),
    useCallback(
      (left, right) =>
        left.id === right.id &&
        left.type === right.type &&
        left.props.name === right.props.name &&
        left.childrenNodes === right.childrenNodes &&
        left.isCanvas === right.isCanvas,
      []
    )
  );

  const { selected, handleSelection } = useTreeItem(nodeId);

  return (
    <ButtonGroup
      ref={ref}
      fullWidth
      size="small"
      variant="text"
      color="inherit"
      sx={{
        mt: 0.5,
        backgroundColor: selected ? 'grey.200' : null,
        '& .MuiButtonGroup-grouped': {
          minWidth: 'unset',
        },
        '& .MuiButtonGroup-grouped:not(:last-of-type)': {
          border: 'none',
        },
      }}
    >
      <Button sx={{ justifyContent: 'flex-start' }} onClick={handleSelection}>
        {type === 'Text' ? (
          <TextIcon width={12} height={12} />
        ) : (
          <SquareIcon width={12} height={12} />
        )}
        <Typography variant="body2" sx={{ ml: 0.5 }}>
          {nodeId === ROOT_NODE_ID ? 'Root' : props.name || 'Untitled'}
        </Typography>
      </Button>
    </ButtonGroup>
  );
});
