import { Container as ContainerComp, ContainerProps } from '@graftini/components';
import {
  GraftComponent,
  GraftComponentProps,
  useComponentId,
  useComponentProps,
  useEditorState,
} from '@graftini/graft';
import { useCallback } from 'react';
import Outline from './Outline';

const Container: GraftComponent = ({ children, ...rest }: GraftComponentProps) => {
  const componentId = useComponentId();
  const hasChildren = useEditorState(
    useCallback(
      (state) => (state[componentId].childrenNodes.length > 0) as unknown as object,
      [componentId]
    )
  );

  // TODO: Provide a way to select a subsection of props.
  const { height, ...restProps } = useComponentProps();

  // If there is no children and no height, give it some so that it is visible.
  // TODO: https://github.com/pepsighan/nocode/issues/15.
  const resolvedHeight = height?.size ? height : hasChildren ? null : { size: 80, unit: 'px' };

  return (
    <Outline>
      <div {...rest}>
        <ContainerComp {...restProps} height={resolvedHeight}>
          {children}
        </ContainerComp>
      </div>
    </Outline>
  );
};

Container.graftOptions = {
  // The default props defines all the props that the component can accept exhaustively.
  // This field is used by the update options logic.
  defaultProps: {
    name: '',
    tag: 'div',
    direction: 'column',
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
  } as ContainerProps,
  isCanvas: true,
  display: 'block',
};

export default Container;
