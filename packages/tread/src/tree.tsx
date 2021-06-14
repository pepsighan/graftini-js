import React from 'react';
import { ItemWrapper, RenderItem, TreeMap } from './renderItem';
import { RenderSubTree } from './renderSubTree';

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
export function Tree({ tree, renderItem, renderSubTree: SubTree }: TreeProps) {
  return (
    <>
      {Object.keys(tree)
        .filter((itemId) => !tree[itemId].parentId)
        .map((itemId) => (
          <ItemWrapper key={itemId} itemId={itemId} tree={tree} renderItem={renderItem}>
            {tree[itemId].childrenNodes.length > 0 && (
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

type SubTreeProps = TreeProps & {
  parentId: string;
};

function ActualSubTree({ tree, parentId, renderItem, renderSubTree: SubTree }: SubTreeProps) {
  return (
    <>
      {tree[parentId].childrenNodes.map((itemId) => (
        <ItemWrapper key={itemId} itemId={itemId} tree={tree} renderItem={renderItem}>
          {tree[itemId].childrenNodes.length > 0 && (
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
