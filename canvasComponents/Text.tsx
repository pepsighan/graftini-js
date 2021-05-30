/** @jsxImportSource @emotion/react */
import {
  FontSize,
  FontWeight,
  RGBA,
  Text as Txt,
  TextAlign,
  TextProps,
} from '@graftini/components';
import { GraftComponent, useComponentProps } from '@graftini/graft';
import Outline from './Outline';

export type TextComponentProps = {
  color?: RGBA;
  content?: string;
  fontSize?: FontSize;
  fontFamily?: string;
  fontWeight?: FontWeight;
  textAlign?: TextAlign;
};

const Text: GraftComponent = (props) => {
  const { content, ...rest }: TextComponentProps = useComponentProps();
  return (
    <Outline>
      <div {...props} style={{ width: '100%' }}>
        <Txt {...rest}>{content}</Txt>
      </div>
    </Outline>
  );
};

Text.graftOptions = {
  defaultProps: {
    color: { r: 0, g: 0, b: 0, a: 1 },
    content: 'Lorem ipsum dolor sit amet.',
    fontSize: {
      size: 16,
      unit: 'px',
    },
    fontFamily: 'sans-serif',
    fontWeight: 400, // normal weight.
    textAlign: 'left',
  } as TextProps,
};

export default Text;
