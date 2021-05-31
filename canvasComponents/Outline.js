/** @jsxImportSource @emotion/react */
import { Portal } from '@chakra-ui/portal';
import { useComponentId, useEditor, useEditorState } from '@graftini/graft';
import { mdiDelete } from '@mdi/js';
import Icon from '@mdi/react';
import { useDimensions } from 'hooks/useDimensions';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';
import theme from 'utils/theme';

export default function Outline({ componentRef }) {
  const componentId = useComponentId();
  const isSelected = useDesignerState(
    useCallback((state) => state.selectedComponentId === componentId, [componentId])
  );

  return isSelected ? (
    <ActualOutline componentId={componentId} componentRef={componentRef} />
  ) : null;
}

function ActualOutline({ componentId, componentRef }) {
  const name = useEditorState(useCallback((state) => state[componentId].props.name, [componentId]));
  const dimensions = useDimensions(componentRef);
  const { x, y, width, height } = dimensions ?? {};

  const onDelete = useOnDelete({ componentId });

  return (
    <Portal>
      {dimensions && (
        <>
          {/* This is the panel on which options of the components are show. */}
          <div
            css={{
              display: 'flex',
              alignItems: 'center',
              position: 'fixed',
              // If it overflows from the top, then show it to the bottom of the component.
              top: y - 20 >= 0 ? y - 20 : y + height,
              left: x,
              backgroundColor: theme.colors.primary[300],
              fontSize: 12,
              height: 20,
              paddingLeft: 8,
              paddingRight: 8,
            }}
          >
            <span css={{ color: theme.colors.white }}>{name ?? 'Untitled'}</span>
            <button
              css={{ marginLeft: 4, cursor: 'pointer', color: theme.colors.white }}
              onClick={onDelete}
            >
              <Icon path={mdiDelete} size={0.6} />
            </button>
          </div>
          <div
            css={{
              position: 'fixed',
              top: y,
              left: x,
              width,
              height,
              border: `2px solid ${theme.colors.primary[300]}`,
              pointerEvents: 'none',
            }}
          />
        </>
      )}
    </Portal>
  );
}

export function useSelectComponent() {
  return useDesignerState(useCallback((state) => state.selectComponent, []));
}

function useOnDelete({ componentId }) {
  const { deleteComponentNode } = useEditor();
  const unselectComonent = useDesignerState(useCallback((state) => state.unselectComonent, []));

  return useCallback(
    (ev) => {
      ev.stopPropagation();
      unselectComonent();
      deleteComponentNode(componentId);
    },
    [componentId, deleteComponentNode, unselectComonent]
  );
}
