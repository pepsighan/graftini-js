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
  onCollapse: VoidFunction;
  onExpand: VoidFunction;
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
  return (
    <>
      <Item item={tree[itemId]} onCollapse={useOnCollapse(itemId)} onExpand={useOnExpand(itemId)} />
      {children}
    </>
  );
}

function useOnCollapse(itemId: string) {
  const collapseSubTree = useTreeStore(
    useCallback((state: TreeStore) => state.collapseSubTree, [])
  );

  return useCallback(() => {
    collapseSubTree(itemId, true);
  }, [collapseSubTree, itemId]);
}

function useOnExpand(itemId: string) {
  const collapseSubTree = useTreeStore(
    useCallback((state: TreeStore) => state.collapseSubTree, [])
  );

  return useCallback(() => {
    collapseSubTree(itemId, false);
  }, [collapseSubTree, itemId]);
}
