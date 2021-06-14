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

function SubTreeWrapper({ tree, parentId, renderItem, renderSubTree: SubTree }: SubTreeProps) {
  const isCollapsed = useTreeStore(
    useCallback((state: TreeStore) => !!state.isSubTreeCollapsed[parentId], [parentId])
  );

  return (
    <ItemWrapper itemId={parentId} tree={tree} renderItem={renderItem}>
      {tree[parentId].childrenNodes.length > 0 && !isCollapsed && (
        <SubTree>
          <ActualSubTree
            tree={tree}
            parentId={parentId}
            renderItem={renderItem}
            renderSubTree={SubTree}
          />
        </SubTree>
      )}
    </ItemWrapper>
  );
}

type SubTreeProps = TreeProps & {
  parentId: string;
};

function ActualSubTree({ tree, parentId, renderItem, renderSubTree: SubTree }: SubTreeProps) {
  const isCollapsed = useTreeStore(
    useCallback((state: TreeStore) => !!state.isSubTreeCollapsed[parentId], [parentId])
  );

  return (
    <>
      {tree[parentId].childrenNodes.map((itemId) => (
        <ItemWrapper key={itemId} itemId={itemId} tree={tree} renderItem={renderItem}>
          {tree[itemId].childrenNodes.length > 0 && !isCollapsed && (
            <SubTree>
              <ActualSubTree
                tree={tree}
                parentId={itemId}
                renderItem={renderItem}
                renderSubTree={SubTree}
              />
            </SubTree>
          )}
        </ItemWrapper>
      ))}
    </>
  );
}
