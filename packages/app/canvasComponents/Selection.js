/** @jsxImportSource @emotion/react */
import { Portal } from '@chakra-ui/portal';
import { mdiDelete } from '@mdi/js';
import Icon from '@mdi/react';
import { useComponentId, useEditor, useEditorState } from 'graft';
import { useDimensions } from 'hooks/useDimensions';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';
import theme from 'utils/theme';

export default function Selection({ componentRef }) {
  const componentId = useComponentId();
  const isSelected = useDesignerState(
    useCallback((state) => state.selectedComponentId === componentId, [componentId])
  );

  return isSelected ? (
    <ActualSelection componentId={componentId} componentRef={componentRef} />
  ) : null;
}

function ActualSelection({ componentId, componentRef }) {
  const name = useEditorState(useCallback((state) => state[componentId].props.name, [componentId]));

  // Re-render the outline if the props changes. The props may cause the component to change its size.
  const props = useEditorState(useCallback((state) => state[componentId].props, [componentId]));
  const { top, left, width, height } = useDimensions(componentRef, [props]);

  const isNotVisible = width === 0 && height === 0;

  const onDelete = useOnDelete({ componentId });

  return (
    <Portal>
      {!isNotVisible && (
        <>
          {/* This is the panel on which options of the components are show. */}
          <div
            css={{
              display: 'flex',
              alignItems: 'center',
              position: 'fixed',
              // If it overflows from the top, then show it to the bottom of the component.
              top: top - 19 >= 0 ? top - 19 : top + height - 1,
              left: left,
              backgroundColor: theme.colors.primary[300],
              fontSize: 12,
              height: 20,
              paddingLeft: 8,
              paddingRight: 8,
            }}
          >
            <span css={{ color: theme.colors.white }}>{name || 'Untitled'}</span>
            <button
              css={{ marginLeft: 4, cursor: 'pointer', color: theme.colors.white }}
              onClick={onDelete}
            >
              <Icon path={mdiDelete} css={{ height: 14 }} />
            </button>
          </div>
          <div
            css={{
              position: 'fixed',
              top: top,
              left: left,
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
