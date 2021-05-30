/** @jsxImportSource @emotion/react */
import { Text as Txt } from '@graftini/components';
import { useComponentProps } from '@graftini/graft';
import Outline from './Outline';

function Text(props) {
  const { content, ...rest } = useComponentProps();

  return (
    <Outline>
      <div {...props} style={{ width: '100%' }}>
        <Txt {...rest}>{content}</Txt>
      </div>
    </Outline>
  );
}

Text.graftOptions = {
  defaultProps: {
    color: { r: 0, g: 0, b: 0, a: 1 },
    content: 'Lorem ipsum dolor sit amet.',
    fontSize: {
      size: 16,
      unit: 'px',
    },
    fontFamily: 'sans-serif',
    fontWeight: '400', // normal weight.
    textAlign: 'left',
  },
};

Text.Render = ({ content, ...rest }) => {
  return <Txt {...rest}>{content}</Txt>;
};

export default Text;
