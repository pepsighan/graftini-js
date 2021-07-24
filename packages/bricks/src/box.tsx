/** @jsxImportSource @emotion/react */
import { CSSObject } from '@emotion/react';
import router from 'next/router';
import {
  ChangeEventHandler,
  ElementType,
  FocusEventHandler,
  forwardRef,
  MouseEvent,
  MouseEventHandler,
  ReactNode,
  useCallback,
} from 'react';
import { RGBA, rgbaToCss } from './colors';
import { FontSize, FontWeight, TextAlign } from './text';

export type BoxProps = BaseBoxProps &
  LayoutStyles &
  AppearanceStyles &
  BackgroundImageStyles &
  BoundaryStyles &
  FlexStyles &
  PositionStyles &
  InteractionStyles &
  InteractionProps &
  InputStyles &
  InputProps &
  EditorProps &
  DragProps &
  EditorInteractionProps;

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
  displayNone?: boolean;
};

export type BackgroundImageStyles = {
  imageUrl?: string;
  backgroundFit?: BackgroundFit;
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
  /** To is same as href but for internal links */
  to?: string;
  /** For external links. */
  href?: string;
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
export type DimensionUnit = 'px' | '%' | 'vw' | 'vh';
export type Position = 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky';
export type Cursor = 'pointer'; // Will need to add more as needed.
export type FlexWrap = 'wrap' | 'nowrap';
export type PointerEvents = 'auto' | 'none';
export type BackgroundFit = 'contain' | 'cover';

export type EditorProps = {
  /**
   * If this is true, then the following [EditorInteractionProps] & [DragProps]
   * will be ignored.
   */
  isEditor?: boolean;
};

export type EditorInteractionProps = {
  onClick?: MouseEventHandler;
  onContextMenu?: MouseEventHandler;
};

export type DragProps = {
  onMouseDown?: MouseEventHandler;
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
      {...editorInteractionProps(props)}
      css={{
        // Append -gr in class names rather than -Box.
        label: 'gr',
        display: 'flex',
        ...layoutStyles(props),
        ...appearanceStyles(props),
        ...backgroundImageStyles(props),
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

function appearanceStyles({ color, opacity, displayNone }: AppearanceStyles): CSSObject {
  const styles: CSSObject = {
    backgroundColor: color ? rgbaToCss(color) : undefined,
    opacity,
  };

  if (displayNone) {
    styles.display = 'none';
  }

  return styles;
}

function backgroundImageStyles({ imageUrl, backgroundFit: fit }: BackgroundImageStyles): CSSObject {
  return {
    backgroundImage: imageUrl ? `url("${imageUrl}")` : undefined,
    backgroundSize: imageUrl ? fit : undefined,
    backgroundPosition: 'center',
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

function interactionStyles({
  cursor,
  pointerEvents,
  to,
  href,
  isEditor,
}: InteractionStyles & InteractionProps & EditorProps): CSSObject {
  return {
    // If the cursor is provided, then use it. Otherwise if there is
    // to or href link then it needs to be pointer by default.
    cursor: cursor ?? ((to || href) && !isEditor ? 'pointer' : undefined),
    pointerEvents,
  };
}

export function interactionProps({
  tag,
  href,
  to,
  isEditor,
}: InteractionProps & BaseBoxProps & EditorProps): any {
  if (isEditor) {
    return {};
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const onClick = useCallback(
    (ev: MouseEvent) => {
      ev.preventDefault();
      if (to) {
        router.push(to!);
      }
      if (href) {
        router.push(href);
      }
    },
    [href, to]
  );

  const obj: any = {
    onClick: to || href ? onClick : undefined,
  };

  if (tag === 'a') {
    obj.href = to || href;
  }

  return obj;
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

export function dragProps({ isEditor, onMouseDown }: EditorProps & DragProps): any {
  if (!isEditor) {
    return {};
  }

  return {
    onMouseDown,
  };
}

function editorInteractionProps({
  isEditor,
  onClick,
  onContextMenu,
}: EditorProps & EditorInteractionProps): any {
  if (!isEditor) {
    return {};
  }

  return {
    onClick,
    onContextMenu,
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
