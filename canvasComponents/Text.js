/** @jsxImportSource @emotion/react */
import { useNode } from '@craftjs/core';
import CanvasForm from './form/CanvasForm';
import TextInput from './form/TextInput';
import Outline from './Outline';

export default function Text({ name, color, fontFamily, fontSize, fontWeight, content }) {
  const {
    connectors: { drag },
  } = useNode();

  return (
    <Outline name={name}>
      <p
        ref={drag}
        css={{
          color,
          fontFamily,
          fontWeight,
          fontSize: fontSize?.number ? `${fontSize.number}${fontSize?.unit ?? 'px'}` : null,
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
    fontFamily: 'Asar',
    fontWeight: 'regular',
    fontSize: {
      number: 16,
      unit: 'px',
    },
  },
};

Text.Options = ({ componentId }) => {
  return (
    <CanvasForm componentId={componentId}>
      <TextInput name="name" label="Name" />
    </CanvasForm>
  );
};
