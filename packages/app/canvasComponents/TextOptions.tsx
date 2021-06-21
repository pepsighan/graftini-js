import { Grid, GridItem, Text } from '@chakra-ui/layout';
import { Divider } from '@chakra-ui/react';
import { FontWeight } from '@graftini/bricks';
import { OptionsProps } from 'canvasComponents';
import { useCallback } from 'react';
import { parseInteger, parsePositiveInteger } from 'utils/parser';
import CanvasForm, { CanvasFormComponent } from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import FontSize from './form/FontSize';
import Labelled from './form/Labelled';
import SelectInputWithLabel from './form/SelectInputWithLabel';
import TextAlignInput from './form/TextAlignInput';
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
        <GridItem colSpan={8}>
          <TextAlignInput name="textAlign" />
        </GridItem>

        <SectionDivider />

        <Labelled label="Name">
          <TextInput name="name" />
        </Labelled>

        <SectionDivider />

        <GridItem colSpan={8} mb={1}>
          <Text fontSize="sm" fontWeight="bold">
            Appearance
          </Text>
        </GridItem>

        <GridItem colSpan={8}>
          <FontSize name="fontSize" />
        </GridItem>
        <GridItem colSpan={8}>
          <SelectInputWithLabel name="fontFamily" label="Font" labelWidth="4.5rem">
            <option value="sans-serif">Sans Serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
          </SelectInputWithLabel>
        </GridItem>
        <GridItem colSpan={8}>
          <SelectInputWithLabel name="fontWeight" label="Weight" labelWidth="4.5rem">
            <option value={100}>Extra Thin</option>
            <option value={200}>Thin</option>
            <option value={300}>Light</option>
            <option value={400}>Normal</option>
            <option value={500}>Medium</option>
            <option value={600}>Semi Bold</option>
            <option value={700}>Bold</option>
            <option value={800}>Extra Bold</option>
            <option value={900}>Extra Extra Bold</option>
          </SelectInputWithLabel>
        </GridItem>
        <GridItem colSpan={8}>
          <ColorPicker name="color" label="Color" labelWidth="4.5rem" />
        </GridItem>
      </Grid>
    </CF>
  );
}

function SectionDivider() {
  return (
    <GridItem colSpan={8}>
      <Divider borderColor="gray.400" />
    </GridItem>
  );
}
