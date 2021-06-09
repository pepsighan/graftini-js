import { useMergeRefs } from '@chakra-ui/hooks';
import { Box as CBox } from '@chakra-ui/react';
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
import { forwardRef, ReactNode, useCallback, useRef } from 'react';
import { BoxDimension } from './BoxOptions';
import { useBoxTransformedProps } from './BoxRender';
import Selection, { useSelectComponent } from './Selection';
import useUnselectOnDragStart from './useUnselectOnDragStart';

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
  ({ children, draggable, onDragStart, onDragEnd, onDragOver, onDrag, ...rest }, forwardedRef) => {
    const componentId = useComponentId();

    const ref = useRef();
    const mergedRef = useMergeRefs(ref, forwardedRef);

    const selectComponent = useSelectComponent();

    return (
      <>
        <BoxComp
          ref={mergedRef}
          {...useBoxTransformedProps(rest)}
          draggable={draggable}
          onDragStart={useUnselectOnDragStart(onDragStart)}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDrag={onDrag}
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
        <Selection componentRef={ref} />
      </>
    );
  }
);

function Preview() {
  return <CBox width={200} height={100} borderRadius="md" bg="primary.300" />;
}

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
  preview: Preview,
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
