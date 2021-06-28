/** @jsxImportSource @emotion/react */
import { useEditorState } from '@graftini/graft';
import { TrashIcon } from '@modulz/radix-icons';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';
import theme from 'utils/theme';

export default function ActionBar({ componentId }) {
  const name = useEditorState(
    useCallback((state) => state.componentMap[componentId].props.name, [componentId])
  );
  const onDelete = useOnDelete({ componentId });

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

function useOnDelete({ componentId }) {
  const immerSet = useEditorState(useCallback((state) => state.immerSet, []));
  const unselectComponent = useDesignerState(useCallback((state) => state.unselectComponent, []));

  return useCallback(
    (ev) => {
      ev.stopPropagation();
      unselectComponent();

      immerSet((state) => {
        delete state.componentMap[componentId];
      });
    },
    [componentId, immerSet, unselectComponent]
  );
}
