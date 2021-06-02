import { MutableRefObject, useLayoutEffect, useState } from 'react';

type UseDimensions = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
};

/**
 * Gets the dimensios for the element pointed by the ref object.
 */
export function useDimensions(ref: MutableRefObject<HTMLElement>): UseDimensions {
  const [dimensions, setDimensions] = useState<UseDimensions>({
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  useLayoutEffect(() => {
    if (ref.current) {
      const measure = () =>
        window.requestAnimationFrame(() => {
          const rect = ref.current.getBoundingClientRect();
          setDimensions({
            width: rect.width,
            height: rect.height,
            top: rect.top,
            bottom: rect.bottom,
            left: rect.left,
            right: rect.right,
          });
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
