/** @jsxImportSource @emotion/react */
import { Box } from '@chakra-ui/layout';
import { useComponentId, useComponentProps, useEditorState } from '@graftini/graft';
import { motion } from 'framer-motion';
import { forwardRef, useCallback } from 'react';
import { rgbaToCss } from 'utils/colors';
import { parseInteger, parsePositiveInteger } from 'utils/parser';
import CanvasForm from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import NumberInput from './form/NumberInput';
import SpacingField from './form/SpacingField';
import TextInput from './form/TextInput';

const Container = forwardRef(({ children }, ref) => {
  const componentId = useComponentId();
  const hasChildren = useEditorState(
    useCallback((state) => state[componentId].childrenNodes.length > 0, [componentId])
  );

  // TODO: Provide a way to select a subsection of props.
  const { width, height, padding, margin, backgroundColor } = useComponentProps();

  return (
    <motion.div
      ref={ref}
      style={{
        width,
        // If there is no children and no height, give it some so that it is visible.
        // TODO: https://github.com/pepsighan/nocode/issues/15.
        height: height ?? (hasChildren ? null : 80),
        marginTop: margin?.top,
        marginRight: margin?.right,
        marginBottom: margin?.bottom,
        marginLeft: margin?.left,
        paddingTop: padding?.top,
        paddingRight: padding?.right,
        paddingBottom: padding?.bottom,
        paddingLeft: padding?.left,
        backgroundColor: rgbaToCss(backgroundColor),
      }}
    >
      {children}
    </motion.div>
  );
});

Container.Options = function Options({ componentId }) {
  return (
    <CanvasForm
      componentId={componentId}
      onTransformValues={useCallback((values) => {
        values.width = parsePositiveInteger(values.width);
        values.height = parsePositiveInteger(values.height);

        values.padding = values.padding ?? {};
        values.padding.top = parseInteger(values.padding?.top);
        values.padding.right = parseInteger(values.padding?.right);
        values.padding.bottom = parseInteger(values.padding?.bottom);
        values.padding.left = parseInteger(values.padding?.left);

        values.margin = values.margin ?? {};
        values.margin.top = parseInteger(values.margin?.top);
        values.margin.right = parseInteger(values.margin?.right);
        values.margin.bottom = parseInteger(values.margin?.bottom);
        values.margin.left = parseInteger(values.margin?.left);
      }, [])}
    >
      <TextInput name="name" label="Name" />
      <NumberInput name="width" label="Width" spaceTop />
      <NumberInput name="height" label="Height" spaceTop />
      <SpacingField name="padding" label="Padding" spaceTop />
      <SpacingField name="margin" label="Margin" spaceTop />
      <ColorPicker name="backgroundColor" label="Background Color" spaceTop />
    </CanvasForm>
  );
};

function Preview() {
  return <Box width="300px" height="200px" bg="preview.light" />;
}

Container.graftOptions = {
  defaultProps: {
    width: null,
    height: null,
    padding: null,
    margin: {},
    backgroundColor: { r: 220, g: 220, b: 255, a: 1 },
  },
  isCanvas: true,
  display: 'block',
  preview: Preview,
};

export default Container;
