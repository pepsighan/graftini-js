import { Grid, GridItem, Text } from '@chakra-ui/layout';
import { Divider } from '@chakra-ui/react';
import { OptionsProps } from 'canvasComponents';
import { useCallback } from 'react';
import CanvasForm, { CanvasFormComponent } from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import FontSize from './form/FontSize';
import SelectInput from './form/SelectInput';
import TextAlignInput from './form/TextAlignInput';
import TextInput from './form/TextInput';
import { TextComponentProps } from './Text';

type TextOptionsFields = TextComponentProps;

export default function TextOptions({ componentId }: OptionsProps) {
  const CF = CanvasForm as CanvasFormComponent<TextComponentProps, TextOptionsFields>;

  return (
    <CF
      componentId={componentId}
      onSync={useCallback((props, state) => {
        // Copy the state to the props as-is.
        Object.keys(state).forEach((key) => {
          props[key] = state[key];
        });
      }, [])}
    >
      {/* Making a 8 column grid system. */}
      <Grid templateColumns="repeat(8, minmax(0, 1fr))" alignItems="center" gap={4}>
        <GridItem colSpan={8}>
          <TextAlignInput name="textAlign" />
        </GridItem>

        <SectionDivider />

        <GridItem colSpan={8}>
          <TextInput name="name" label="Label" />
        </GridItem>

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
          <SelectInput name="fontFamily" label="Font" labelWidth="4.5rem">
            <option value="sans-serif">Sans Serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
          </SelectInput>
        </GridItem>
        <GridItem colSpan={8}>
          <SelectInput name="fontWeight" label="Weight" labelWidth="4.5rem">
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
