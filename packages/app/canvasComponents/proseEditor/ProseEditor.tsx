/** @jsxImportSource @emotion/react */
import { Text } from '@graftini/bricks';
import { useComponentId } from '@graftini/graft';
import { forwardRef, MouseEventHandler, useCallback } from 'react';
import { defaultTextFormValues } from './formFields';
import { useProseEditor } from './ProseEditorContext';

type ProseEditorProps = {
  isEditing: boolean;
  onInitialState: () => any;
  onMouseDown?: MouseEventHandler;
  onClick: MouseEventHandler;
  onDoubleClick: MouseEventHandler;
  onContextMenu: MouseEventHandler;
};

const ProseEditor = forwardRef(
  (
    {
      isEditing,
      onClick,
      onContextMenu,
      onMouseDown,
      onDoubleClick,
      onInitialState,
    }: ProseEditorProps,
    forwardedRef
  ) => {
    const componentId = useComponentId();
    const { onInitialize } = useProseEditor();

    // When editing starts, register the ref to start the prose editor.
    const onEdit = useCallback(
      (ref) => {
        onInitialize({
          ref,
          componentId,
          initialState: onInitialState(),
        });
      },
      [componentId, onInitialState, onInitialize]
    );

    return (
      <Text
        ref={forwardedRef}
        isEditor
        onMouseDown={onMouseDown}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
        {...defaultTextFormValues}
        content={onInitialState()}
      >
        {isEditing ? <div ref={onEdit} /> : null}
      </Text>
    );
  }
);

export default ProseEditor;
