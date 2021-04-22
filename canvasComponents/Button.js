/** @jsxImportSource @emotion/react */
import { useNode } from '@craftjs/core';
import { rgbaToCss } from 'utils/colors';
import Outline from './Outline';

export default function Button({ name, padding, backgroundColor, color, children }) {
  const {
    connectors: { drag },
  } = useNode();

  return (
    <Outline name={name}>
      <button
        ref={drag}
        css={{
          display: 'block',
          width: '100%',
          paddingTop: padding?.top,
          paddingRight: padding?.right,
          paddingBottom: padding?.bottom,
          paddingLeft: padding?.left,
          backgroundColor: rgbaToCss(backgroundColor),
          color: rgbaToCss(color),
          borderRadius: 4,
          outline: 'none',
        }}
      >
        {children}
      </button>
    </Outline>
  );
}

Button.craft = {
  props: {
    padding: { top: 4, right: 4, bottom: 4, left: 4 },
    backgroundColor: { r: 220, g: 220, b: 255, a: 1 },
    color: { r: 0, g: 0, b: 0, a: 1 },
    children: 'Button',
  },
};
