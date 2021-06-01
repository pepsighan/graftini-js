import { useEffect } from 'react';

/**
 * Only run the effect once when on load.
 */
export function useEffectOnce(fn) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fn, []);
}
