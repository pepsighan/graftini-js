/** @jsxImportSource @emotion/react */
import { Box } from '@chakra-ui/layout';
import { FontSize, FontWeight, RGBA, Text as Txt, TextAlign } from 'bricks';
import { GraftComponent, useComponentId } from 'graft';
import { forwardRef, useCallback } from 'react';
import { useSelectComponent } from '../components/editor/Selection';
import useUnselectOnDragStart from '../hooks/useUnselectOnDragStart';

export type TextComponentProps = {
  color?: RGBA;
  content?: string;
  fontSize?: FontSize;
  fontFamily?: string;
  fontWeight?: FontWeight;
  textAlign?: TextAlign;
};

const Text: GraftComponent<TextComponentProps> = forwardRef(
  ({ content, onDragStart, ...rest }, ref) => {
    const componentId = useComponentId();
    const selectComponent = useSelectComponent();

    return (
      <Txt
        ref={ref}
        onDragStart={useUnselectOnDragStart(onDragStart)}
        {...rest}
        onClick={useCallback(
          (ev) => {
            ev.stopPropagation();
            return selectComponent(componentId);
          },
          [componentId, selectComponent]
        )}
      >
        {content}
      </Txt>
    );
  }
);

function Preview() {
  return <Box width="200px" height="32px" borderRadius="md" bg="primary.400" />;
}

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
  preview: Preview,
};

export default Text;
