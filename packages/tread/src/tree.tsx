import React from 'react';
import { RenderItem, TreeMap } from './renderItem';
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
export function Tree({ tree, renderItem: Item, renderSubTree: SubTree }: TreeProps) {
  return (
    <>
      {Object.keys(tree)
        .filter((itemId) => !tree[itemId].parentId)
        .map((itemId) => (
          <React.Fragment key={itemId}>
            <Item item={tree[itemId]} />
            {tree[itemId].childrenNodes.length > 0 && (
              <SubTree>
                <ActualSubTree
                  tree={tree}
                  parentId={itemId}
                  renderItem={Item}
                  renderSubTree={SubTree}
                />
              </SubTree>
            )}
          </React.Fragment>
        ))}
    </>
  );
}

type SubTreeProps = TreeProps & {
  parentId: string;
};

function ActualSubTree({ tree, parentId, renderItem: Item, renderSubTree: SubTree }: SubTreeProps) {
  return (
    <>
      {tree[parentId].childrenNodes.map((itemId) => (
        <React.Fragment key={itemId}>
          <Item item={tree[itemId]} />
          {tree[itemId].childrenNodes.length > 0 && (
            <SubTree>
              <ActualSubTree
                tree={tree}
                parentId={itemId}
                renderItem={Item}
                renderSubTree={SubTree}
              />
            </SubTree>
          )}
        </React.Fragment>
      ))}
    </>
  );
}
