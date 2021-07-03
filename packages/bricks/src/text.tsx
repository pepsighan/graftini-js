/** @jsxImportSource @emotion/react */
import { CSSObject } from '@emotion/react';
import { ElementType, FocusEventHandler, forwardRef, MouseEventHandler, ReactNode } from 'react';
import { DragProps, dragProps, EditorProps } from './box';
import { RGBA, rgbaToCss } from './colors';
import TextBody, { Content } from './textBody';

export type TextProps = BaseTextProps &
  DragProps &
  TextInteractionStyles &
  EditorTextInteractionProps &
  EditorProps;

export type BaseTextProps = {
  tag?: string;
  color?: RGBA;
  fontSize?: FontSize;
  fontFamily?: string;
  fontWeight?: FontWeight;
  textAlign?: TextAlign;
  displayNone?: boolean;
  displayInline?: boolean;
  text?: Content[];
  children?: ReactNode;
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
  onFocus?: FocusEventHandler;
  onBlur?: FocusEventHandler;
};

const Text = forwardRef(({ text, children, ...rest }: TextProps, ref) => {
  const Component = (rest.tag ?? 'div') as ElementType;

  return (
    <Component
      ref={ref}
      {...editorTextInteractionProps(rest)}
      {...dragProps(rest)}
      css={{
        // Append -gr in class names rather than -Text.
        label: 'gr',
        display: rest.displayNone ? 'none' : rest.displayInline ? 'inline' : 'block',
        width: '100%',
        ...baseStyles(rest),
        ...textInteractionStyles(rest),
      }}
    >
      {/* If children is provided render it. It may be a content editor. */}
      {children ?? <TextBody content={text ?? []} />}
    </Component>
  );
});

function baseStyles({
  color,
  fontSize,
  fontFamily,
  fontWeight,
  textAlign,
}: BaseTextProps): CSSObject {
  return {
    color: color ? rgbaToCss(color) : undefined,
    fontSize:
      typeof fontSize?.size === 'number' ? `${fontSize.size}${fontSize.unit ?? 'px'}` : undefined,
    fontWeight,
    fontFamily,
    textAlign,
  };
}

function textInteractionStyles({ cursor }: TextInteractionStyles): CSSObject {
  return {
    cursor,
  };
}

function editorTextInteractionProps({
  isEditor,
  onClick,
  onFocus,
  onBlur,
}: EditorTextInteractionProps & EditorProps): any {
  return isEditor
    ? {
        onClick,
        onFocus,
        onBlur,
      }
    : {};
}

export default Text;
