/** @jsxImportSource @emotion/react */
import { CSSObject } from '@emotion/react';
import {
  ChangeEventHandler,
  DragEventHandler,
  ElementType,
  FocusEventHandler,
  forwardRef,
  MouseEventHandler,
  ReactNode,
} from 'react';
import { RGBA, rgbaToCss } from './colors';
import { FontSize, FontWeight, TextAlign } from './text';

export type BoxProps = BaseBoxProps &
  LayoutStyles &
  AppearanceStyles &
  BoundaryStyles &
  FlexStyles &
  PositionStyles &
  InteractionStyles &
  InteractionProps &
  InputStyles &
  InputProps &
  DragProps;

export type BaseBoxProps = {
  tag?: string;
  children?: ReactNode;
};

export type LayoutStyles = {
  width?: DimensionSize;
  height?: DimensionSize;
  minWidth?: DimensionMinLimit;
  maxWidth?: DimensionMaxLimit;
  minHeight?: DimensionMinLimit;
  maxHeight?: DimensionMaxLimit;
  margin?: Spacing;
  padding?: Spacing;
};

export type FlexStyles = {
  flexDirection?: FlexDirection;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  flexGrow?: number;
  flexShrink?: number;
  flexWrap?: FlexWrap;
  flexGap?: number;
};

export type AppearanceStyles = {
  opacity?: number;
  color?: RGBA;
};

export type BoundaryStyles = {
  borderRadius?: BorderRadius;
  border?: Border;
  shadow?: Shadow[];
  overflow?: Overflow;
};

export type InteractionStyles = {
  cursor?: Cursor;
  pointerEvents?: PointerEvents;
};

export type InteractionProps = {
  href?: string;
  onClick?: MouseEventHandler;
};

export type PositionStyles = {
  position?: Position;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
};

export type InputProps = {
  type?: string;
  name?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler;
  onBlur?: FocusEventHandler;
};

export type InputStyles = {
  textColor?: RGBA;
  fontSize?: FontSize;
  fontFamily?: string;
  fontWeight?: FontWeight;
  textAlign?: TextAlign;
};

export type Spacing = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type BorderRadius = {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
};

export type Border = {
  top: BorderSide;
  bottom: BorderSide;
  left: BorderSide;
  right: BorderSide;
};

export type BorderSide = {
  color: RGBA;
  style: BorderStyle;
  width: number;
};

export type DimensionSize =
  | {
      size: number;
      unit: DimensionUnit;
    }
  | 'auto';

export type DimensionMinLimit =
  | {
      size: number;
      unit: DimensionUnit;
    }
  | 'auto';

export type DimensionMaxLimit =
  | {
      size: number;
      unit: DimensionUnit;
    }
  | 'none';

export type Overflow = {
  x: OverflowBehavior;
  y: OverflowBehavior;
};

export type Shadow = {
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  spreadRadius: number;
  color: RGBA;
};

export type FlexDirection = 'column' | 'row';
export type OverflowBehavior = 'visible' | 'auto' | 'scroll' | 'hidden';
export type JustifyContent =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-between'
  | 'space-evenly';
export type AlignItems = 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
export type BorderStyle = 'solid' | 'dashed' | 'dotted';
export type DimensionUnit = 'px' | '%';
export type Position = 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky';
export type Cursor = 'pointer'; // Will need to add more as needed.
export type FlexWrap = 'wrap' | 'nowrap';
export type PointerEvents = 'auto' | 'none';

export type DragProps = {
  onDragStart?: DragEventHandler;
  onDragEnd?: DragEventHandler;
  onDragOver?: DragEventHandler;
  onDragLeave?: DragEventHandler;
  draggable?: boolean;
};

const Box = forwardRef((props: BoxProps, ref) => {
  const { tag, children } = props;
  const Component = (tag ?? 'div') as ElementType;

  return (
    <Component
      ref={ref}
      {...inputProps(props)}
      {...interactionProps(props)}
      {...dragProps(props)}
      css={{
        // Append -gr in class names rather than -Box.
        label: 'gr',
        display: 'flex',
        ...layoutStyles(props),
        ...appearanceStyles(props),
        ...boundaryStyles(props),
        ...flexStyles(props),
        ...interactionStyles(props),
        ...positionStyles(props),
        ...inputStyles(props),
      }}
    >
      {children}
    </Component>
  );
});

function layoutStyles({
  width,
  height,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  margin,
  padding,
}: LayoutStyles): CSSObject {
  return {
    width: dimensionSize(width),
    height: dimensionSize(height),
    minWidth: dimensionSize(minWidth),
    maxWidth: dimensionSize(maxWidth),
    minHeight: dimensionSize(minHeight),
    maxHeight: dimensionSize(maxHeight),
    marginLeft: margin?.left,
    marginRight: margin?.right,
    marginTop: margin?.top,
    marginBottom: margin?.bottom,
    paddingLeft: padding?.left,
    paddingRight: padding?.right,
    paddingTop: padding?.top,
    paddingBottom: padding?.bottom,
  };
}

function appearanceStyles({ color, opacity }: AppearanceStyles): CSSObject {
  return {
    backgroundColor: color ? rgbaToCss(color) : undefined,
    opacity,
  };
}

function boundaryStyles({ borderRadius, border, shadow, overflow }: BoundaryStyles): CSSObject {
  return {
    borderTop: borderStyle(border?.top),
    borderBottom: borderStyle(border?.bottom),
    borderLeft: borderStyle(border?.left),
    borderRight: borderStyle(border?.right),
    borderRadius: borderRadius
      ? `${borderRadius.topLeft ?? 0}px ${borderRadius.topRight ?? 0}px ${
          borderRadius.bottomRight
        }px ${borderRadius.bottomLeft}px`
      : undefined,
    boxShadow: shadow
      ?.map(
        (it) =>
          `${it.offsetX}px ${it.offsetY}px ${it.blurRadius}px ${it.spreadRadius}px ${rgbaToCss(
            it.color
          )}`
      )
      ?.join(', '),
    overflowX: overflow?.x,
    overflowY: overflow?.y,
  };
}

function flexStyles({
  flexDirection,
  justifyContent,
  alignItems,
  flexGrow,
  flexShrink,
  flexWrap,
  flexGap,
}: FlexStyles): CSSObject {
  return {
    flexDirection,
    justifyContent,
    alignItems,
    flexGrow,
    flexShrink,
    flexWrap,
    gap: flexGap,
  };
}

function interactionStyles({ cursor, pointerEvents }: InteractionStyles): CSSObject {
  return {
    cursor,
    pointerEvents,
  };
}

function interactionProps({ tag, href, onClick }: InteractionProps & BaseBoxProps): any {
  const props: any = {};
  if (tag === 'a') {
    props.href = href;
  }

  props.onClick = onClick;
  return props;
}

export function positionStyles({ position, top, right, bottom, left }: PositionStyles): CSSObject {
  return {
    position,
    top,
    right,
    bottom,
    left,
  };
}

function inputStyles({
  tag,
  textColor,
  textAlign,
  fontWeight,
  fontSize,
  fontFamily,
}: BaseBoxProps & InputStyles): CSSObject {
  if (tag !== 'input' && tag !== 'textarea') {
    return {};
  }

  return {
    color: textColor ? rgbaToCss(textColor) : undefined,
    fontSize: fontSize ? `${fontSize.size}${fontSize.unit}` : undefined,
    fontWeight,
    fontFamily,
    textAlign,
  };
}

function inputProps({
  tag,
  name,
  type,
  placeholder,
  onChange,
  onBlur,
}: BaseBoxProps & InputProps): any {
  if (tag !== 'input' && tag !== 'textarea') {
    return;
  }

  return {
    type,
    name,
    placeholder,
    onChange,
    onBlur,
  };
}

function borderStyle(borderSide?: BorderSide): string | undefined {
  return borderSide
    ? `${borderSide.width}px ${borderSide.style} ${rgbaToCss(borderSide.color)}`
    : undefined;
}

export function dragProps({
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  draggable,
}: DragProps): any {
  return {
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
    draggable,
  };
}

function dimensionSize(
  size?: DimensionSize | DimensionMinLimit | DimensionMaxLimit
): string | undefined {
  if (!size) {
    return undefined;
  }

  if (size === 'auto' || size === 'none') {
    return size;
  }

  return `${size.size}${size.unit}`;
}

export default Box;
