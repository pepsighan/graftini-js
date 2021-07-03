/** @jsxImportSource @emotion/react */
import { GraftComponent, useComponentId } from '@graftini/graft';
import { RawDraftContentState } from 'draft-js';
import { forwardRef, MouseEvent, useCallback, useEffect, useMemo, useRef } from 'react';
import { useDesignerState, useDesignerStateApi, useIsDraggingDisabled } from 'store/designer';
import TextEditor from './textEditor/TextEditor';

export type TextComponentProps = {
  name?: string;
  content: RawDraftContentState;
};

const Text: GraftComponent<TextComponentProps> = forwardRef(({ onMouseDown }, ref) => {
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

  return (
    // The text component keeps on changing with changing props.
    // The text editor does not need to update to those extra props.
    <>
      {useMemo(
        () => (
          <TextEditor
            ref={ref}
            onMouseDown={!isDraggingDisabled ? onMouseDown : null}
            onClick={onClick}
          />
        ),
        [isDraggingDisabled, onClick, onMouseDown, ref]
      )}
    </>
  );
});

/**
 * Enables editing text only if the same component is clicked twice.
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
  defaultProps: {
    name: 'Text',
    // The standard format for DraftJS.
    content: {
      blocks: [],
      entityMap: {},
    },
  },
};

export default Text;
