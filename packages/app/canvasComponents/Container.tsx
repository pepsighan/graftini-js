import {
  AlignItems,
  Border,
  BorderRadius,
  Container as ContainerComp,
  Cursor,
  FlexDirection,
  JustifyContent,
  Overflow,
  RGBA,
  Shadow,
  Spacing,
} from 'bricks';
import { GraftComponent, useComponentId } from 'graft';
import { ReactNode, useCallback, useRef } from 'react';
import { ContainerDimension } from './ContainerOptions';
import { useContainerTransformedProps } from './ContainerRender';
import Outline, { useSelectComponent } from './Outline';

export type ContainerComponentProps = {
  name?: string;
  tag: ContainerTag;
  width: ContainerDimension;
  height: ContainerDimension;
  padding: Spacing;
  margin: Spacing;
  color: RGBA;
  justifyContent: JustifyContent;
  alignItems: AlignItems;
  opacity: number;
  shadow: Shadow[];
  border?: Border;
  borderRadius?: BorderRadius;
  cursor?: Cursor;
  overflow?: Overflow;
  flexDirection: FlexDirection;
  children?: ReactNode;
};

const Container: GraftComponent<ContainerComponentProps> = ({
  children,
  draggable,
  onDragStart,
  onDragOver,
  onDragLeave,
  ...rest
}) => {
  const componentId = useComponentId();

  const ref = useRef();
  const selectComponent = useSelectComponent();

  return (
    <>
      <ContainerComp
        ref={ref}
        {...useContainerTransformedProps(rest)}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={useCallback(
          (ev) => {
            ev.stopPropagation();
            return selectComponent(componentId);
          },
          [componentId, selectComponent]
        )}
      >
        {children}
      </ContainerComp>
      <Outline componentRef={ref} />
    </>
  );
};

Container.graftOptions = {
  // The default props defines all the props that the component can accept exhaustively.
  // This field is used by the update options logic.
  defaultProps: {
    name: null,
    tag: 'div',
    width: {
      size: 100,
      unit: '%',
    },
    height: {
      size: 200,
      unit: 'px',
    },
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color: { r: 220, g: 220, b: 255, a: 1 },
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    opacity: 1,
    shadow: [],
    border: null,
    borderRadius: {
      topLeft: 0,
      topRight: 0,
      bottomLeft: 0,
      bottomRight: 0,
    },
    cursor: null,
    overflow: {
      x: 'visible',
      y: 'visible',
    },
    flexDirection: 'column',
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
