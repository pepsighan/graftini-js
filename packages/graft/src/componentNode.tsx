import React, { ReactNode, useCallback } from 'react';
import { CanvasContext, ComponentContext, useComponentId } from './context';
import { useOnDragEnd, useOnDragStart } from './drag';
import { useIdentifyCurrentDropLocation } from './dropLocation';
import { GraftComponent, useResolver } from './resolver';
import { ComponentProps, useEditorStateInternal } from './schema';

type ComponentNodeProps = {
  componentId: string;
  isRoot?: boolean;
};

/**
 * This node renders the component with given id. The component properties are not passed through
 * as normal props. They can be accessed via hooks or subscription. Why? Because we want to give the
 * users the ability to choose whatever forms of optimizations they want.
 */
/** @internal */
export function ComponentNode({ componentId, isRoot }: ComponentNodeProps) {
  const component = useEditorStateInternal(
    useCallback((state) => state.componentMap[componentId].type, [componentId])
  );
  const Component = useResolver(component);

  const componentProps = useEditorStateInternal(
    useCallback((state) => state.componentMap[componentId].props, [componentId])
  );

  const isCanvas = useEditorStateInternal(
    useCallback((state) => state.componentMap[componentId].isCanvas, [componentId])
  );

  const childrenNodes = useEditorStateInternal(
    useCallback((state) => state.componentMap[componentId].childrenNodes, [componentId])
  ) as string[];

  // If the component is also a canvas, then render children nodes for it if present.
  if (isCanvas) {
    return (
      <>
        <CanvasContext.Provider value={componentId}>
          <ComponentContext.Provider value={componentId}>
            <ComponentWrapper component={Component} componentProps={componentProps}>
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
      <ComponentWrapper component={Component} componentProps={componentProps} />
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
  const onDragOver = useIdentifyCurrentDropLocation();
  const onDragStart = useOnDragStart();
  const onDragEnd = useOnDragEnd();

  const comonentId = useComponentId();
  const isDragging = useEditorStateInternal(
    useCallback(
      (state) => state.draggedOver.isDragging && state.draggedOver.component?.id === comonentId,
      [comonentId]
    )
  );

  // Root components are not draggable.
  return (
    <Component
      onDragStart={onDragStart}
      // Do not let it to be dropped at the same location.
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      draggable
      hidden={isDragging}
      {...componentProps}
    >
      {children}
    </Component>
  );
}
