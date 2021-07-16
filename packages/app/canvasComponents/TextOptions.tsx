import { FontSize as FontSizeType, FontWeight, RGBA, TextAlign } from '@graftini/bricks';
import { useEditorStoreApi } from '@graftini/graft';
import { Divider, Stack, Typography } from '@material-ui/core';
import { OptionsProps } from 'canvasComponents';
import useTextSelectionId from 'hooks/useTextSelectionId';
import { useCallback } from 'react';
import CanvasForm, { CanvasFormComponent } from './form/CanvasForm';
import FontFamilyInput from './form/FontFamilyInput';
import FontSizeInput from './form/FontSizeInput';
import FontWeightInput from './form/FontWeightInput';
import TextAlignInput from './form/TextAlignInput';
import TextColorPickerInput from './form/TextColorPickerInput';
import TextInput from './form/TextInput';
import { TextComponentProps } from './Text';
import { defaultTextFormValues, getTextFormValues } from './textEditor/formFields';

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
  const textSelectionId = useTextSelectionId(componentId);

  return <FormInner key={textSelectionId} componentId={componentId} />;
}

function FormInner({ componentId }: OptionsProps) {
  const CF = CanvasForm as CanvasFormComponent<TextComponentProps, TextOptionsFields>;
  const { getState } = useEditorStoreApi();

  // Update the form when the text selection changes.
  return (
    <CF
      componentId={componentId}
      onInitialize={useCallback(
        (state) => {
          const formFields = getTextFormValues(
            getState().componentMap[componentId].props as TextComponentProps
          );

          return {
            ...defaultTextFormValues,
            name: state.name,
            ...formFields,
          };
        },
        [componentId, getState]
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
