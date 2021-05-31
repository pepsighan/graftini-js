import {
  Alignment,
  Border,
  BorderRadius,
  Container as ContainerComp,
  DimensionSize,
  RGBA,
  Shadow,
  Spacing,
} from '@graftini/components';
import { GraftComponent, useComponentId, useEditorState } from '@graftini/graft';
import { Property } from 'csstype';
import { ReactNode, useCallback } from 'react';
import Outline from './Outline';

export type ContainerComponentProps = {
  name?: string;
  tag: ContainerTag;
  width: DimensionSize;
  height: DimensionSize;
  padding: Spacing;
  margin: Spacing;
  color: RGBA;
  mainAxisAlignment: Alignment;
  crossAxisAlignment: Alignment;
  opacity: number;
  shadow: Shadow[];
  border?: Border;
  borderRadius?: BorderRadius;
  cursor?: Property.Cursor;
  children?: ReactNode;
};

const Container: GraftComponent<ContainerComponentProps> = ({
  onDragStart,
  onDragOver,
  onDragLeave,
  draggable,
  children,
  height,
  ...rest
}) => {
  const componentId = useComponentId();
  const hasChildren = useEditorState(
    useCallback(
      (state) => (state[componentId].childrenNodes.length > 0) as unknown as object,
      [componentId]
    )
  );

  // If there is no children and no height, give it some so that it is visible.
  // TODO: https://github.com/pepsighan/nocode/issues/15.
  const resolvedHeight: DimensionSize = height.size
    ? height
    : hasChildren
    ? null
    : { size: 80, unit: 'px' };

  return (
    <Outline>
      <div
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        draggable={draggable}
      >
        <ContainerComp {...rest} height={resolvedHeight} direction="column">
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
    name: null,
    tag: 'div',
    width: null,
    height: null,
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
  },
  isCanvas: true,
  display: 'block',
};

export default Container;

export type ContainerTag =
  | 'div'
  | 'span'
  | 'main'
  | 'button'
  | 'section'
  | 'input'
  | 'select'
  | 'checkbox'
  | 'header'
  | 'footer';

export const containerTags: ContainerTag[] = [
  'div',
  'span',
  'button',
  'input',
  'select',
  'checkbox',
  'main',
  'section',
  'header',
  'footer',
];
