import { FontSize, FontWeight, RGBA, TextAlign } from '@graftini/bricks';
import { TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

type TextOptionsFields = {
  color?: RGBA;
  fontSize?: FontSize;
  fontFamily?: string;
  fontWeight?: FontWeight;
  textAlign?: TextAlign;
};

/**
 * The default text form values if they do not exist.
 */
export const defaultTextFormValues: TextOptionsFields = {
  color: { r: 0, g: 0, b: 0, a: 1 },
  fontFamily: 'sans-serif',
  fontSize: { size: 1, unit: 'rem' },
  fontWeight: 400,
  textAlign: 'left',
};

/**
 * Gets the current form field values from the current selection.
 */
export function getFormFieldValuesFromSelection(view?: EditorView | null): TextOptionsFields {
  if (!view) {
    return defaultTextFormValues;
  }

  const selection = view.state.selection;
  if (selection.empty) {
    // If the selection is empty, it won't be able to get the form values.
    // So we select the preceding character.
    const previous = TextSelection.create(
      view.state.doc,
      selection.anchor === 1 ? 1 : selection.anchor - 1,
      selection.head === 1 ? 2 : selection.head
    );
    console.log(previous.content().toJSON());
  }

  return {
    ...defaultTextFormValues,
  };
}
