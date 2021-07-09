import { ContentState, DraftStyleMap, EditorState, Modifier, SelectionState } from 'draft-js';
import { CSSProperties } from 'react';
import theme from 'utils/theme';
import { colorToString, fontSizeToString, parseFontSize } from 'utils/types';

/**
 * All the supported inline style keys.
 */
export enum StyleOption {
  TextSelection = 'TEXT_SELECTION',
  FontSize = 'FONT_SIZE',
  FontFamily = 'FONT_FAMILY',
  FontWeight = 'FONT_WEIGHT',
  TextColor = 'TEXT_COLOR',
}

/**
 * The style options that can be dynamically set.
 */
export const dynamicStyleOptions = [
  StyleOption.FontSize,
  StyleOption.FontFamily,
  StyleOption.FontWeight,
  StyleOption.TextColor,
];

/**
 * The style map that lists the styles that need to be applied for a particular
 * option.
 */
export const styleMap: DraftStyleMap = {
  [StyleOption.TextSelection]: {
    backgroundColor: theme.palette.primary[200],
  },
};

/**
 * Depending on the style option, creates CSS for it.
 */
function styleForOption(option: StyleOption, style: string): CSSProperties {
  switch (option) {
    case StyleOption.FontFamily:
      return {
        fontFamily: style,
      };
    case StyleOption.FontSize:
      const parsed = parseFontSize(style);
      return {
        fontSize: `${parsed.size}${parsed.unit}`,
      };
    case StyleOption.FontWeight:
      return {
        fontWeight: style as any,
      };
    case StyleOption.TextColor:
      return {
        color: style,
      };
    default:
      return {};
  }
}

/**
 * Generates a dynamic style option name for the option and given style.
 */
export function dynamicStyleOptionName(option: StyleOption, style: any): string {
  if (typeof style === 'string') {
    // No need to transform it if it already is.
    return `${option}=${style}`;
  }

  switch (option) {
    case StyleOption.FontSize:
      return `${option}=${fontSizeToString(style)}`;
    case StyleOption.TextColor:
      return `${option}=${colorToString(style)}`;
    case StyleOption.FontFamily:
    case StyleOption.FontWeight:
    default:
      return `${option}=${style}`;
  }
}

/**
 * Add the dynamic style option to the map.
 */
export function addStyleOption(styleMap: DraftStyleMap, option: StyleOption, style: string) {
  styleMap[dynamicStyleOptionName(option, style)] = styleForOption(option, style);
}

/**
 * Apply new style to the selection and optionally remove old style if it exists.
 */
export function applyStyleOption(
  editor: EditorState,
  selection: SelectionState,
  styleOption: StyleOption,
  newStyle: any
): EditorState {
  // Remove the previous style because we do not want overlapping styles causing
  // issues.
  const content = removeExistingStyle(editor, selection, styleOption);

  // Add the new style for the selection.
  return EditorState.createWithContent(
    Modifier.applyInlineStyle(content, selection, dynamicStyleOptionName(styleOption, newStyle))
  );
}

/**
 * Removes any existing styles in the given selection region of the StyleOption kind.
 */
export function removeExistingStyle(
  editor: EditorState,
  selection: SelectionState,
  styleOption: StyleOption
): ContentState {
  const styles = stylesInSelection(editor, selection);

  const optionKind = styleOption.split('=')[0];
  const matchingStyles = styles.filter((it) => it.split('=')[0] === optionKind);

  let content = editor.getCurrentContent();

  // Iterate over the overlapping styles and remove them one by one.
  for (let index = 0; index < matchingStyles.length; index++) {
    const match = matchingStyles[index];
    content = Modifier.removeInlineStyle(content, selection, match);
  }

  return content;
}

/**
 * Gets a set of inline styles for the given selection. Solution inspired from
 * https://github.com/facebook/draft-js/issues/602#issuecomment-584676405.
 */
export function stylesInSelection(editor: EditorState, selection: SelectionState): string[] {
  const contentState = editor.getCurrentContent();
  const styles = new Set<string>();

  if (selection.isCollapsed()) {
    editor.getCurrentInlineStyle().forEach((style) => style && styles.add(style));
    return Array.from(styles);
  }

  let key = selection.getStartKey();
  let startOffset = selection.getStartOffset();
  const endKey = selection.getEndKey();
  const endOffset = selection.getEndOffset();

  while (true) {
    const lastRound = key === endKey;
    const block = contentState.getBlockForKey(key);
    const offsetEnd = lastRound ? endOffset : block.getLength();
    const characterList = block.getCharacterList();

    for (let index = startOffset; index < offsetEnd; index++) {
      characterList
        .get(index)
        .getStyle()
        .forEach((style) => style && styles.add(style));
    }

    if (lastRound) {
      break;
    }

    key = contentState.getKeyAfter(key);
    startOffset = 0;
  }

  return Array.from(styles);
}
