/** @jsxImportSource @emotion/react */
import { useNode } from '@craftjs/core';
import { rgbaToCss } from 'utils/colors';

export default function Root({ backgroundColor, children }) {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <div
      ref={connect}
      css={{
        width: '100%',
        height: '100%',
        backgroundColor: rgbaToCss(backgroundColor),
        // The following padding is provided so that any nested elements do have overflow an overflowing
        // margin when it is set.
        padding: 0.1,
      }}
    >
      {children}
    </div>
  );
}

Root.craft = {
  props: {
    backgroundColor: { r: 255, g: 255, b: 255, a: 1 },
  },
};
