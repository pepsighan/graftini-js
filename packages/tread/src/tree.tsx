import React, { useCallback } from 'react';
import { ItemWrapper, RenderItem, TreeMap } from './renderItem';
import { RenderSubTree } from './renderSubTree';
import { TreeStore, TreeStoreProvider, useTreeStore } from './store';

/**
 * The props to the tree component.
 */
export type TreeProps = {
  tree: TreeMap;
  renderItem: RenderItem;
  renderSubTree: RenderSubTree;
};

/**
 * Renders a tree based on the tree map. The actual items that are rendered can by
 * configured however you see fit.
 */
export function Tree({ tree, renderItem, renderSubTree }: TreeProps) {
  return (
    <TreeStoreProvider>
      {Object.keys(tree)
        .filter((itemId) => !tree[itemId].parentId)
        .map((itemId) => (
          <SubTreeWrapper
            key={itemId}
            parentId={itemId}
            tree={tree}
            renderItem={renderItem}
            renderSubTree={renderSubTree}
          />
        ))}
    </TreeStoreProvider>
  );
}

type SubTreeProps = TreeProps & {
  parentId: string;
};

function SubTree({ tree, parentId, renderItem, renderSubTree }: SubTreeProps) {
  return (
    <>
      {tree[parentId].childrenNodes.map((itemId) => (
        <SubTreeWrapper
          key={itemId}
          parentId={itemId}
          tree={tree}
          renderItem={renderItem}
          renderSubTree={renderSubTree}
        />
      ))}
    </>
  );
}

function SubTreeWrapper({
  tree,
  parentId,
  renderItem,
  renderSubTree: RenderSubTree,
}: SubTreeProps) {
  const isCollapsed = useTreeStore(
    useCallback((state: TreeStore) => !!state.isSubTreeCollapsed[parentId], [parentId])
  );

  return (
    <ItemWrapper itemId={parentId} tree={tree} renderItem={renderItem}>
      {tree[parentId].childrenNodes.length > 0 && !isCollapsed && (
        <RenderSubTree>
          <SubTree
            tree={tree}
            parentId={parentId}
            renderItem={renderItem}
            renderSubTree={RenderSubTree}
          />
        </RenderSubTree>
      )}
    </ItemWrapper>
  );
}
