import { Box } from '@graftini/bricks';
import { useBoxTransformedProps } from 'hooks/useBoxTransformedProps';
import { BoxComponentProps } from './Box';

export default function BoxRender(props: BoxComponentProps) {
  return <Box {...useBoxTransformedProps(props)} />;
}
