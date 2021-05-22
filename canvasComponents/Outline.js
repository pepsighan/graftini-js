/** @jsxImportSource @emotion/react */
import { useComponentId, useEditor, useEditorState } from '@graftini/graft';
import { useCallback } from 'react';
import { MdDelete } from 'react-icons/md';
import { useDesignerState } from 'store/designer';

export default function Outline({ children }) {
  const componentId = useComponentId();
  const isSelected = useDesignerState(
    useCallback((state) => state.selectedComponentId === componentId, [componentId])
  );
  const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));
  const name = useEditorState(useCallback((state) => state[componentId].props.name, [componentId]));

  const unselectComonent = useDesignerState(useCallback((state) => state.unselectComonent, []));
  const { deleteComponentNode } = useEditor();

  const onDelete = useCallback(
    (ev) => {
      ev.stopPropagation();
      unselectComonent();
      deleteComponentNode(componentId);
    },
    [componentId, deleteComponentNode, unselectComonent]
  );

  return (
    <div
      position="relative"
      outline={isSelected ? '1px solid #9999ff' : null}
      css={{
        '& > .component-toolbox': {
          display: isSelected ? 'block' : 'none',
        },

        '&:hover': {
          outline: '1px solid #9999ff',
        },
      }}
      onClick={useCallback(
        (ev) => {
          ev.stopPropagation();
          return selectComponent(componentId);
        },
        [componentId, selectComponent]
      )}
    >
      <div
        className="component-toolbox"
        display="flex"
        alignItems="center"
        position="absolute"
        top={0}
        left={0}
        transform="translateY(-100%)"
        fontSize="xs"
        px={2}
        py={0.5}
        backgroundColor="blue.200"
      >
        {name || 'Untitled'}
        <button size="xs" p={0.5} ml={2} height="unset" minWidth="unset" onClick={onDelete}>
          <MdDelete />
        </button>
      </div>
      {children}
    </div>
  );
}
