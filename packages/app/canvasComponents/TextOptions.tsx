import { FontSize as FontSizeType, FontWeight, RGBA, TextAlign } from '@graftini/bricks';
import { Divider, MenuItem, Stack, Typography } from '@material-ui/core';
import { OptionsProps } from 'canvasComponents';
import { useCallback } from 'react';
import { TextTag, textTags } from 'utils/constants';
import { assignDimension, RawDimension } from './BoxOptions';
import CanvasForm, { CanvasFormComponent } from './form/CanvasForm';
import FontFamilyInput from './form/FontFamilyInput';
import FontSizeInput from './form/FontSizeInput';
import FontWeightInput from './form/FontWeightInput';
import SelectInput from './form/SelectInput';
import SizeInput from './form/SizeInput';
import TextAlignInput from './form/TextAlignInput';
import TextColorPickerInput from './form/TextColorPickerInput';
import TextInput from './form/TextInput';
import { getFormFieldValuesFromSelection } from './proseEditor/formFields';
import { useProseEditor } from './proseEditor/ProseEditorContext';
import useCurrentSelectionId from './proseEditor/useCurrentSelectionId';
import useGetSelectionForForm from './proseEditor/useGetSelectionForForm';
import SyncResize, { transformToRawHeight, transformToRawWidth } from './SyncResize';
import Text, { TextComponentProps } from './Text';

type TextOptionsFields = {
  name?: string;
  tag?: TextTag;
  color?: RGBA;
  fontSize?: FontSizeType;
  fontFamily?: string;
  fontWeight?: FontWeight;
  textAlign?: TextAlign;
  widthRaw?: RawDimension;
  heightRaw?: RawDimension;
};

export default function TextOptions({ componentId }: OptionsProps) {
  // Using the selection id for keying the form will refresh the form values that
  // reflect the current selection.
  const selectionId = useCurrentSelectionId(componentId);
  return <FormInner key={selectionId} componentId={componentId} />;
}

function FormInner({ componentId }: OptionsProps) {
  const CF = CanvasForm as CanvasFormComponent<TextComponentProps, TextOptionsFields>;
  const { getEditorView } = useProseEditor();
  const getSelection = useGetSelectionForForm(componentId);

  // Update the form when the text selection changes.
  return (
    <CF
      componentId={componentId}
      onInitialize={useCallback(
        (state) => ({
          name: state.name,
          tag: state.tag || Text.graftOptions.defaultProps.tag,
          widthRaw: transformToRawWidth(state.width ?? Text.graftOptions.defaultProps.width!),
          heightRaw: transformToRawHeight(state.height ?? Text.graftOptions.defaultProps.height!),
          ...getFormFieldValuesFromSelection(getEditorView(), getSelection()),
        }),
        [getEditorView, getSelection]
      )}
      onSync={useCallback((props, state) => {
        // Only name, tag and dimensions is to be synced as is to the component prop.
        props.name = state.name;
        props.tag = state.tag;

        assignDimension(props, 'width', state.widthRaw);
        assignDimension(props, 'height', state.heightRaw);

        // Rest of the form state is synced directly from the form fields.
        // We cannot do blanket update here because that would apply all the styles
        // regardless of which the user intended to.
      }, [])}
    >
      <SyncResize componentId={componentId} />

      <Stack spacing={2} mt={2}>
        <TextAlignInput name="textAlign" componentId={componentId} />
        <Divider />

        <TextInput name="name" label="Label" />

        <SelectInput name="tag" label="Tag">
          {textTags.map((tag) => (
            <MenuItem key={tag} value={tag}>
              {tag}
            </MenuItem>
          ))}
        </SelectInput>
        <Divider />

        <Typography variant="subtitle2">Appearance</Typography>
        <FontSizeInput name="fontSize" componentId={componentId} />
        <FontFamilyInput componentId={componentId} />
        <FontWeightInput componentId={componentId} />
        <TextColorPickerInput componentId={componentId} />
        <Divider />

        <Typography variant="subtitle2">Layout</Typography>
        <SizeInput name="widthRaw" label="Width" />
        <SizeInput name="heightRaw" label="Height" />
      </Stack>
    </CF>
  );
}
