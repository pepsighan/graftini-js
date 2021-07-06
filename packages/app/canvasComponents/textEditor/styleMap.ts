import { FontSize, RGBA, rgbaToCss } from '@graftini/bricks';
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

/**
 * The form field for the given style option.
 */
export function formField(option: StyleOption): string {
  switch (option) {
    case StyleOption.FontFamily:
      return 'fontFamily';
    case StyleOption.FontSize:
      return 'fontSize';
    case StyleOption.FontWeight:
      return 'fontWeight';
    case StyleOption.TextAlignment:
      return 'textAlign';
    case StyleOption.TextColor:
      return 'color';
    default:
      return '';
  }
}

/**
 * Parses the style to a form field value for the given option.
 */
export function formFieldValue(option: StyleOption, style: string): any {
  switch (option) {
    case StyleOption.TextColor:
      return parseColor(style);
    case StyleOption.FontSize:
      return parseFontSize(style);
    case StyleOption.FontWeight:
      return parseInt(style, 10);
    case StyleOption.FontFamily:
    case StyleOption.TextAlignment:
    default:
      return style;
  }
}

/**
 * Convert color to a style accepted by style map.
 */
export function colorToString(color: RGBA): string {
  return rgbaToCss(color);
}

/**
 * Convert font size to a style accepted by style map.
 */
export function fontSizeToString(size: FontSize): string {
  return `${size.size},${size.unit}`;
}

/**
 * Parses RGBA color from string.
 */
function parseColor(color: string): RGBA {
  if (color.startsWith('#')) {
    const r = color.substr(1, 2);
    const g = color.substr(3, 2);
    const b = color.substr(5, 2);

    return {
      r: parseInt(r, 16),
      g: parseInt(g, 16),
      b: parseInt(b, 16),
      a: 1,
    };
  }

  const splits = color.replace('rgba(', '').replace(')', '').split(',');
  return {
    r: parseInt(splits[0], 10),
    g: parseInt(splits[1], 10),
    b: parseInt(splits[2], 10),
    a: parseFloat(splits[3]),
  };
}

/**
 * Parse the font size from string.
 */
function parseFontSize(size: string): FontSize {
  const splits = size.split(',');
  return {
    size: parseInt(splits[0], 10),
    unit: splits[1] as any,
  };
}
