/** @jsxImportSource @emotion/react */
import { useNode } from '@craftjs/core';
import { useCallback } from 'react';
import { rgbaToCss } from 'utils/colors';
import { parsePositiveInteger } from 'utils/parser';
import CanvasForm from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import NumberInput from './form/NumberInput';
import TextInput from './form/TextInput';
import Outline from './Outline';

export default function Text({ name, color, fontSize, content }) {
  const {
    connectors: { drag },
  } = useNode();

  return (
    <Outline name={name}>
      <p
        ref={drag}
        css={{
          color: rgbaToCss(color),
          fontSize,
          margin: 0,
        }}
      >
        {content}
      </p>
    </Outline>
  );
}

Text.craft = {
  props: {
    color: { r: 0, g: 0, b: 0, a: 1 },
    content: 'Lorem ipsum dolor sit amet.',
    fontSize: 16,
  },
};

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
