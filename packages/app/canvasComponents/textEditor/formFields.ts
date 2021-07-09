import { TextComponentProps } from 'canvasComponents/Text';
import { parseColor, parseFontSize } from 'utils/types';
import { BlockDataOption, blocksInSelection } from './blocks';
import { dynamicStyleOptions, StyleOption, stylesInSelection } from './styleMap';
import { getTextEditorState } from './useTextEditorState';

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
      return 'textAlignment';
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
    formValues[formField(split[0] as StyleOption)] = formFieldValueFromInlineStyle(
      split[0] as StyleOption,
      style
    );
  });

  // Load the form values from the blocks as well.
  const blocks = blocksInSelection(editorState, selection);
  blocks.forEach((block) => {
    const data = block.getData();

    formValues[formField(BlockDataOption.TextAlignment)] = formFieldValueFromBlockData(
      BlockDataOption.TextAlignment,
      data[BlockDataOption.TextAlignment]
    );
  });

  return formValues;
}
