import { Grid, GridItem, Text } from '@chakra-ui/layout';
import { useCallback } from 'react';
import { parseInteger, parsePositiveInteger } from 'utils/parser';
import CanvasForm from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import Labelled from './form/Labelled';
import NumberInput from './form/NumberInput';
import SizeInput from './form/SizeInput';
import SpacingField from './form/SpacingField';
import TextInput from './form/TextInput';

export default function ContainerOptions({ componentId }) {
  return (
    <CanvasForm
      componentId={componentId}
      onTransformValues={useCallback((values) => {
        values.width.size = parsePositiveInteger(values.width.size);
        values.height.size = parsePositiveInteger(values.height.size);

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
      {/* Making a 6 column grid system. */}
      <Grid templateColumns="repeat(6, minmax(0, 1fr))" alignItems="center" gap={4}>
        <PropertiesSection />
        <AlignmentSection />
        <LayoutSection />
        <AppearanceSection />
      </Grid>
    </CanvasForm>
  );
}

function PropertiesSection() {
  return (
    <>
      <Labelled label="Name">
        <TextInput name="name" />
      </Labelled>
      <Labelled label="Tag">
        <TextInput name="tag" />
      </Labelled>
    </>
  );
}

function AlignmentSection() {
  return (
    <>
      <Labelled label="Horizontal">
        <NumberInput name="mainAxisAlignment" />
      </Labelled>
      <Labelled label="Vertical">
        <NumberInput name="crossAxisAlignment" />
      </Labelled>
      <Labelled label="Direction">
        <TextInput name="direction" />
      </Labelled>
    </>
  );
}

function LayoutSection() {
  return (
    <>
      <GridItem colSpan={6} mt={4} mb={1}>
        <Text fontSize="sm" fontWeight="bold">
          Layout
        </Text>
      </GridItem>
      <Labelled label="Width">
        <SizeInput name="width" />
      </Labelled>
      <Labelled label="Height">
        <SizeInput name="height" />
      </Labelled>
      <Labelled label="Padding">
        <SpacingField name="padding" />
      </Labelled>
      <Labelled label="Margin">
        <SpacingField name="margin" />
      </Labelled>
      <Labelled label="Overflow">
        <ColorPicker name="overflow" />
      </Labelled>
    </>
  );
}

function AppearanceSection() {
  return (
    <>
      <GridItem colSpan={6} mt={4} mb={1}>
        <Text fontSize="sm" fontWeight="bold">
          Appearance
        </Text>
      </GridItem>
      <Labelled label="Opacity">
        <ColorPicker name="opacity" />
      </Labelled>
      <Labelled label="Fill">
        <ColorPicker name="color" />
      </Labelled>
      <Labelled label="Border">
        <TextInput name="border" />
      </Labelled>
      <Labelled label="Radius">
        <TextInput name="borderRadius" />
      </Labelled>
      <Labelled label="Shadow">
        <TextInput name="shadow" />
      </Labelled>
    </>
  );
}
