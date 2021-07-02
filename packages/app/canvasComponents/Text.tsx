/** @jsxImportSource @emotion/react */
import { FontSize, FontWeight, RGBA, Text as Txt, TextAlign } from '@graftini/bricks';
import { GraftComponent, useComponentId } from '@graftini/graft';
import { RawDraftContentState } from 'draft-js';
import { forwardRef, MouseEvent, useCallback, useEffect, useRef } from 'react';
import { useDesignerState, useDesignerStateApi, useIsDraggingDisabled } from 'store/designer';
import TextEditor from './textEditor/TextEditor';

export type TextComponentProps = {
  name?: string;
  content: RawDraftContentState;
  color?: RGBA;
  fontSize?: FontSize;
  fontFamily?: string;
  fontWeight?: FontWeight;
  textAlign?: TextAlign;
};

const Text: GraftComponent<TextComponentProps> = forwardRef(
  ({ content, onMouseDown, ...rest }, ref) => {
    const componentId = useComponentId();
    const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));
    const isDraggingDisabled = useIsDraggingDisabled();

    const onEnableTextEditing = useEnableTextEditing({ componentId });

    const onClick = useCallback(
      (ev: MouseEvent) => {
        ev.stopPropagation();
        onEnableTextEditing();
        return selectComponent(componentId);
      },
      [componentId, onEnableTextEditing, selectComponent]
    );

    const { content: contentDefault, ...defaultRest } = Text.graftOptions.defaultProps;

    // Merge the incoming props with the default props so that any new props introduced in
    // the future get supported easily for existing projects.
    const textProps = {
      ...defaultRest,
      ...rest,
    };

    return (
      <Txt
        ref={ref}
        {...textProps}
        onMouseDown={!isDraggingDisabled ? onMouseDown : null}
        onClick={onClick}
      >
        <TextEditor value={content ?? contentDefault} />
      </Txt>
    );
  }
);

/**
 * Enables editing text only if the same component is clicked twice.
 * Though enabling text editing is no required for it to work. This is to
 * notify the rest of the app that a text editor is active.
 */
function useEnableTextEditing({ componentId }) {
  const clickCount = useRef(0);
  const startEditingText = useDesignerState(useCallback((state) => state.startEditingText, []));

  const { subscribe } = useDesignerStateApi();

  useEffect(() => {
    return subscribe(
      (isSelected) => {
        if (!isSelected) {
          // Reset the counter once its no longer selected.
          clickCount.current = 0;
        }
      },
      (state) => state.selectedComponentId === componentId
    );
  }, [componentId, subscribe]);

  return useCallback(() => {
    clickCount.current += 1;
    if (clickCount.current >= 2) {
      // If the same component is clicked twice, start editing text.
      startEditingText();
    }
  }, [startEditingText]);
}

Text.graftOptions = {
  // The default props defines all the props that the component can accept exhaustively.
  // This field is used by the update options logic.
  defaultProps: {
    name: 'Text',
    color: { r: 0, g: 0, b: 0, a: 1 },
    // The standard format for DraftJS.
    content: {
      blocks: [],
      entityMap: {},
    },
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
