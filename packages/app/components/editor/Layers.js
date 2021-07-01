import { ROOT_NODE_ID, useEditorStore, useEditorStoreApi } from '@graftini/graft';
import { Box, Button, ButtonGroup, Typography } from '@material-ui/core';
import { TreeItem, TreeView, useTreeItem } from '@material-ui/lab';
import { ChevronDownIcon, ChevronUpIcon, SquareIcon, TextIcon } from '@modulz/radix-icons';
import { forwardRef, useCallback, useState } from 'react';
import { useDesignerState } from 'store/designer';

export default function Layers() {
  const { getState } = useEditorStoreApi();

  const [expanded, setExpanded] = useState(() => Object.keys(getState().componentMap));
  const onExpansion = useCallback((_, ids) => setExpanded(ids), []);

  const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));
  const onSelect = useCallback((_, id) => selectComponent(id), [selectComponent]);

  const selectedId = useDesignerState(useCallback((state) => state.selectedComponentId, []));

  return (
    <Box sx={{ flex: 1, px: 1.5 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Layers
      </Typography>

      <TreeView
        expanded={expanded}
        selected={selectedId}
        onNodeToggle={onExpansion}
        onNodeSelect={onSelect}
      >
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
  const { type, props, childrenNodes } = useEditorStore(
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

  const { expanded, selected, handleExpansion, handleSelection } = useTreeItem(nodeId);

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
      {childrenNodes.length > 0 && (
        <Button sx={{ width: 20, minWidth: 'unset', p: 0 }} onClick={handleExpansion}>
          {expanded ? (
            <ChevronDownIcon width={12} height={12} />
          ) : (
            <ChevronUpIcon width={12} height={12} />
          )}
        </Button>
      )}
      <Button
        sx={{ justifyContent: 'flex-start', pl: childrenNodes.length === 0 ? '18px' : 0 }}
        onClick={handleSelection}
      >
        {type === 'Text' ? (
          <TextIcon width={12} height={12} />
        ) : (
          <SquareIcon width={12} height={12} />
        )}
        <Typography variant="body2" sx={{ ml: 0.5 }}>
          {props.name || 'Untitled'}
        </Typography>
      </Button>
    </ButtonGroup>
  );
});
