/** @jsxImportSource @emotion/react */
import { CSSObject } from '@emotion/react';
import { ElementType, FocusEventHandler, forwardRef, MouseEventHandler, ReactNode } from 'react';
import {
  dimensionSize,
  DimensionSize,
  DragProps,
  dragProps,
  EditorProps,
  interactionProps,
  InteractionProps,
} from './box';
import { RGBA, rgbaToCss } from './colors';
import TextBody, { ProseMirrorDocument } from './textBody';

export type TextProps = BaseTextProps &
  TextAppearanceStyles &
  TextLayoutStyles &
  DragProps &
  InteractionProps &
  TextInteractionStyles &
  EditorTextInteractionProps &
  EditorProps;

export type BaseTextProps = {
  tag?: string;
  content?: ProseMirrorDocument;
  children?: ReactNode;
};

export type TextAppearanceStyles = {
  color?: RGBA;
  fontSize?: FontSize;
  fontFamily?: string;
  fontWeight?: FontWeight;
  textAlign?: TextAlign;
  displayNone?: boolean;
  displayInline?: boolean;
};

export type TextLayoutStyles = {
  width?: DimensionSize;
  height?: DimensionSize;
};

export type FontSize = {
  size: number;
  unit: FontSizeUnit;
};

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type FontSizeUnit = 'px' | 'rem';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export type TextInteractionStyles = {
  cursor?: string;
};

export type EditorTextInteractionProps = {
  onClick?: MouseEventHandler;
  onDoubleClick?: MouseEventHandler;
  onContextMenu?: MouseEventHandler;
  onFocus?: FocusEventHandler;
  onBlur?: FocusEventHandler;
};

const Text = forwardRef(({ content, children, ...rest }: TextProps, ref) => {
  const Component = (rest.tag ?? 'div') as ElementType;

  return (
    <Component
      ref={ref}
      {...editorTextInteractionProps(rest)}
      {...dragProps(rest)}
      {...interactionProps(rest)}
      css={{
        // Append -gr in class names rather than -Text.
        label: 'gr',
        display: rest.displayNone ? 'none' : rest.displayInline ? 'inline' : 'block',
        overflow: 'hidden',
        // This is require to add trailing spaces while typing in Firefox. We need
        // to show the same styles to render it as well.
        whiteSpace: 'pre-wrap',
        ...textAppearanceStyles(rest),
        ...textInteractionStyles(rest),
        ...textLayoutStyles(rest),
      }}
    >
      {/* If children is provided render it. It may be a content editor. */}
      {children ?? (content ? <TextBody content={content} isEditor={rest.isEditor} /> : null)}
    </Component>
  );
});

function textAppearanceStyles({
  color,
  fontSize,
  fontFamily,
  fontWeight,
  textAlign,
}: TextAppearanceStyles): CSSObject {
  return {
    color: color ? rgbaToCss(color) : undefined,
    fontSize:
      typeof fontSize?.size === 'number' ? `${fontSize.size}${fontSize.unit ?? 'px'}` : undefined,
    fontWeight,
    fontFamily,
    textAlign,
  };
}

function textLayoutStyles({ width, height }: TextLayoutStyles): CSSObject {
  return {
    width: dimensionSize(width),
    height: dimensionSize(height),
  };
}

function textInteractionStyles({
  cursor,
  to,
  href,
}: TextInteractionStyles & InteractionProps): CSSObject {
  return {
    cursor,
    // TODO: Let the theme define the style for links.
    textDecoration: to || href ? 'underline' : undefined,
  };
}

function editorTextInteractionProps({
  isEditor,
  onClick,
  onDoubleClick,
  onContextMenu,
  onFocus,
  onBlur,
}: EditorTextInteractionProps & EditorProps): any {
  return isEditor
    ? {
        onClick,
        onDoubleClick,
        onContextMenu,
        onFocus,
        onBlur,
      }
    : {};
}

export default Text;
