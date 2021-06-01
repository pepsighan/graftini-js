import React, { ReactNode, useCallback } from 'react';
import { CanvasContext, ComponentContext, useComponentId } from './context';
import { useOnComponentDrag } from './drag';
import { useIdentifyCurrentDropLocation } from './dropLocation';
import { DropMarker, DropMarkerCanvasEmpty } from './dropMarker';
import { GraftComponent, GraftComponentProps, useResolver } from './resolver';
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
              {/* When there are no children, and there are no children here. Show a marker 
              in the insides. This will help is marking a component which is also a canvas.*/}
              {childrenNodes.length === 0 && <DropMarkerCanvasEmpty />}

              {childrenNodes.map((componentId) => (
                <ComponentNode key={componentId} componentId={componentId} />
              ))}
            </ComponentWrapper>
          </ComponentContext.Provider>
        </CanvasContext.Provider>

        {/* Show a drop marker when a canvas is hovered over after it. All of the canvas after components will
        become activated when there is an ongoing drag operation.
        
        Also, if this is a root component then nothing after it can be added. Only children can be added. */}
        {!isRoot && (
          // Provided the component Id here so that the dropped item is added after this component but for the
          // parent canvas.
          <ComponentContext.Provider value={componentId}>
            <ComponentWrapper component={CanvasAfter} componentProps={{}}>
              <DropMarker />
            </ComponentWrapper>
          </ComponentContext.Provider>
        )}
      </>
    );
  }

  return (
    <ComponentContext.Provider value={componentId}>
      <ComponentWrapper component={Component} componentProps={componentProps} />
      {/* This is a drop marker to position the drop location just after the component. */}
      <DropMarker />
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
  const [onDragOver, onDragLeave] = useIdentifyCurrentDropLocation();
  const onDragStart = useOnComponentDrag();

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
      onDragOver={!isDragging ? onDragOver : undefined}
      onDragLeave={!isDragging ? onDragLeave : undefined}
      draggable
      {...componentProps}
    >
      {children}
    </Component>
  );
}

/**
 * A container after the canvas which enables a drop location to add component after it.
 * This won't be visible until a drag operation is active.
 */
function CanvasAfter({ onDragOver, onDragLeave, children }: GraftComponentProps) {
  const componentId = useComponentId();

  const isDragging = useEditorStateInternal(
    useCallback(
      (state) =>
        state.draggedOver.isDragging &&
        // The component cannot be dropped after itself. It has no meaning really.
        state.draggedOver.component?.id !== componentId,
      [componentId]
    )
  );

  return (
    <div
      style={{ width: '100%', height: isDragging ? 100 : 0 }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      {children}
    </div>
  );
}
