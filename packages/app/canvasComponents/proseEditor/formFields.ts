import { FontSize, FontWeight, RGBA, TextAlign } from '@graftini/bricks';
import { Selection } from 'prosemirror-state';

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
export function getFormFieldValuesFromSelection(selection?: Selection | null): TextOptionsFields {
  console.log(selection?.content().toJSON());

  return {
    ...defaultTextFormValues,
  };
}
