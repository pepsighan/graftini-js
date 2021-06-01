import React, { createContext, useCallback, useContext } from 'react';
import { useCanvasId, useComponentId } from './context';
import { DraggedOver, useEditorStateInternal } from './schema';

export type RenderDropMarkerProps = {
  /**
   * The dimensions of the component or canvas that is currently hovered during a drag operation.
   * This only has value when this drop marker is active.
   */
  dimensions?: {
    width: number;
    height: number;
  } | null;
  /**
   * The kind of component that is currently hovered on. This is provided by you when creating
   * a component in Tool.
   */
  display: 'block' | 'inline';
  /**
   * Whether this drop marker is active. This is active when a dragged component is hovering on
   * top of the location.
   */
  isActive: boolean;
};

export type RenderDropMarker = (props: RenderDropMarkerProps) => JSX.Element;

const DropMarkerContext = createContext<RenderDropMarker | null>(null);
/** @internal */
export const DropMarkerProvider = DropMarkerContext.Provider;

/**
 * This is a component which signifies the drop location of an element that is being dragged.
 * It is shown whenever the pointer is in drag mode and the component preceding it is hovered.
 */
/** @internal */
export function DropMarker() {
  const canvasId = useCanvasId();
  const componentId = useComponentId();

  return (
    <DropMarkerInner
      activeWhen={useCallback(
        (draggedOver) => draggedOver.canvasId === canvasId && draggedOver.siblingId === componentId,
        [canvasId, componentId]
      )}
    />
  );
}

/**
 * A drop marker for a canvas when it is empty to show that a component can be added here. For non-empty
 * canvases, a normal drop marker adjacent to the child component work.
 */
/** @internal */
export function DropMarkerCanvasEmpty() {
  const canvasId = useCanvasId();

  return (
    <DropMarkerInner
      activeWhen={useCallback(
        (draggedOver) => draggedOver.canvasId === canvasId && !draggedOver.siblingId,
        [canvasId]
      )}
    />
  );
}

type DropMarkerInnerProps = {
  activeWhen: (draggedOver: DraggedOver) => boolean;
};

function DropMarkerInner({ activeWhen }: DropMarkerInnerProps) {
  const componentId = useComponentId();
  const display = useEditorStateInternal(
    useCallback((state) => state.componentMap[componentId].display, [componentId])
  );

  const isActive = useEditorStateInternal(
    useCallback((state) => activeWhen(state.draggedOver), [activeWhen])
  );

  const dimensions = useEditorStateInternal(
    useCallback((state) => (isActive ? state.draggedOver.dimensions : null), [isActive])
  );

  const RenderDropMarker = useContext(DropMarkerContext)!;
  return <RenderDropMarker display={display} isActive={isActive} dimensions={dimensions} />;
}

/** @internal */
export function DefaultDropMarker({ dimensions, isActive, display }: RenderDropMarkerProps) {
  const margin = isActive ? 8 : 0;
  const crossAxisDimension = (display === 'block' ? dimensions?.width : dimensions?.height) ?? 0;
  const mainAxisDimension = isActive ? 12 : 0;

  return (
    <>
      {display === 'block' ? (
        <div
          style={{
            width: crossAxisDimension,
            height: mainAxisDimension,
            backgroundColor: '#9090DD',
            marginTop: margin,
            marginBottom: margin,
            pointerEvents: 'none',
          }}
        />
      ) : (
        <div
          style={{
            display: 'inline-block',
            position: 'relative',
            marginLeft: margin,
            marginRight: margin,
            width: mainAxisDimension,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              position: 'absolute',
              width: mainAxisDimension,
              height: crossAxisDimension,
              backgroundColor: '#9090DD',
              transform: 'translateY(-60%)',
            }}
          />
        </div>
      )}
    </>
  );
}
