/** @jsxImportSource @emotion/react */
import { FontSize, FontWeight, RGBA, Text as Txt, TextAlign } from 'bricks';
import { GraftComponent, useComponentId } from 'graft';
import { forwardRef, useCallback } from 'react';
import { useCanvasClickTrigger } from 'store/canvasClickTrigger';
import { useDesignerState } from 'store/designer';
import useUnselectOnDragStart from '../hooks/useUnselectOnDragStart';
import TextEditor from './form/TextEditor';

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
    const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));
    const triggerClick = useCanvasClickTrigger(useCallback((state: any) => state.trigger, []));

    // Merge the incoming props with the default props so that any new props introduced in
    // the future get supported easily for existing projects.
    const textProps = {
      ...Text.defaultProps,
      ...rest,
    };

    return (
      <Txt
        ref={ref}
        onDragStart={useUnselectOnDragStart(onDragStart)}
        {...textProps}
        onClick={useCallback(
          (ev) => {
            ev.stopPropagation();
            // We need to trigger a click to be notified because we are stopping propagation.
            // Stopping propagation is also needed for us to select the top most component.
            triggerClick();
            return selectComponent(componentId);
          },
          [componentId, selectComponent, triggerClick]
        )}
      >
        <TextEditor />
      </Txt>
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
