import React, { PropsWithChildren } from 'react';
import { ItemWrapper, RenderItem, UseTreeItem } from './renderItem';
import { TreeStoreProvider } from './store';

/**
 * Wrap a subtree within this component.
 */
export type RenderSubTree = (props: PropsWithChildren<{}>) => JSX.Element;

/**
 * The props to the tree component.
 */
export type TreeProps = {
  rootId: string;
  renderItem: RenderItem;
  renderSubTree: RenderSubTree;
  useTreeItem: UseTreeItem;
};

/**
 * Renders a tree based on the tree map. The actual items that are rendered can by
 * configured however you see fit.
 */
export function Tree({ rootId, renderItem, renderSubTree, useTreeItem }: TreeProps) {
  return (
    <TreeStoreProvider>
      <SubTree
        id={rootId}
        renderItem={renderItem}
        renderSubTree={renderSubTree}
        useTreeItem={useTreeItem}
      />
    </TreeStoreProvider>
  );
}

type SubTreeProps = {
  id: string;
  renderItem: RenderItem;
  renderSubTree: RenderSubTree;
  useTreeItem: UseTreeItem;
};

function SubTree({ id, renderItem, renderSubTree: RenderSubTree, useTreeItem }: SubTreeProps) {
  const item = useTreeItem(id);

  return (
    <ItemWrapper item={item} renderItem={renderItem}>
      <RenderSubTree>
        {item.childrenNodes.map((childId) => (
          <SubTree
            key={childId}
            id={childId}
            renderItem={renderItem}
            renderSubTree={RenderSubTree}
            useTreeItem={useTreeItem}
          />
        ))}
      </RenderSubTree>
    </ItemWrapper>
  );
}
