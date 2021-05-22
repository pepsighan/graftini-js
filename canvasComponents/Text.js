/** @jsxImportSource @emotion/react */
import { useComponentProps } from '@graftini/graft';
import { useCallback } from 'react';
import { rgbaToCss } from 'utils/colors';
import { parsePositiveInteger } from 'utils/parser';
import CanvasForm from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import NumberInput from './form/NumberInput';
import TextInput from './form/TextInput';
import Outline from './Outline';

function Text(props) {
  const { content, color, fontSize } = useComponentProps();

  return (
    <Outline>
      <div drag {...props} style={{ color: rgbaToCss(color), fontSize }}>
        {content}
      </div>
    </Outline>
  );
}

Text.Options = function Options({ componentId }) {
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
};

Text.graftOptions = {
  defaultProps: {
    color: { r: 0, g: 0, b: 0, a: 1 },
    content: 'Lorem ipsum dolor sit amet.',
    fontSize: 16,
  },
};

export default Text;
