/** @jsxImportSource @emotion/react */
import { forwardRef } from 'react';
import { rgbaToCss } from 'utils/colors';
import CanvasForm from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import TextInput from './form/TextInput';

const Button = forwardRef(({ name, children, ...rest }, ref) => {
  return (
    <Render ref={ref} {...rest}>
      {children}
    </Render>
  );
});

Button.graftOptions = {
  defaultProps: {
    padding: { top: 4, right: 4, bottom: 4, left: 4 },
    backgroundColor: { r: 220, g: 220, b: 255, a: 1 },
    color: { r: 0, g: 0, b: 0, a: 1 },
    children: 'Button',
  },
};

const Render = forwardRef(({ padding, backgroundColor, color, children }, ref) => {
  return (
    <button
      ref={ref}
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
});

Button.Render = Render;

Button.Options = ({ componentId }) => {
  return (
    <CanvasForm componentId={componentId}>
      <TextInput name="name" label="Name" />
      <ColorPicker name="color" label="Color" spaceTop />
      <ColorPicker name="backgroundColor" label="Background Color" spaceTop />
    </CanvasForm>
  );
};

export default Button;
