/** @jsxImportSource @emotion/react */
import { useComponentId, useEditor, useEditorState } from '@graftini/graft';
import { useCallback } from 'react';
import { MdDelete } from 'react-icons/md';
import { useDesignerState } from 'store/designer';
import theme from 'utils/theme';

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
      css={{
        position: 'relative',
        outline: isSelected ? '1px solid #9999ff' : null,
        width: '100%',

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
        css={{
          paddingLeft: 8,
          paddingRight: 8,
          paddingTop: 2,
          paddingBottom: 2,
          backgroundColor: theme.colors.blue[200],
          fontSize: 12,
          transform: 'translateY(-100%)',
          top: 0,
          left: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {name || 'Untitled'}
        <button onClick={onDelete}>
          <MdDelete />
        </button>
      </div>
      {children}
    </div>
  );
}
