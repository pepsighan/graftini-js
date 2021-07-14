/**
 * Parses the value into a valid positive number. If it cannot, returns null.
 */
export function parsePositiveInteger(value: unknown): number | null {
  const number = parseInteger(value);
  if (typeof number === 'number' && number >= 0) {
    return number;
  }

  return null;
}

/**
 * Parses the value into an non-NaN integer. If it cannot parse, returns null.
 */
export function parseInteger(value: unknown): number | null {
  if (typeof value === 'number') {
    return !isNaN(value) ? value : null;
  }

  if (typeof value === 'string') {
    const number = parseInt(value);
    if (!isNaN(number)) {
      return number;
    }
  }

  return null;
}

/**
 * Parses the value into a valid positive floating number. If it cannot, returns null.
 */
export function parsePositiveFloat(value: unknown): number | null {
  if (typeof value === 'number') {
    return !isNaN(value) ? value : null;
  }

  if (typeof value === 'string') {
    const number = parseFloat(value);
    if (!isNaN(number) && number >= 0) {
      return number;
    }
  }

  return null;
}

/**
 * Limit the number to two decimal places.
 */
export function toTwoDecimalPlaces(num: number): number {
  // Truncates the number to two decimal places. Using `toFixed` rounds up the number.
  return Math.floor(num * 100) / 100;
}
