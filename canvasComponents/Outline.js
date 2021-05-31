/** @jsxImportSource @emotion/react */
import { Portal } from '@chakra-ui/portal';
import { useComponentId, useEditor, useEditorState } from '@graftini/graft';
import { useDimensions } from 'hooks/useDimensions';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';
import theme from 'utils/theme';

export default function Outline({ componentRef }) {
  const componentId = useComponentId();
  const isSelected = useDesignerState(
    useCallback((state) => state.selectedComponentId === componentId, [componentId])
  );

  return (
    <>{isSelected && <ActualOutline componentId={componentId} componentRef={componentRef} />}</>
  );
}

function ActualOutline({ componentId, componentRef }) {
  const name = useEditorState(useCallback((state) => state[componentId].props.name, [componentId]));
  const dimensions = useDimensions(componentRef);
  const { x, y, width, height } = dimensions ?? {};

  return (
    <Portal>
      {dimensions && (
        <div
          css={{
            position: 'fixed',
            top: y,
            left: x,
            width,
            height,
            border: `2px solid ${theme.colors.primary[300]}`,
          }}
        />
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
