import { ToggleButton, ToggleButtonGroup } from '@material-ui/core';
import {
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from '@modulz/radix-icons';
import { dynamicStyleOptionName, StyleOption } from 'canvasComponents/textEditor/styleMap';
import { selectAll } from 'canvasComponents/textEditor/textSelection';
import { useTextEditorStateSetter } from 'canvasComponents/textEditor/useTextEditorState';
import { EditorState, Modifier } from 'draft-js';
import { Controller, useFormContext } from 'react-hook-form';

const options = [
  {
    value: 'left',
    icon: <TextAlignLeftIcon width={20} height={20} />,
  },
  {
    value: 'center',
    icon: <TextAlignCenterIcon width={20} height={20} />,
  },
  {
    value: 'right',
    icon: <TextAlignRightIcon width={20} height={20} />,
  },
  {
    value: 'justify',
    icon: <TextAlignJustifyIcon width={20} height={20} />,
  },
];

export default function TextAlignInput({ name, componentId }) {
  const { control, getValues } = useFormContext();
  const setTextEditor = useTextEditorStateSetter({ componentId });

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ToggleButtonGroup
          value={field.value}
          onChange={(_, value) => {
            const oldValue = getValues()[name];

            // Update the form state. This value is only used within the form.
            field.onChange(value);

            // Update the whole text editor with the alignment. Aligment does not
            // make sense for a sub-selection (at least for now).
            setTextEditor((editor) => {
              const all = selectAll(editor);

              const existingAlignmentRemoved = Modifier.removeInlineStyle(
                editor.getCurrentContent(),
                all,
                dynamicStyleOptionName(StyleOption.TextAlignment, oldValue)
              );

              return EditorState.createWithContent(
                Modifier.applyInlineStyle(
                  existingAlignmentRemoved,
                  all,
                  dynamicStyleOptionName(StyleOption.TextAlignment, value)
                )
              );
            });
          }}
          exclusive
          sx={{
            justifyContent: 'center',
          }}
        >
          {options.map(({ value, icon }) => (
            <ToggleButton key={value} value={value}>
              {icon}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
    />
  );
}
