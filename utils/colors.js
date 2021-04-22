/**
 * Converts an RGB color to Hex representation. This comes with # prepended.
 */
export function rgbToHex(rgb) {
  return `#${numberToHex(rgb.r)}${numberToHex(rgb.g)}${numberToHex(rgb.b)}`.toUpperCase();
}

/**
 * Converts an rgba object to CSS compatible.
 */
export function rgbaToCss(rgba) {
  if (rgba.a === 1) {
    return rgbToHex(rgba);
  }

  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
}

function numberToHex(number) {
  return ('0' + number.toString(16)).slice(-2);
}
