import { Container, ContainerProps, DimensionSize } from 'bricks';
import { ContainerComponentProps } from './Container';
import { ContainerDimension } from './ContainerOptions';

export function useContainerTransformedProps({
  width,
  height,
  ...rest
}: ContainerComponentProps): ContainerProps {
  return {
    width: transformDimension(width),
    height: transformDimension(height),
    ...rest,
  };
}

function transformDimension(dim: ContainerDimension): DimensionSize {
  if (dim === 'auto' || typeof dim === 'object') {
    return dim;
  }

  return { size: 100, unit: '%' };
}

export default function ContainerRender(props: ContainerComponentProps) {
  return <Container {...useContainerTransformedProps(props)} />;
}
