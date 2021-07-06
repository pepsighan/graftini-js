import { DraftStyleMap } from 'draft-js';
import { CSSProperties } from 'react';
import theme from 'utils/theme';

/**
 * All the supported inline style keys.
 */
export enum StyleOption {
  TextSelection = 'TEXT_SELECTION',
  FontSize = 'FONT_SIZE',
  FontFamily = 'FONT_FAMILY',
  FontWeight = 'FONT_WEIGHT',
  TextColor = 'TEXT_COLOR',
  TextAlignment = 'TEXT_ALIGNMENT',
}

/**
 * The style options that can be dynamically set.
 */
export const dynamicStyleOptions = [
  StyleOption.FontSize,
  StyleOption.FontFamily,
  StyleOption.FontWeight,
  StyleOption.TextColor,
  StyleOption.TextAlignment,
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
      return {
        fontSize: style,
      };
    case StyleOption.FontWeight:
      return {
        fontWeight: style as any,
      };
    case StyleOption.TextAlignment:
      return {
        textAlign: style as any,
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
 * Add the dynamic style option to the map.
 */
export function addStyleOption(styleMap: DraftStyleMap, option: StyleOption, style: string) {
  styleMap[`${option}=${style}`] = styleForOption(option, style);
}

/**
 * Remove the dynamic style option from the style map.
 */
export function removeStyleOption(styleMap: DraftStyleMap, option: StyleOption, style: string) {
  const key = `${option}=${style}`;
  delete styleMap[key];
}
