import { ROOT_NODE_ID, useEditorStore } from '@graftini/graft';
import { Box, Typography } from '@material-ui/core';
import { TreeItem, TreeView } from '@material-ui/lab';
import { ChevronDownIcon, ChevronUpIcon, SquareIcon, TextIcon } from '@modulz/radix-icons';
import { useCallback, useState } from 'react';

export default function Layers() {
  const [expanded, setExpanded] = useState([]);

  const onToggle = useCallback((_, nodeIds) => {
    setExpanded(nodeIds);
  }, []);

  return (
    <Box sx={{ flex: 1 }}>
      <Typography sx={{ px: 1.5 }}>Layers</Typography>

      <TreeView
        defaultCollapseIcon={<ChevronUpIcon />}
        defaultExpandIcon={<ChevronDownIcon />}
        expanded={expanded}
        onNodeToggle={onToggle}
      >
        <Root />
      </TreeView>
    </Box>
  );
}

function Root() {
  const childrenNodes = useEditorStore(
    useCallback((state) => state.componentMap[ROOT_NODE_ID].childrenNodes, [])
  );

  return (
    <TreeItem nodeId={ROOT_NODE_ID} label="Root">
      {childrenNodes.map((it) => (
        <LayerItem key={it} id={it} />
      ))}
    </TreeItem>
  );
}

function LayerItem({ id }) {
  const { props, type, isCanvas, childrenNodes } = useEditorStore(
    useCallback((state) => state.componentMap[id], [id]),
    // Only the following checked fields are needed to render a layer. So any changes
    // in other places won't cause a re-render.
    useCallback(
      (left, right) =>
        left.id === right.id &&
        left.childrenNodes === right.childrenNodes &&
        left.isCanvas === right.isCanvas &&
        left.type === right.type &&
        left.props.name === right.props.name,
      []
    )
  );

  return (
    <TreeItem
      nodeId={id}
      label={props.name || 'Untitled'}
      icon={type === 'Text' ? <TextIcon /> : <SquareIcon />}
    >
      {isCanvas && childrenNodes.map((it) => <LayerItem key={it} id={it} />)}
    </TreeItem>
  );
}
