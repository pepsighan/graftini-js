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
};

/**
 * The component which actually renders the item.
 */
export type RenderItem = (props: RenderItemProps) => JSX.Element;
