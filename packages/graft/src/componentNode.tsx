import React, { ReactNode, useCallback } from 'react';
import { GraftComponent } from './componentTypes';
import { CanvasContext, ComponentContext, useComponentId } from './context';
import { useOnDragStart } from './drag';
import { useResolveComponent } from './resolver';
import { CreateComponentStore, useCreateComponentStore } from './store/createComponent';
import { ComponentNode as CN, EditorStore, useEditorStateInternal } from './store/editor';
import { useSyncRegion } from './useRegion';

type ComponentNodeProps = {
  componentId: string;
};

/**
 * This node renders the component with given id. The component properties are not passed through
 * as normal props. They can be accessed via hooks or subscription. Why? Because we want to give the
 * users the ability to choose whatever forms of optimizations they want.
 */
/** @internal */
export function ComponentNode({ componentId }: ComponentNodeProps) {
  const { type, isCanvas, childrenNodes } = useEditorStateInternal(
    useCallback((state: EditorStore) => state.componentMap[componentId], [componentId]),
    // Only use the selected props when they change.
    useCallback(
      (left: CN, right: CN) =>
        left.type === right.type &&
        left.isCanvas === right.isCanvas &&
        left.childrenNodes === right.childrenNodes,
      []
    )
  );
  const Component = useResolveComponent(type);

  // If the component is also a canvas, then render children nodes for it if present.
  if (isCanvas) {
    return (
      <>
        <CanvasContext.Provider value={componentId}>
          <ComponentContext.Provider value={componentId}>
            <ComponentWrapper component={Component}>
              {childrenNodes.map((componentId) => (
                <ComponentNode key={componentId} componentId={componentId} />
              ))}
            </ComponentWrapper>
          </ComponentContext.Provider>
        </CanvasContext.Provider>
      </>
    );
  }

  return (
    <ComponentContext.Provider value={componentId}>
      <ComponentWrapper component={Component} />
    </ComponentContext.Provider>
  );
}

type DragOverNotifierProps = {
  component: GraftComponent<{ ref: any }>; // Just a hack in typings.
  children?: ReactNode;
};

function ComponentWrapper({ component: Component, children }: DragOverNotifierProps) {
  const componentId = useComponentId();
  const ref = useSyncRegion(componentId);
  const isCreatingNew = useCreateComponentStore(
    useCallback((state: CreateComponentStore) => !!state.newComponent, [])
  );
  const componentProps = useEditorStateInternal(
    useCallback((state: EditorStore) => state.componentMap[componentId].props, [componentId])
  );

  const onDragStart = useOnDragStart();

  return (
    <Component ref={ref} onMouseDown={!isCreatingNew ? onDragStart : null} {...componentProps}>
      {children}
    </Component>
  );
}
