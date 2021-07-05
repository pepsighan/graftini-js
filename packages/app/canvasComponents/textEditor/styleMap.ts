import { DraftStyleMap } from 'draft-js';
import { CSSProperties } from 'react';
import md5 from 'md5';
import theme from 'utils/theme';

export enum StyleOption {
  TextSelection = 'TEXT_SELECTION',
  FontSize = 'FONT_SIZE',
  FontFamily = 'FONT_FAMILY',
  FontWeight = 'FONT_WEIGHT',
  TextColor = 'TEXT_COLOR',
  TextAlignment = 'TEXT_ALIGNMENT',
}

export const styleMap: DraftStyleMap = {
  [StyleOption.TextSelection]: {
    backgroundColor: theme.palette.primary[200],
  },
};

/**
 * Add the dynamic style option to the map.
 */
export function addStyleOption(styleMap: DraftStyleMap, option: StyleOption, style: CSSProperties) {
  const hash = md5(JSON.stringify(style));
  styleMap[`${option}-${hash}`] = style;
}

/**
 * Remove the dynamic style option from the style map.
 */
export function removeStyleOption(
  styleMap: DraftStyleMap,
  option: StyleOption,
  style: CSSProperties
) {
  const hash = md5(JSON.stringify(style));
  const key = `${option}-${hash}`;
  delete styleMap[key];
}
