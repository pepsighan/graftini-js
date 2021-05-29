import { Grid, GridItem, Text } from '@chakra-ui/layout';
import { useCallback } from 'react';
import { parsePositiveInteger } from 'utils/parser';
import CanvasForm from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import Labelled from './form/Labelled';
import NumberInput from './form/NumberInput';
import TextInput from './form/TextInput';

export default function TextOptions({ componentId }) {
  return (
    <CanvasForm
      componentId={componentId}
      onTransformValues={useCallback((values) => {
        values.fontSize = parsePositiveInteger(values.fontSize);
      }, [])}
    >
      {/* Making a 6 column grid system. */}
      <Grid templateColumns="repeat(6, minmax(0, 1fr))" alignItems="center" gap={4}>
        <Labelled label="Name">
          <TextInput name="name" />
        </Labelled>
        <Labelled label="Tag">
          <TextInput name="tag" />
        </Labelled>

        <GridItem colSpan={6} mt={4} mb={1}>
          <Text fontSize="sm" fontWeight="bold">
            Appearance
          </Text>
        </GridItem>
        <Labelled label="Font Size">
          <NumberInput name="fontSize" />
        </Labelled>
        <Labelled label="Font">
          <TextInput name="fontFamily" />
        </Labelled>
        <Labelled label="Font Weight">
          <TextInput name="fontWeight" />
        </Labelled>
        <Labelled label="Color">
          <ColorPicker name="color" />
        </Labelled>
        <Labelled label="Align">
          <TextInput name="textAlign" />
        </Labelled>
      </Grid>
    </CanvasForm>
  );
}
