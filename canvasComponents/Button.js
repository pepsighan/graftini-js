/** @jsxImportSource @emotion/react */
import { Box } from '@chakra-ui/layout';
import { useComponentProps } from '@graftini/graft';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { rgbaToCss } from 'utils/colors';
import CanvasForm from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import TextInput from './form/TextInput';
import Outline from './Outline';

const Button = forwardRef((_, ref) => {
  const { padding, backgroundColor, color, children } = useComponentProps();
  return (
    <Outline>
      <motion.button
        ref={ref}
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
      </motion.button>
    </Outline>
  );
});

Button.Options = ({ componentId }) => {
  return (
    <CanvasForm componentId={componentId}>
      <TextInput name="name" label="Name" />
      <ColorPicker name="color" label="Color" spaceTop />
      <ColorPicker name="backgroundColor" label="Background Color" spaceTop />
    </CanvasForm>
  );
};

function Preview() {
  return (
    <Box
      width="140px"
      height="32px"
      borderRadius="md"
      bg="preview.light"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box width="100px" height="12px" bg="preview.dark" borderRadius="sm" />
    </Box>
  );
}

Button.graftOptions = {
  defaultProps: {
    padding: { top: 4, right: 4, bottom: 4, left: 4 },
    backgroundColor: { r: 220, g: 220, b: 255, a: 1 },
    color: { r: 0, g: 0, b: 0, a: 1 },
    children: 'Button',
  },
  display: 'block',
  preview: Preview,
};

export default Button;
