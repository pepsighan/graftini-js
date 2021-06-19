import React from 'react';
import { ItemWrapper, RenderItem, UseTreeItem } from './renderItem';
import { TreeStoreProvider } from './store';

/**
 * The props to the tree component.
 */
export type TreeProps = {
  rootId: string;
  renderItem: RenderItem;
  useTreeItem: UseTreeItem;
};

/**
 * Renders a tree based on the tree map. The actual items that are rendered can by
 * configured however you see fit.
 */
export function Tree({ rootId, renderItem, useTreeItem }: TreeProps) {
  return (
    <TreeStoreProvider>
      <SubTree id={rootId} renderItem={renderItem} useTreeItem={useTreeItem} />
    </TreeStoreProvider>
  );
}

type SubTreeProps = {
  id: string;
  renderItem: RenderItem;
  useTreeItem: UseTreeItem;
};

function SubTree({ id, renderItem, useTreeItem }: SubTreeProps) {
  const item = useTreeItem(id);
  return (
    <ItemWrapper item={item} renderItem={renderItem}>
      {item.childrenNodes.map((childId) => (
        <SubTree key={childId} id={childId} renderItem={renderItem} useTreeItem={useTreeItem} />
      ))}
    </ItemWrapper>
  );
}
