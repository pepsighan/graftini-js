/** @jsxImportSource @emotion/react */
import { FontSize, FontWeight, RGBA, Text as Txt, TextAlign } from 'bricks';
import { GraftComponent, useComponentId } from 'graft';
import useUnselectOnDragStart from 'hooks/useUnselectOnDragStart';
import { forwardRef, MouseEvent, useCallback, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { Descendant } from 'slate';
import { useCanvasClickTrigger } from 'store/canvasClickTrigger';
import { useDesignerState, useDesignerStateApi } from 'store/designer';
import TextEditor from './textEditor/TextEditor';

export type TextComponentProps = {
  name?: string;
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

    const onClick = useCallback(
      (ev: MouseEvent) => {
        ev.stopPropagation();
        // We need to trigger a click to be notified because we are stopping propagation.
        // Stopping propagation is also needed for us to select the top most component.
        triggerClick();
        return selectComponent(componentId);
      },
      [componentId, selectComponent, triggerClick]
    );

    const { subscribe } = useDesignerStateApi();
    const [isEditable, setIsEditable] = useState(false);

    // Enable editing.
    const onDoubleClick = useCallback(() => {
      setIsEditable(true);
    }, []);

    // Reset the editable state once the component is no longer selected.
    useEffectOnce(() => {
      return subscribe(
        (isSelected) => {
          if (!isSelected) {
            setIsEditable(false);
          }
        },
        (state) => state.selectedComponentId === componentId
      );
    });

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
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        <TextEditor value={text ?? textDefault} isEditable={isEditable} />
      </Txt>
    );
  }
);

Text.graftOptions = {
  // The default props defines all the props that the component can accept exhaustively.
  // This field is used by the update options logic.
  defaultProps: {
    name: 'Text',
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
