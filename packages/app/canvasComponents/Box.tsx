import {
  AlignItems,
  Border,
  BorderRadius,
  Box as BoxComp,
  Cursor,
  DimensionMaxLimit,
  DimensionMinLimit,
  DimensionSize,
  FlexDirection,
  FlexWrap,
  JustifyContent,
  Overflow,
  RGBA,
  Shadow,
  Spacing,
} from '@graftini/bricks';
import { GraftComponent, useComponentId } from '@graftini/graft';
import { ComponentContextMenuContext } from 'components/editor/ComponentContextMenu';
import { forwardRef, ReactNode, useCallback, useContext, MouseEvent } from 'react';
import { useDesignerState, useIsDraggingDisabled } from 'store/designer';
import { BoxTag } from 'utils/constants';

export type BoxComponentProps = {
  name?: string;
  tag: BoxTag;
  width: DimensionSize;
  height: DimensionSize;
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
  link?: {
    pageId?: string;
    href?: string;
  };
};

const Box: GraftComponent<BoxComponentProps> = forwardRef(
  ({ children, onMouseDown, link, ...rest }, ref) => {
    const componentId = useComponentId();
    const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));

    const isDraggingDisabled = useIsDraggingDisabled();

    // Merge the incoming props with the default props so that any new props introduced in
    // the future get supported easily for existing projects.
    const boxProps = {
      ...Box.graftOptions.defaultProps,
      ...rest,
    };

    const onSelection = useCallback(
      (event: MouseEvent) => {
        event.stopPropagation();
        selectComponent(componentId);
      },
      [componentId, selectComponent]
    );

    const { onOpenContextMenu } = useContext(ComponentContextMenuContext);
    const onContextMenu = useCallback(
      (event: MouseEvent) => {
        event.stopPropagation();
        onOpenContextMenu(event);
        selectComponent(componentId);
      },
      [componentId, onOpenContextMenu, selectComponent]
    );

    return (
      <BoxComp
        ref={ref}
        {...boxProps}
        isEditor
        onMouseDown={!isDraggingDisabled ? onMouseDown : null}
        onClick={onSelection}
        onContextMenu={onContextMenu}
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
    name: 'Box',
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
    link: null,
  },
};

export default Box;
