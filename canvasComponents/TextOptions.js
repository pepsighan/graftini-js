import Icon from '@chakra-ui/icon';
import { Grid, GridItem, Text } from '@chakra-ui/layout';
import { useCallback } from 'react';
import {
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignLeft,
  MdFormatAlignRight,
} from 'react-icons/md';
import { parsePositiveInteger } from 'utils/parser';
import CanvasForm from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import FontSize from './form/FontSize';
import Labelled from './form/Labelled';
import SegmentedInput from './form/SegmentedInput';
import SelectInput from './form/SelectInput';
import TextInput from './form/TextInput';

export default function TextOptions({ componentId }) {
  return (
    <CanvasForm
      componentId={componentId}
      onTransformValues={useCallback((values) => {
        values.fontSize.size = parsePositiveInteger(values.fontSize.size);
      }, [])}
    >
      {/* Making a 6 column grid system. */}
      <Grid templateColumns="repeat(6, minmax(0, 1fr))" alignItems="center" gap={4}>
        <Labelled label="Name">
          <TextInput name="name" />
        </Labelled>

        <GridItem colSpan={6} mt={4} mb={1}>
          <Text fontSize="sm" fontWeight="bold">
            Appearance
          </Text>
        </GridItem>
        <Labelled label="Align">
          <SegmentedInput
            name="textAlign"
            options={[
              { value: 'left', label: <Icon as={MdFormatAlignLeft} fontSize="md" /> },
              { value: 'center', label: <Icon as={MdFormatAlignCenter} fontSize="md" /> },
              { value: 'right', label: <Icon as={MdFormatAlignRight} fontSize="md" /> },
              { value: 'justify', label: <Icon as={MdFormatAlignJustify} fontSize="md" /> },
            ]}
          />
        </Labelled>
        <Labelled label="Font Size">
          <FontSize name="fontSize" />
        </Labelled>
        <Labelled label="Font">
          <SelectInput name="fontFamily">
            <option value="sans-serif">Sans Serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
          </SelectInput>
        </Labelled>
        <Labelled label="Weight">
          <SelectInput name="fontWeight">
            <option value={100}>Extra Thin</option>
            <option value={200}>Thin</option>
            <option value={300}>Light</option>
            <option value={400}>Normal</option>
            <option value={500}>Medium</option>
            <option value={600}>Semi Bold</option>
            <option value={700}>Bold</option>
            <option value={800}>Extra Bold</option>
            <option value={900}>Extra Extra Bold</option>
          </SelectInput>
        </Labelled>
        <Labelled label="Color">
          <ColorPicker name="color" />
        </Labelled>
      </Grid>
    </CanvasForm>
  );
}
