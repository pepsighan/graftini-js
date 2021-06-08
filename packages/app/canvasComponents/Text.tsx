/** @jsxImportSource @emotion/react */
import { useMergeRefs } from '@chakra-ui/hooks';
import { FontSize, FontWeight, RGBA, Text as Txt, TextAlign } from 'bricks';
import { GraftComponent, useComponentId } from 'graft';
import { forwardRef, useCallback, useRef } from 'react';
import Outline, { useSelectComponent } from './Outline';

export type TextComponentProps = {
  color?: RGBA;
  content?: string;
  fontSize?: FontSize;
  fontFamily?: string;
  fontWeight?: FontWeight;
  textAlign?: TextAlign;
};

const Text: GraftComponent<TextComponentProps> = forwardRef(
  ({ content, ...rest }, forwardedRef) => {
    const componentId = useComponentId();
    const selectComponent = useSelectComponent();

    const ref = useRef();
    const mergedRef = useMergeRefs(ref, forwardedRef);

    return (
      <>
        <Txt
          ref={mergedRef}
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
        <Outline componentRef={ref} />
      </>
    );
  }
);

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
