import { TextComponentProps } from 'canvasComponents/Text';
import { parseColor, parseFontSize } from 'utils/types';
import { RGBA, FontSize, FontWeight, TextAlign } from '@graftini/bricks';
import { BlockDataOption, blocksInSelection } from './blocks';
import { dynamicStyleOptions, StyleOption, stylesInSelection } from './styleMap';
import { getTextEditorState } from './useTextEditorState';

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
 * The form field for the given style option.
 */
export function formField(option: StyleOption | BlockDataOption): string {
  switch (option) {
    case StyleOption.FontFamily:
      return 'fontFamily';
    case StyleOption.FontSize:
      return 'fontSize';
    case StyleOption.FontWeight:
      return 'fontWeight';
    case StyleOption.TextColor:
      return 'color';
    case BlockDataOption.TextAlignment:
      return 'textAlign';
    default:
      return '';
  }
}

/**
 * Parses the style to a form field value for the given option.
 */
function formFieldValueFromInlineStyle(option: StyleOption, style: string): any {
  switch (option) {
    case StyleOption.TextColor:
      return parseColor(style);
    case StyleOption.FontSize:
      return parseFontSize(style);
    case StyleOption.FontWeight:
      return parseInt(style, 10);
    case StyleOption.FontFamily:
    default:
      return style;
  }
}

/**
 * Parses the block data into the form field value.
 */
function formFieldValueFromBlockData(dataOption: BlockDataOption, value: string): any {
  switch (dataOption) {
    case BlockDataOption.TextAlignment:
      return value;
    default:
      return value;
  }
}

/**
 * Gets the text form values for the dynamic styles. The form values are dependent
 * on the position of the cursor and the styles under than cursor.
 */
// TODO: Show the form value as `-` if there are multiple values for the same field
// in a given selection.
export function getTextFormValues(props: TextComponentProps): any {
  const editorState = getTextEditorState(props);
  // The selection may be provided directly as [textSelection] if the text
  // editor is not in focus. Otherwise if the editor is active it can be fetched
  // from the editor state itself.
  const selection = props.textSelection ?? editorState.getSelection();
  const inlineStyles = stylesInSelection(editorState, selection);

  const formValues = {};

  inlineStyles.forEach((styleOption) => {
    // Split the style option into its two parts. Left side is the option itself and
    // right side is the value of the option.
    const split = styleOption.split('=', 2);

    if (!dynamicStyleOptions.includes(split[0] as any)) {
      // The style is not dynamic.
      return;
    }

    const style = split[1];
    const fieldName = formField(split[0] as StyleOption);
    formValues[fieldName] =
      formFieldValueFromInlineStyle(split[0] as StyleOption, style) ??
      defaultTextFormValues[fieldName];
  });

  // Load the form values from the blocks as well.
  const blocks = blocksInSelection(editorState, selection);

  // TODO: We only use the first block for the text alignment field right now. But if there
  // are multiple values, then use -.
  if (blocks.length > 0) {
    const data = blocks[0].getData().toJS();

    const fieldName = formField(BlockDataOption.TextAlignment);
    formValues[fieldName] =
      formFieldValueFromBlockData(
        BlockDataOption.TextAlignment,
        data[BlockDataOption.TextAlignment]
      ) ?? defaultTextFormValues[fieldName];
  }

  return formValues;
}

/**
 * Gets the form values for interaction options.
 */
export function getTextFormInteractionValues(props: TextComponentProps): any {
  return {};
}
