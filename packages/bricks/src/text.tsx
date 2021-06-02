/** @jsxImportSource @emotion/react */
import { CSSObject } from '@emotion/react';
import { ElementType, forwardRef, MouseEventHandler, ReactNode } from 'react';
import { RGBA, rgbaToCss } from './colors';
import { DragProps, dragProps } from './container';

export type TextProps = BaseTextProps & DragProps & TextInteractionProps & TextInteractionProps;

export type BaseTextProps = {
  tag?: string;
  color?: RGBA;
  fontSize?: FontSize;
  fontFamily?: string;
  fontWeight?: FontWeight;
  textAlign?: TextAlign;
  children?: ReactNode;
};

export type FontSize = {
  size: number;
  unit: FontSizeUnit;
};

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type FontSizeUnit = 'px' | 'rem';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export type TextInteractionProps = {
  onClick?: MouseEventHandler;
};

const Text = forwardRef((props: TextProps, ref) => {
  const Component = (props.tag ?? 'div') as ElementType;
  return (
    <Component
      ref={ref}
      {...dragProps(props)}
      onClick={props.onClick}
      css={{
        // Append -gr in class names rather than -Text.
        label: 'gr',
        display: 'block',
        width: '100%',
        ...baseStyles(props),
      }}
    >
      {props.children}
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

export default Text;