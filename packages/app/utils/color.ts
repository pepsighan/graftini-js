import { RGBA, rgbaToCss } from '@graftini/bricks';

export function rgbaToViewableText(color: RGBA) {
  if (color.a === 0) {
    return 'Transparent';
  }

  return rgbaToCss({ ...color, a: null });
}

export function rgbaToViewableLabel(color: RGBA) {
  if (color.a === 0) {
    return 'Transparent';
  }

  return rgbaToCss(color);
}
