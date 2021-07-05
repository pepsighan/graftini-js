import { Divider, MenuItem, Stack, Typography } from '@material-ui/core';
import { OptionsProps } from 'canvasComponents';
import { useCallback } from 'react';
import CanvasForm, { CanvasFormComponent } from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import FontSize from './form/FontSize';
import SelectInput from './form/SelectInput';
import TextAlignInput from './form/TextAlignInput';
import TextInput from './form/TextInput';
import { TextComponentProps } from './Text';
import { RGBA, FontSize as FontSizeType, FontWeight, TextAlign } from '@graftini/bricks';

type TextOptionsFields = TextComponentProps & {
  color?: RGBA;
  fontSize?: FontSizeType;
  fontFamily?: string;
  fontWeight?: FontWeight;
  textAlign?: TextAlign;
};

export default function TextOptions({ componentId }: OptionsProps) {
  const CF = CanvasForm as CanvasFormComponent<TextComponentProps, TextOptionsFields>;

  return (
    <CF
      componentId={componentId}
      onSync={useCallback((props, state) => {
        // Only name is to be paste as is to the component prop.
        props.name = state.name;
      }, [])}
    >
      <Stack spacing={2} mt={2}>
        <TextAlignInput name="textAlign" />
        <Divider />

        <TextInput name="name" label="Label" />
        <Divider />

        <Typography variant="subtitle2">Appearance</Typography>
        <FontSize name="fontSize" />
        <SelectInput name="fontFamily" label="Font">
          <MenuItem value="sans-serif">Sans Serif</MenuItem>
          <MenuItem value="serif">Serif</MenuItem>
          <MenuItem value="monospace">Monospace</MenuItem>
        </SelectInput>
        <SelectInput name="fontWeight" label="Weight">
          <MenuItem value={100}>Extra Thin</MenuItem>
          <MenuItem value={200}>Thin</MenuItem>
          <MenuItem value={300}>Light</MenuItem>
          <MenuItem value={400}>Normal</MenuItem>
          <MenuItem value={500}>Medium</MenuItem>
          <MenuItem value={600}>Semi Bold</MenuItem>
          <MenuItem value={700}>Bold</MenuItem>
          <MenuItem value={800}>Extra Bold</MenuItem>
          <MenuItem value={900}>Extra Extra Bold</MenuItem>
        </SelectInput>
        <ColorPicker name="color" label="Color" labelWidth="4.5rem" />
      </Stack>
    </CF>
  );
}
