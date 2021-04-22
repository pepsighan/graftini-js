/** @jsxImportSource @emotion/react */
import { useNode } from '@craftjs/core';

export default function Text({ color, fontFamily, fontSize, fontWeight, content }) {
  const {
    connectors: { drag },
  } = useNode();

  return (
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
