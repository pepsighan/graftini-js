import {
  Alignment,
  Border,
  BorderRadius,
  Container as ContainerComp,
  DimensionSize,
  Overflow,
  RGBA,
  Shadow,
  Spacing,
} from '@graftini/components';
import { GraftComponent, useComponentId } from '@graftini/graft';
import { Property } from 'csstype';
import { ReactNode, useCallback, useRef } from 'react';
import Outline, { useSelectComponent } from './Outline';

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
  overflow?: Overflow;
  children?: ReactNode;
};

const Container: GraftComponent<ContainerComponentProps> = ({ children, ...rest }) => {
  const componentId = useComponentId();

  const ref = useRef();
  const selectComponent = useSelectComponent();

  return (
    <>
      <ContainerComp
        ref={ref}
        {...rest}
        onClick={useCallback(
          (ev) => {
            ev.stopPropagation();
            return selectComponent(componentId);
          },
          [componentId, selectComponent]
        )}
        direction="column"
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
    mainAxisAlignment: 'flex-start',
    crossAxisAlignment: 'flex-start',
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
