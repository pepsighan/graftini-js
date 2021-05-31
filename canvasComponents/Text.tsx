/** @jsxImportSource @emotion/react */
import { FontSize, FontWeight, RGBA, Text as Txt, TextAlign } from '@graftini/components';
import { GraftComponent, useComponentId } from '@graftini/graft';
import { useCallback, useRef } from 'react';
import Outline, { useSelectComponent } from './Outline';

export type TextComponentProps = {
  color?: RGBA;
  content?: string;
  fontSize?: FontSize;
  fontFamily?: string;
  fontWeight?: FontWeight;
  textAlign?: TextAlign;
};

const Text: GraftComponent<TextComponentProps> = ({
  onDragStart,
  onDragOver,
  onDragLeave,
  draggable,
  content,
  ...rest
}) => {
  const componentId = useComponentId();
  const selectComponent = useSelectComponent();

  const ref = useRef();

  return (
    <>
      <div
        ref={ref}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        draggable={draggable}
        style={{ width: '100%' }}
        onClick={useCallback(
          (ev) => {
            ev.stopPropagation();
            return selectComponent(componentId);
          },
          [componentId, selectComponent]
        )}
      >
        <Txt {...rest}>{content}</Txt>
      </div>
      <Outline componentRef={ref} />
    </>
  );
};

Text.graftOptions = {
  // The default props defines all the props that the component can accept exhaustively.
  // This field is used by the update options logic.
  defaultProps: {
    color: { r: 0, g: 0, b: 0, a: 1 },
    content: 'Lorem ipsum dolor sit amet.',
    fontSize: {
      size: 16,
      unit: 'px',
    },
    fontFamily: 'sans-serif',
    fontWeight: 400, // normal weight.
    textAlign: 'left',
  },
};

export default Text;
