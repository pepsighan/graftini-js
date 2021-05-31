/** @jsxImportSource @emotion/react */
import { FontSize, FontWeight, RGBA, Text as Txt, TextAlign } from '@graftini/components';
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
  // The default props defines all the props that the component can accept exhaustively.
  // This field is used by the update options logic.
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
  } as TextComponentProps,
};

export default Text;
