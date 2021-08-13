/** @jsxImportSource @emotion/react */
import { DimensionSize, Text } from '@graftini/bricks';
import { useComponentId } from '@graftini/graft';
import { forwardRef, memo, MouseEventHandler, useCallback } from 'react';
import { TextTag } from 'utils/constants';
import { defaultTextFormValues } from './formFields';
import { useProseEditor } from './ProseEditorContext';
import useIsSelected from './useIsSelected';
import useMakeEditorEditable from './useMakeEditorEditable';

type ProseEditorProps = {
  tag: TextTag;
  width: DimensionSize;
  height: DimensionSize;
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
      tag,
      width,
      height,
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

    const isSelected = useIsSelected(componentId);
    useMakeEditorEditable(isEditing);

    return (
      <Text
        ref={forwardedRef}
        tag={tag}
        isEditor
        onMouseDown={onMouseDown}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
        width={width}
        height={height}
        {...defaultTextFormValues}
        content={onInitialState()}
        cursor={isEditing ? 'text' : 'default'}
      >
        {isSelected ? (
          <div
            ref={onEdit}
            css={{
              // This otherwise the cursor does not show on Safari.
              userSelect: 'auto',
              // This is require to add trailing spaces while typing in Firefox.
              whiteSpace: 'pre-wrap',
            }}
          />
        ) : null}
      </Text>
    );
  }
);

// The parent text component keeps on changing with changing props.
// The text editor does not need to update to those extra props.
const ProseEditorMemo = memo(ProseEditor);
export default ProseEditorMemo;
