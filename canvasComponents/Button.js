/** @jsxImportSource @emotion/react */
import { useNode } from '@craftjs/core';
import { rgbaToCss } from 'utils/colors';

export default function Button({ padding, backgroundColor, color, children }) {
  const {
    connectors: { drag },
  } = useNode();

  return (
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
