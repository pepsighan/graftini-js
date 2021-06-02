/** @jsxImportSource @emotion/react */
import { CSSObject } from '@emotion/react';
import { Property } from 'csstype';
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

export type ContainerProps = BaseComponentProps &
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

export type BaseComponentProps = {
  tag?: string;
  children?: ReactNode;
};

export type LayoutStyles = {
  width?: DimensionSize;
  height?: DimensionSize;
  margin?: Spacing;
  padding?: Spacing;
};

export type FlexStyles = {
  flexDirection?: FlexDirection;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  flexGrow?: number;
  flexShrink?: number;
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
  cursor?: Property.Cursor;
};

export type InteractionProps = {
  href?: string;
  onClick?: MouseEventHandler;
};

export type PositionStyles = {
  position?: Property.Position;
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
  top?: BorderSide;
  bottom?: BorderSide;
  left?: BorderSide;
  right?: BorderSide;
};

export type BorderSide = {
  color: RGBA;
  style: BorderStyle;
  width: number;
};

export type DimensionSize = {
  size: number;
  unit: DimensionUnit;
};

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
export type AlignItems = 'flex-start' | 'center' | 'flex-end';
export type BorderStyle = 'solid' | 'dashed' | 'dotted';
export type DimensionUnit = 'px' | '%';

export type DragProps = {
  onDragStart?: DragEventHandler;
  onDragOver?: DragEventHandler;
  onDragLeave?: DragEventHandler;
  draggable?: boolean;
};

const Container = forwardRef((props: ContainerProps, ref) => {
  const { tag, children } = props;
  const Component = (tag ?? 'div') as ElementType;

  return (
    <Component
      ref={ref}
      {...inputProps(props)}
      {...interactionProps(props)}
      {...dragProps(props)}
      css={{
        // Append -gr in class names rather than -Container.
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

function layoutStyles({ width, height, margin, padding }: LayoutStyles): CSSObject {
  return {
    width: width ? `${width.size}${width.unit}` : undefined,
    height: height ? `${height.size}${height.unit}` : undefined,
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
}: FlexStyles): CSSObject {
  return {
    flexDirection,
    justifyContent,
    alignItems,
    flexGrow,
    flexShrink,
  };
}

function interactionStyles({ cursor }: InteractionStyles): CSSObject {
  return {
    cursor,
  };
}

function interactionProps({ tag, href, onClick }: InteractionProps & BaseComponentProps): any {
  const props: any = {};
  if (tag === 'a') {
    props.href = href;
  }

  props.onClick = onClick;
  return props;
}

function positionStyles({ position, top, right, bottom, left }: PositionStyles): CSSObject {
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
}: BaseComponentProps & InputStyles): CSSObject {
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
}: BaseComponentProps & InputProps): any {
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

export function dragProps({ onDragStart, onDragOver, onDragLeave, draggable }: DragProps): any {
  return {
    onDragStart,
    onDragOver,
    onDragLeave,
    draggable,
  };
}

export default Container;
