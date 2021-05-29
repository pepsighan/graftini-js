import { Box, Text } from '@chakra-ui/layout';
import { useCallback } from 'react';
import { parseInteger, parsePositiveInteger } from 'utils/parser';
import CanvasForm from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import NumberInput from './form/NumberInput';
import SpacingField from './form/SpacingField';
import TextInput from './form/TextInput';

export default function ContainerOptions({ componentId }) {
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
      <PropertiesSection />
      <AlignmentSection />
      <LayoutSection />
      <AppearanceSection />
    </CanvasForm>
  );
}

function PropertiesSection() {
  return (
    <>
      <TextInput name="name" label="Name" />
      <TextInput name="tag" label="Tag" spaceTop />
    </>
  );
}

function AlignmentSection() {
  return (
    <>
      <NumberInput name="mainAxisAlignment" label="Horizontal" spaceTop />
      <NumberInput name="crossAxisAlignment" label="Vertical" spaceTop />
    </>
  );
}

function LayoutSection() {
  return (
    <Box mt={8}>
      <Text fontSize="sm" fontWeight="bold" mb={3}>
        Layout
      </Text>
      <NumberInput name="width" label="Width" spaceTop />
      <NumberInput name="height" label="Height" spaceTop />
      <SpacingField name="padding" label="Padding" spaceTop />
      <SpacingField name="margin" label="Margin" spaceTop />
    </Box>
  );
}

function AppearanceSection() {
  return (
    <Box mt={8}>
      <Text fontSize="sm" fontWeight="bold" mb={3}>
        Appearance
      </Text>
      <ColorPicker name="color" label="Fill" />
    </Box>
  );
}
