import { FontSize as FontSizeType, FontWeight, RGBA, TextAlign } from '@graftini/bricks';
import { Divider, Stack, Typography } from '@material-ui/core';
import { OptionsProps } from 'canvasComponents';
import { useCallback } from 'react';
import CanvasForm, { CanvasFormComponent } from './form/CanvasForm';
import FontFamilyInput from './form/FontFamilyInput';
import FontSizeInput from './form/FontSizeInput';
import FontWeightInput from './form/FontWeightInput';
import TextAlignInput from './form/TextAlignInput';
import TextColorPickerInput from './form/TextColorPickerInput';
import TextInput from './form/TextInput';
import { getFormFieldValuesFromSelection } from './proseEditor/formFields';
import { useProseEditor } from './proseEditor/ProseEditorContext';
import useCurrentSelectionId from './proseEditor/useCurrentSelectionId';
import useGetSelection from './proseEditor/useGetSelection';
import { TextComponentProps } from './Text';

type TextOptionsFields = {
  name?: string;
  color?: RGBA;
  fontSize?: FontSizeType;
  fontFamily?: string;
  fontWeight?: FontWeight;
  textAlign?: TextAlign;
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
  const getSelection = useGetSelection(componentId);

  // Update the form when the text selection changes.
  return (
    <CF
      componentId={componentId}
      onInitialize={useCallback(
        (state) => {
          return {
            name: state.name,
            ...getFormFieldValuesFromSelection(getEditorView(), getSelection()),
          };
        },
        [getEditorView, getSelection]
      )}
      onSync={useCallback((props, state) => {
        // Only name is to be paste as is to the component prop.
        props.name = state.name;

        // Rest of the form state is synced directly from the form fields.
        // We cannot do blanket update here because that would apply all the styles
        // regardless of which the user intended to.
      }, [])}
    >
      <Stack spacing={2} mt={2}>
        <TextAlignInput name="textAlign" componentId={componentId} />
        <Divider />

        <TextInput name="name" label="Label" />
        <Divider />

        <Typography variant="subtitle2">Appearance</Typography>
        <FontSizeInput name="fontSize" componentId={componentId} />
        <FontFamilyInput componentId={componentId} />
        <FontWeightInput componentId={componentId} />
        <TextColorPickerInput componentId={componentId} />
      </Stack>
    </CF>
  );
}
