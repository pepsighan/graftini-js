import { BoxProps, DimensionSize } from 'bricks';
import { BoxComponentProps } from 'canvasComponents/Box';
import { BoxDimension } from 'canvasComponents/BoxOptions';

export function useBoxTransformedProps({ width, height, ...rest }: BoxComponentProps): BoxProps {
  return {
    width: transformDimension(width),
    height: transformDimension(height),
    ...rest,
  };
}

function transformDimension(dim: BoxDimension): DimensionSize {
  if (dim === 'auto' || typeof dim === 'object') {
    return dim;
  }

  return { size: 100, unit: '%' };
}
