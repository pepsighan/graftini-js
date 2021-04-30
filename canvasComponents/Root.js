/** @jsxImportSource @emotion/react */
import { useNode } from '@craftjs/core';
import { forwardRef } from 'react';
import { rgbaToCss } from 'utils/colors';
import CanvasForm from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';

export default function Root({ backgroundColor, children }) {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <Render ref={connect} backgroundColor={backgroundColor}>
      {children}
    </Render>
  );
}

Root.craft = {
  props: {
    backgroundColor: { r: 255, g: 255, b: 255, a: 1 },
  },
};

const Render = forwardRef(({ backgroundColor, children }, ref) => {
  return (
    <div
      ref={ref}
      css={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: rgbaToCss(backgroundColor),
        // The following padding is provided so that any nested elements do have overflow an overflowing
        // margin when it is set.
        padding: 0.1,
      }}
    >
      {children}
    </div>
  );
});

Root.Render = Render;

Root.Options = ({ componentId }) => {
  return (
    <CanvasForm componentId={componentId}>
      <ColorPicker name="backgroundColor" label="Background Color" />
    </CanvasForm>
  );
};
