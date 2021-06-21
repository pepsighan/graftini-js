import { BoxProps } from '@graftini/bricks';
import { BoxComponentProps } from 'canvasComponents/Box';

export function useBoxTransformedProps(props: BoxComponentProps): BoxProps {
  // Any transformations that need to be done on the box props. Currently
  // are none.
  return props;
}
