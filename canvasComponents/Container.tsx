import {
  Border,
  BorderRadius,
  Container as ContainerComp,
  DimensionSize,
  RGBA,
  Shadow,
  Spacing,
} from '@graftini/components';
import {
  GraftComponent,
  GraftComponentProps,
  useComponentId,
  useComponentProps,
  useEditorState,
} from '@graftini/graft';
import { ReactNode, useCallback } from 'react';
import Outline from './Outline';

export type ContainerComponentProps = {
  name?: string;
  tag: string;
  width: DimensionSize;
  height: DimensionSize;
  padding: Spacing;
  margin: Spacing;
  color: RGBA;
  mainAxisAlignment: 'flex-start' | 'center' | 'flex-end';
  crossAxisAlignment: 'flex-start' | 'center' | 'flex-end';
  opacity: number;
  shadow: Shadow[];
  border?: Border;
  borderRadius?: BorderRadius;
  cursor?: string;
  children?: ReactNode;
};

const Container: GraftComponent = ({ children, ...rest }: GraftComponentProps) => {
  const componentId = useComponentId();
  const hasChildren = useEditorState(
    useCallback(
      (state) => (state[componentId].childrenNodes.length > 0) as unknown as object,
      [componentId]
    )
  );

  // TODO: Provide a way to select a subsection of props.
  const { height, ...restProps } = useComponentProps() as ContainerComponentProps;

  // If there is no children and no height, give it some so that it is visible.
  // TODO: https://github.com/pepsighan/nocode/issues/15.
  const resolvedHeight: DimensionSize = height.size
    ? height
    : hasChildren
    ? null
    : { size: 80, unit: 'px' };

  return (
    <Outline>
      <div {...rest}>
        <ContainerComp {...restProps} height={resolvedHeight} direction="column">
          {children}
        </ContainerComp>
      </div>
    </Outline>
  );
};

// The default props defines all the props that the component can accept exhaustively.
// This field is used by the update options logic.
const defaultProps: ContainerComponentProps = {
  name: null,
  tag: 'div',
  width: {
    size: null,
    unit: 'px',
  },
  height: {
    size: null,
    unit: 'px',
  },
  padding: { top: 0, right: 0, bottom: 0, left: 0 },
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  color: { r: 220, g: 220, b: 255, a: 1 },
  mainAxisAlignment: 'flex-start',
  crossAxisAlignment: 'flex-start',
  opacity: 1,
  shadow: [],
  border: null,
  borderRadius: null,
  cursor: null,
};

Container.graftOptions = {
  defaultProps,
  isCanvas: true,
  display: 'block',
};

export default Container;
