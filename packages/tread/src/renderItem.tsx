import React, { ReactNode, useCallback } from 'react';
import { TreeStore, useTreeStore } from './store';

/**
 * A tree item that can be rendered anywhere within it.
 */
export type TreeItem = {
  id: string;
  childrenNodes: string[];
  [key: string]: unknown;
};

/**
 * Hook to get the tree item for the given id.
 */
export type UseTreeItem = (id: string) => TreeItem;

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
  item: TreeItem;
  children: ReactNode;
  renderItem: RenderItem;
};

/** @internal */
export function ItemWrapper({ item, renderItem: Item, children }: ItemWrapperProps) {
  const isCollapsed = useTreeStore(
    useCallback((state: TreeStore) => !!state.isSubTreeCollapsed[item.id], [item.id])
  );

  return (
    <>
      <Item item={item} onToggle={useOnToggle(item.id)} isCollapsed={isCollapsed} />
      {!isCollapsed && children}
    </>
  );
}

function useOnToggle(itemId: string) {
  const toggleCollapse = useTreeStore(useCallback((state: TreeStore) => state.toggleCollapse, []));

  return useCallback(() => {
    toggleCollapse(itemId);
  }, [itemId, toggleCollapse]);
}
