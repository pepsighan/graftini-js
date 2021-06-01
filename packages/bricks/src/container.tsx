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
  AlignmentStyles &
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

export type AlignmentStyles = {
  mainAxisAlignment?: Alignment;
  crossAxisAlignment?: Alignment;
  direction?: Direction;
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
  color: RGBA;
  style: 'solid' | 'dashed' | 'dotted';
  width: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
};

export type DimensionSize = {
  size: number;
  unit: 'px' | '%';
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

export type Direction = 'column' | 'row';
export type OverflowBehavior = 'visible' | 'auto' | 'scroll' | 'hidden';
export type Alignment = 'flex-start' | 'center' | 'flex-end';

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
        ...alignmentStyles(props),
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
    borderTop: border ? borderStyle(border.width.top, border.style, border.color) : undefined,
    borderBottom: border ? borderStyle(border.width.bottom, border.style, border.color) : undefined,
    borderLeft: border ? borderStyle(border.width.left, border.style, border.color) : undefined,
    borderRight: border ? borderStyle(border.width.right, border.style, border.color) : undefined,
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

function alignmentStyles({
  direction = 'row',
  mainAxisAlignment,
  crossAxisAlignment,
}: AlignmentStyles): CSSObject {
  return {
    flexDirection: direction,
    justifyContent: direction === 'row' ? mainAxisAlignment : crossAxisAlignment,
    alignItems: direction === 'row' ? crossAxisAlignment : mainAxisAlignment,
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

function borderStyle(width: number, style: string, color: RGBA): string {
  return `${width}px ${style} ${rgbaToCss(color)}`;
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
