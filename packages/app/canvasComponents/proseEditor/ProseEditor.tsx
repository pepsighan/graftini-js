/** @jsxImportSource @emotion/react */
import { Text } from '@graftini/bricks';
import { useComponentId } from '@graftini/graft';
import { forwardRef, MouseEventHandler, useCallback } from 'react';
import { defaultTextFormValues } from './formFields';
import { useProseEditor } from './ProseEditorContext';
import useDisableEditorWhenNotInUse from './useDisableEditorWhenNotInUse';

type ProseEditorProps = {
  onInitialState: () => any;
  onMouseDown?: MouseEventHandler;
  onClick: MouseEventHandler;
  onDoubleClick: MouseEventHandler;
  onContextMenu: MouseEventHandler;
};

const ProseEditor = forwardRef(
  (
    { onClick, onContextMenu, onMouseDown, onDoubleClick, onInitialState }: ProseEditorProps,
    forwardedRef
  ) => {
    const componentId = useComponentId();

    const { onInitialize, editorView } = useProseEditor();
    useDisableEditorWhenNotInUse(editorView);

    return (
      <Text
        ref={forwardedRef}
        isEditor
        onMouseDown={onMouseDown}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
        {...defaultTextFormValues}
      >
        <div
          ref={useCallback(
            (ref) => {
              onInitialize({
                ref,
                componentId,
                initialState: onInitialState(),
              });
            },
            [componentId, onInitialState, onInitialize]
          )}
        />
      </Text>
    );
  }
);

export default ProseEditor;
