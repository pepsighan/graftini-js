import React, { ReactNode, useCallback } from 'react';
import { CanvasContext, ComponentContext, useComponentId } from './context';
import { useOnDrag, useOnDragEnd, useOnDragOver, useOnDragStart } from './drag';
import { GraftComponent, useResolver } from './resolver';
import { ComponentProps, EditorStore, useEditorStateInternal } from './store/editor';
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
  const { type, props, isCanvas, childrenNodes } = useEditorStateInternal(
    useCallback((state: EditorStore) => state.componentMap[componentId], [componentId])
  );
  const Component = useResolver(type);

  // If the component is also a canvas, then render children nodes for it if present.
  if (isCanvas) {
    return (
      <>
        <CanvasContext.Provider value={componentId}>
          <ComponentContext.Provider value={componentId}>
            <ComponentWrapper component={Component} componentProps={props}>
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
      <ComponentWrapper component={Component} componentProps={props} />
    </ComponentContext.Provider>
  );
}

type DragOverNotifierProps = {
  component: GraftComponent<unknown>;
  componentProps: ComponentProps;
  children?: ReactNode;
};

function ComponentWrapper({
  component: Component,
  componentProps,
  children,
}: DragOverNotifierProps) {
  const ref = useSyncRegion(useComponentId());

  const onDragStart = useOnDragStart();
  const onDrag = useOnDrag();
  const onDragEnd = useOnDragEnd();
  const onDragOver = useOnDragOver();

  return (
    <Component
      ref={ref as any}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      draggable
      {...componentProps}
    >
      {children}
    </Component>
  );
}
