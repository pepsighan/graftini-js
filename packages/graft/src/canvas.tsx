import React from 'react';
import { ComponentNode } from './componentNode';
import { useSyncDropRegion } from './dropLocation';
import { ROOT_NODE_ID } from './store/editor';

/**
 * A canvas on which all the components are drawn. This is the root under which
 * all the component tree lies.
 *
 * Also, as you can see, a root canvas is just a component node with `ROOT_NODE_ID`.
 */
export function Canvas() {
  // Sync the drop region whenever a cursor is dragged.
  useSyncDropRegion();

  return <ComponentNode componentId={ROOT_NODE_ID} />;
}
