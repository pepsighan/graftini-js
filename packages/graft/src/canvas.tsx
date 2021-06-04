import React from 'react';
import { ComponentNode } from './componentNode';
import { useOnDragLeave } from './dropLocation';
import { GraftComponentProps } from './resolver';
import { ROOT_NODE_ID } from './schema';

/**
 * A canvas root component returns the children as-is.
 */
/** @internal */
export function Root__Graft__Component({ onDragOver, children }: GraftComponentProps) {
  const onDragLeave = useOnDragLeave();

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </div>
  );
}

/**
 * A canvas on which all the components are drawn. This is the root under which
 * all the component tree lies.
 *
 * Also, as you can see, a root canvas is just a component node with `ROOT_NODE_ID`.
 */
export function Canvas() {
  return <ComponentNode componentId={ROOT_NODE_ID} isRoot />;
}
