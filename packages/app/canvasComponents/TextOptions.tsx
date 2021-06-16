import { Grid, GridItem, Text } from '@chakra-ui/layout';
import {
  mdiFormatAlignCenter,
  mdiFormatAlignJustify,
  mdiFormatAlignLeft,
  mdiFormatAlignRight,
} from '@mdi/js';
import { FontWeight } from 'bricks';
import { OptionsProps } from 'canvasComponents';
import Icon from 'components/Icon';
import { useCallback } from 'react';
import { parseInteger, parsePositiveInteger } from 'utils/parser';
import CanvasForm, { CanvasFormComponent } from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import FontSize from './form/FontSize';
import Labelled from './form/Labelled';
import SegmentedInput from './form/SegmentedInput';
import SelectInput from './form/SelectInput';
import TextInput from './form/TextInput';
import Txt, { TextComponentProps } from './Text';

type TextOptionsFields = TextComponentProps;

export default function TextOptions({ componentId }: OptionsProps) {
  const CF = CanvasForm as CanvasFormComponent<TextComponentProps, TextOptionsFields>;

  return (
    <CF
      componentId={componentId}
      fieldNames={Object.keys(Txt.graftOptions.defaultProps)}
      onInitialize={useCallback((initialState) => initialState, [])}
      onTransformValues={useCallback((values: TextOptionsFields) => {
        values.fontSize.size = parsePositiveInteger(values.fontSize.size);
        values.fontWeight = parseInteger(values.fontWeight) as FontWeight;
      }, [])}
    >
      {/* Making a 8 column grid system. */}
      <Grid templateColumns="repeat(8, minmax(0, 1fr))" alignItems="center" gap={4}>
        <Labelled label="Name">
          <TextInput name="name" />
        </Labelled>

        <GridItem colSpan={8} mt={4} mb={1}>
          <Text fontSize="sm" fontWeight="bold">
            Appearance
          </Text>
        </GridItem>
        <Labelled label="Align">
          <SegmentedInput
            name="textAlign"
            options={[
              { value: 'left', label: <Icon icon={mdiFormatAlignLeft} fontSize="md" /> },
              { value: 'center', label: <Icon icon={mdiFormatAlignCenter} fontSize="md" /> },
              { value: 'right', label: <Icon icon={mdiFormatAlignRight} fontSize="md" /> },
              { value: 'justify', label: <Icon icon={mdiFormatAlignJustify} fontSize="md" /> },
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
        <GridItem colSpan={8}>
          <ColorPicker name="color" label="Color" />
        </GridItem>
      </Grid>
    </CF>
  );
}
