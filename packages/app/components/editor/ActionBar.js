/** @jsxImportSource @emotion/react */
import { useEditorStore, useOnDelete } from '@graftini/graft';
import { TrashIcon } from '@modulz/radix-icons';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';
import theme from 'utils/theme';

export default function ActionBar({ componentId }) {
  const name = useEditorStore(
    useCallback((state) => state.componentMap[componentId].props.name, [componentId])
  );
  const onDelete = useOnDeleteComponent({ componentId });

  return (
    <>
      <span
        css={{
          color: theme.colors.white,
          lineHeight: 'initial',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {name || 'Untitled'}
      </span>
      <button
        css={{ marginLeft: 6, cursor: 'pointer', color: theme.colors.white }}
        onClick={onDelete}
      >
        <TrashIcon />
      </button>
    </>
  );
}

function useOnDeleteComponent({ componentId }) {
  const unselectComponent = useDesignerState(useCallback((state) => state.unselectComponent, []));
  const onDeleteComponent = useOnDelete();

  return useCallback(
    (ev) => {
      ev.stopPropagation();
      unselectComponent();
      onDeleteComponent(componentId);
    },
    [componentId, onDeleteComponent, unselectComponent]
  );
}
