/** @jsxImportSource @emotion/react */
import { Box } from '@chakra-ui/layout';
import { useComponentProps } from '@graftini/graft';
import { motion } from 'framer-motion';
import { forwardRef, useCallback } from 'react';
import { rgbaToCss } from 'utils/colors';
import { parsePositiveInteger } from 'utils/parser';
import CanvasForm from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import NumberInput from './form/NumberInput';
import TextInput from './form/TextInput';

const Text = forwardRef((_, ref) => {
  const { content, color, fontSize } = useComponentProps();

  return (
    <motion.div ref={ref} style={{ color: rgbaToCss(color), fontSize }}>
      {content}
    </motion.div>
  );
});

Text.Options = function Options({ componentId }) {
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
};

function Preview() {
  return (
    <Box width="140px" bg="blue.200" borderRadius="md" p={4}>
      <Box width="100%" height="10px" bg="blue.300" borderRadius="sm" mb={2} />
      <Box width="100%" height="10px" bg="blue.300" borderRadius="sm" mb={2} />
      <Box width="100%" height="10px" bg="blue.300" borderRadius="sm" />
    </Box>
  );
}

Text.graftOptions = {
  defaultProps: {
    color: { r: 0, g: 0, b: 0, a: 1 },
    content: 'Lorem ipsum dolor sit amet.',
    fontSize: 16,
  },
  preview: Preview,
};

export default Text;
