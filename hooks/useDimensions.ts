import { MutableRefObject, useLayoutEffect, useState } from 'react';

/**
 * Gets the dimensios for the element pointed by the ref object.
 */
export function useDimensions(ref: MutableRefObject<HTMLElement>): DOMRect | null {
  const [dimensions, setDimensions] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      const measure = () =>
        window.requestAnimationFrame(() => {
          const rect = ref.current.getBoundingClientRect();
          setDimensions(rect);
        });

      // Measure for the first time.
      measure();

      window.addEventListener('resize', measure);
      window.addEventListener('scroll', measure);

      return () => {
        window.removeEventListener('resize', measure);
        window.removeEventListener('scroll', measure);
      };
    }
  }, [ref]);

  return dimensions;
}
