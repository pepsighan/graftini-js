/** @jsxImportSource @emotion/react */
import { useComponentProps } from '@graftini/graft';
import { rgbaToCss } from 'utils/colors';
import CanvasForm from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import TextInput from './form/TextInput';
import Outline from './Outline';

function Button(props) {
  const { padding, backgroundColor, color, children } = useComponentProps();
  return (
    <Outline>
      <button
        {...props}
        style={{
          display: 'block',
          width: '100%',
          paddingTop: padding?.top,
          paddingRight: padding?.right,
          paddingBottom: padding?.bottom,
          paddingLeft: padding?.left,
          backgroundColor: rgbaToCss(backgroundColor),
          color: rgbaToCss(color),
        }}
      >
        {children}
      </button>
    </Outline>
  );
}

Button.Options = ({ componentId }) => {
  return (
    <CanvasForm componentId={componentId}>
      <TextInput name="name" label="Name" />
      <ColorPicker name="color" label="Color" spaceTop />
      <ColorPicker name="backgroundColor" label="Background Color" spaceTop />
    </CanvasForm>
  );
};

Button.graftOptions = {
  defaultProps: {
    padding: { top: 4, right: 4, bottom: 4, left: 4 },
    backgroundColor: { r: 220, g: 220, b: 255, a: 1 },
    color: { r: 0, g: 0, b: 0, a: 1 },
    children: 'Button',
  },
  display: 'block',
};

Button.Render = ({ padding, backgroundColor, color, children }) => {
  return (
    <button
      style={{
        display: 'block',
        width: '100%',
        paddingTop: padding?.top,
        paddingRight: padding?.right,
        paddingBottom: padding?.bottom,
        paddingLeft: padding?.left,
        backgroundColor: rgbaToCss(backgroundColor),
        color: rgbaToCss(color),
      }}
    >
      {children}
    </button>
  );
};

export default Button;
