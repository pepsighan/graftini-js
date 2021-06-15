/** @jsxImportSource @emotion/react */
import { FontSize, FontWeight, RGBA, Text as Txt, TextAlign } from 'bricks';
import { GraftComponent, useComponentId } from 'graft';
import useUnselectOnDragStart from 'hooks/useUnselectOnDragStart';
import { forwardRef, useCallback } from 'react';
import { Descendant } from 'slate';
import { useCanvasClickTrigger } from 'store/canvasClickTrigger';
import { useDesignerState } from 'store/designer';
import TextEditor from './form/TextEditor';

export type TextComponentProps = {
  text: Descendant[];
  color?: RGBA;
  fontSize?: FontSize;
  fontFamily?: string;
  fontWeight?: FontWeight;
  textAlign?: TextAlign;
};

const Text: GraftComponent<TextComponentProps> = forwardRef(
  ({ text, onDragStart, ...rest }, ref) => {
    const componentId = useComponentId();
    const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));
    const triggerClick = useCanvasClickTrigger(useCallback((state: any) => state.trigger, []));

    const { text: textDefault, ...defaultRest } = Text.graftOptions.defaultProps;

    // Merge the incoming props with the default props so that any new props introduced in
    // the future get supported easily for existing projects.
    const textProps = {
      ...defaultRest,
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
        <TextEditor initialState={text ?? textDefault} />
      </Txt>
    );
  }
);

Text.graftOptions = {
  // The default props defines all the props that the component can accept exhaustively.
  // This field is used by the update options logic.
  defaultProps: {
    color: { r: 0, g: 0, b: 0, a: 1 },
    text: [{ type: 'paragraph', children: [{ text: 'Text' }] }] as any, // The type of the lib is wrong.
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
