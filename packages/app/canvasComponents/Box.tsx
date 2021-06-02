import {
  AlignItems,
  Border,
  BorderRadius,
  Box as BoxComp,
  Cursor,
  DimensionLimit,
  FlexDirection,
  FlexWrap,
  JustifyContent,
  Overflow,
  RGBA,
  Shadow,
  Spacing,
} from 'bricks';
import { GraftComponent, useComponentId } from 'graft';
import { ReactNode, useCallback, useRef } from 'react';
import { BoxDimension } from './BoxOptions';
import { useBoxTransformedProps } from './BoxRender';
import Outline, { useSelectComponent } from './Outline';

export type BoxComponentProps = {
  name?: string;
  tag: BoxTag;
  width: BoxDimension;
  height: BoxDimension;
  minWidth: DimensionLimit;
  maxWidth: DimensionLimit;
  minHeight: DimensionLimit;
  maxHeight: DimensionLimit;
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

const Box: GraftComponent<BoxComponentProps> = ({
  children,
  draggable,
  onDragStart,
  onDragOver,
  onDragLeave,
  ...rest
}) => {
  const componentId = useComponentId();

  const ref = useRef();
  const selectComponent = useSelectComponent();

  return (
    <>
      <BoxComp
        ref={ref}
        {...useBoxTransformedProps(rest)}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={useCallback(
          (ev) => {
            ev.stopPropagation();
            return selectComponent(componentId);
          },
          [componentId, selectComponent]
        )}
      >
        {children}
      </BoxComp>
      <Outline componentRef={ref} />
    </>
  );
};

Box.graftOptions = {
  // The default props defines all the props that the box can accept exhaustively.
  // This field is used by the update options logic.
  defaultProps: {
    name: null,
    tag: 'div',
    width: {
      size: 100,
      unit: '%',
    },
    height: {
      size: 200,
      unit: 'px',
    },
    minWidth: 'none',
    maxWidth: 'none',
    minHeight: 'none',
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
  isCanvas: true,
  display: 'block',
};

export default Box;

export type BoxTag =
  | 'div'
  | 'span'
  | 'main'
  | 'button'
  | 'section'
  | 'input'
  | 'select'
  | 'checkbox'
  | 'header'
  | 'footer';

export const boxTags: BoxTag[] = [
  'div',
  'span',
  'button',
  'input',
  'select',
  'checkbox',
  'main',
  'section',
  'header',
  'footer',
];
