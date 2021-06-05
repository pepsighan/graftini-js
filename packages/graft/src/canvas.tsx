import React, { ForwardedRef, forwardRef } from 'react';
import { ComponentNode } from './componentNode';
import { useSyncDropRegion } from './dropLocation';
import { GraftComponentProps } from './resolver';
import { ROOT_NODE_ID } from './schema';

/**
 * A canvas root component returns the children as-is.
 */
/** @internal */
export const Root__Graft__Component = forwardRef(
  ({ children }: GraftComponentProps, ref: ForwardedRef<any>) => {
    return (
      <div ref={ref} style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
    );
  }
);

/**
 * A canvas on which all the components are drawn. This is the root under which
 * all the component tree lies.
 *
 * Also, as you can see, a root canvas is just a component node with `ROOT_NODE_ID`.
 */
export function Canvas() {
  // Sync the drop region whenever a cursor is dragged.
  useSyncDropRegion();

  return <ComponentNode componentId={ROOT_NODE_ID} isRoot />;
}
