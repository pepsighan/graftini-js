/** @jsxImportSource @emotion/react */
import { mdiDelete } from '@mdi/js';
import Icon from 'components/Icon';
import { useEditor, useEditorState } from 'graft';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';
import theme from 'utils/theme';

export default function ActionBar({ componentId }) {
  const name = useEditorState(useCallback((state) => state[componentId].props.name, [componentId]));
  const onDelete = useOnDelete({ componentId });

  return (
    <>
      <span css={{ color: theme.colors.white }}>{name || 'Untitled'}</span>
      <button
        css={{ marginLeft: 4, cursor: 'pointer', color: theme.colors.white }}
        onClick={onDelete}
      >
        <Icon path={mdiDelete} css={{ height: 14 }} />
      </button>
    </>
  );
}

function useOnDelete({ componentId }) {
  const { deleteComponentNode } = useEditor();
  const unselectComponent = useDesignerState(useCallback((state) => state.unselectComponent, []));

  return useCallback(
    (ev) => {
      ev.stopPropagation();
      unselectComponent();
      deleteComponentNode(componentId);
    },
    [componentId, deleteComponentNode, unselectComponent]
  );
}
