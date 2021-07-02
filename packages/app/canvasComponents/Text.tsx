/** @jsxImportSource @emotion/react */
import { FontSize, FontWeight, RGBA, Text as Txt, TextAlign } from '@graftini/bricks';
import { GraftComponent, useComponentId } from '@graftini/graft';
import { RawDraftContentState } from 'draft-js';
import { forwardRef, MouseEvent, useCallback } from 'react';
import { useDesignerState, useIsDraggingDisabled } from 'store/designer';
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
    const startEditingText = useDesignerState(useCallback((state) => state.startEditingText, []));

    const isEditable = useDesignerState(
      useCallback(
        (state) => state.selectedComponentId === componentId && state.isTextEditingEnabled,
        [componentId]
      )
    );

    const isDraggingDisabled = useIsDraggingDisabled();

    const onClick = useCallback(
      (ev: MouseEvent) => {
        ev.stopPropagation();
        return selectComponent(componentId);
      },
      [componentId, selectComponent]
    );

    // Enable editing.
    const onDoubleClick = useCallback(() => {
      startEditingText();
    }, [startEditingText]);

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
        onDoubleClick={onDoubleClick}
      >
        <TextEditor value={content ?? contentDefault} isEditable={isEditable} />
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
