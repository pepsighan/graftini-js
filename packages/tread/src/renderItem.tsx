import React, { ReactNode, useCallback } from 'react';
import { TreeStore, useTreeStore } from './store';

/**
 * A tree item that can be rendered anywhere within it.
 */
export type TreeItem = {
  id: string;
  childrenNodes: string[];
  parentId?: string;
  [key: string]: unknown;
};

/**
 * A flattened tree.
 */
export type TreeMap = {
  [id: string]: TreeItem;
};

/**
 * The props to the render item.
 */
export type RenderItemProps = {
  item: TreeItem;
  onToggle: VoidFunction;
  isCollapsed: boolean;
};

/**
 * The component which actually renders the item.
 */
export type RenderItem = (props: RenderItemProps) => JSX.Element;

export type ItemWrapperProps = {
  itemId: string;
  tree: TreeMap;
  children: ReactNode;
  renderItem: RenderItem;
};

/** @internal */
export function ItemWrapper({ itemId, tree, renderItem: Item, children }: ItemWrapperProps) {
  const isCollapsed = useTreeStore(
    useCallback((state: TreeStore) => !!state.isSubTreeCollapsed[itemId], [itemId])
  );

  return (
    <>
      <Item item={tree[itemId]} onToggle={useOnToggle(itemId)} isCollapsed={isCollapsed} />
      {children}
    </>
  );
}

function useOnToggle(itemId: string) {
  const toggleCollapse = useTreeStore(useCallback((state: TreeStore) => state.toggleCollapse, []));

  return useCallback(() => {
    toggleCollapse(itemId);
  }, [itemId, toggleCollapse]);
}
