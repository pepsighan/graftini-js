/**
 * An RGBA color with an optional alpha. This is the only color format used by the components.
 */
export type RGBA = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

/**
 * Converts an RGBA color to either hex format with # symbol or rgba() format.
 */
export function rgbaToCss(rgba: RGBA): string {
  if (typeof rgba.a !== 'number' || rgba.a === 1) {
    return rgbToHex(rgba);
  }

  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
}

/**
 * Converts an RGB color to hex format. This comes with # prepended.
 */
function rgbToHex(rgb: RGBA): string {
  return `#${numberToHex(rgb.r)}${numberToHex(rgb.g)}${numberToHex(rgb.b)}`.toUpperCase();
}

function numberToHex(num: number): string {
  return ('0' + num.toString(16)).slice(-2);
}
