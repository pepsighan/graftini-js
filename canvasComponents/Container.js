import { Container as ContainerComp } from '@graftini/components';
import { useComponentId, useComponentProps, useEditorState } from '@graftini/graft';
import { useCallback } from 'react';
import Outline from './Outline';

function Container({ children, ...rest }) {
  const componentId = useComponentId();
  const hasChildren = useEditorState(
    useCallback((state) => state[componentId].childrenNodes.length > 0, [componentId])
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
}

Container.graftOptions = {
  defaultProps: {
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
    padding: null,
    margin: null,
    color: { r: 220, g: 220, b: 255, a: 1 },
    mainAxisAlignment: 'flex-start',
    crossAxisAlignment: 'flex-start',
  },
  isCanvas: true,
  display: 'block',
};

Container.Render = ContainerComp;
export default Container;
