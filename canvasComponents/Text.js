/** @jsxImportSource @emotion/react */
import { useElementProps } from '@graftini/graft';
import { QueryContext } from 'components/RenderQueries';
import { render } from 'micromustache';
import { forwardRef, useCallback, useContext } from 'react';
import { rgbaToCss } from 'utils/colors';
import { parsePositiveInteger } from 'utils/parser';
import CanvasForm from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import NumberInput from './form/NumberInput';
import TextInput from './form/TextInput';

const Text = forwardRef((_, ref) => {
  const { content, ...rest } = useElementProps();

  return (
    <RenderMarkup ref={ref} {...rest}>
      {content}
    </RenderMarkup>
  );
});

Text.graftOptions = {
  defaultProps: {
    color: { r: 0, g: 0, b: 0, a: 1 },
    content: 'Lorem ipsum dolor sit amet.',
    fontSize: 16,
  },
};

const RenderMarkup = forwardRef(({ color, fontSize, children }, ref) => {
  return (
    <div
      ref={ref}
      css={{
        color: rgbaToCss(color),
        fontSize,
      }}
    >
      {children}
    </div>
  );
});

const Render = ({ color, fontSize, content }) => {
  const result = useContext(QueryContext);
  console.log(content);
  return <RenderMarkup color={color} fontSize={fontSize} children={render(content, result)} />;
};

Text.Render = Render;

function Options({ componentId }) {
  return (
    <CanvasForm
      componentId={componentId}
      onTransformValues={useCallback((values) => {
        values.fontSize = parsePositiveInteger(values.fontSize);
      }, [])}
    >
      <TextInput name="name" label="Name" />
      <NumberInput name="fontSize" label="Font Size" spaceTop />
      <ColorPicker name="color" label="Color" spaceTop />
    </CanvasForm>
  );
}

Text.Options = Options;

export default Text;
