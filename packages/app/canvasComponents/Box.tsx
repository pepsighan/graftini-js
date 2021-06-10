import {
  AlignItems,
  Border,
  BorderRadius,
  Box as BoxComp,
  Cursor,
  DimensionMaxLimit,
  DimensionMinLimit,
  FlexDirection,
  FlexWrap,
  JustifyContent,
  Overflow,
  RGBA,
  Shadow,
  Spacing,
} from 'bricks';
import { GraftComponent, useComponentId } from 'graft';
import { useBoxTransformedProps } from 'hooks/useBoxTransformedProps';
import useUnselectOnDragStart from 'hooks/useUnselectOnDragStart';
import { forwardRef, ReactNode, useCallback } from 'react';
import { useCanvasClickTrigger } from 'store/canvasClickTrigger';
import { useDesignerState } from 'store/designer';
import { BoxTag } from 'utils/constants';
import { BoxDimension } from './BoxOptions';

export type BoxComponentProps = {
  name?: string;
  tag: BoxTag;
  width: BoxDimension;
  height: BoxDimension;
  minWidth: DimensionMinLimit;
  maxWidth: DimensionMaxLimit;
  minHeight: DimensionMinLimit;
  maxHeight: DimensionMaxLimit;
  padding: Spacing;
  margin: Spacing;
  color: RGBA;
  justifyContent: JustifyContent;
  alignItems: AlignItems;
  opacity: number;
  shadow: Shadow[];
  border?: Border;
  borderRadius?: BorderRadius;
  cursor?: Cursor;
  overflow?: Overflow;
  flexDirection: FlexDirection;
  flexGrow: number;
  flexShrink: number;
  flexWrap: FlexWrap;
  flexGap: number;
  children?: ReactNode;
};

const Box: GraftComponent<BoxComponentProps> = forwardRef(
  ({ children, draggable, onDragStart, onDragEnd, onDragOver, onDrag, ...rest }, ref) => {
    const componentId = useComponentId();
    const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));
    const triggerClick = useCanvasClickTrigger(useCallback((state: any) => state.trigger, []));

    return (
      <BoxComp
        ref={ref}
        {...useBoxTransformedProps(rest)}
        draggable={draggable}
        onDragStart={useUnselectOnDragStart(onDragStart)}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        onDrag={onDrag}
        onClick={useCallback(
          (ev) => {
            ev.stopPropagation();
            // We need to trigger a click to be notified because we are stopping propagation.
            // Stopping propagation is also needed for us to select the top most component.
            triggerClick();
            return selectComponent(componentId);
          },
          [componentId, selectComponent, triggerClick]
        )}
      >
        {children}
      </BoxComp>
    );
  }
);

Box.graftOptions = {
  // The default props defines all the props that the box can accept exhaustively.
  // This field is used by the update options logic.
  defaultProps: {
    name: null,
    tag: 'div',
    // The width and height will be given by the user when they draw it on the
    // screen.
    width: null,
    height: null,
    minWidth: 'auto',
    maxWidth: 'none',
    minHeight: 'auto',
    maxHeight: 'none',
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color: { r: 111, g: 0, b: 255, a: 0.2 },
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    opacity: 1,
    shadow: [],
    border: null,
    borderRadius: {
      topLeft: 0,
      topRight: 0,
      bottomLeft: 0,
      bottomRight: 0,
    },
    cursor: null,
    overflow: {
      x: 'visible',
      y: 'visible',
    },
    flexDirection: 'column',
    flexGrow: 0,
    flexShrink: 0,
    flexWrap: 'nowrap',
    flexGap: 0,
  },
};

export default Box;
