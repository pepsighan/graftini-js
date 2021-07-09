import { FontSize, RGBA, rgbaToCss } from '@graftini/bricks';

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
export function parseColor(color: string): RGBA {
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
export function parseFontSize(size: string): FontSize {
  const splits = size.split(',');
  return {
    size: splits[1] === 'rem' ? parseFloat(splits[0]) : parseInt(splits[0], 10),
    unit: splits[1] as any,
  };
}
