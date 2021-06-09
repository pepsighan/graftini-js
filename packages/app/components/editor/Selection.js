/** @jsxImportSource @emotion/react */
import { mdiDelete } from '@mdi/js';
import Icon from '@mdi/react';
import { motion, useMotionValue } from 'framer-motion';
import { useComponentRegion, useEditor, useEditorState } from 'graft';
import { useCallback, useEffect } from 'react';
import { useDesignerState } from 'store/designer';
import theme from 'utils/theme';

export default function Selection() {
  const componentId = useDesignerState(useCallback((state) => state.selectedComponentId, []));
  return componentId ? <ActualSelection componentId={componentId} /> : null;
}

function ActualSelection({ componentId }) {
  const name = useEditorState(useCallback((state) => state[componentId].props.name, [componentId]));
  const onDelete = useOnDelete({ componentId });
  const { get, subscribe } = useComponentRegion(componentId);

  const posX = useMotionValue(0);
  const posY = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);

  useEffect(() => {
    const updateMotion = (state) => {
      if (state) {
        posX.set(state.x);
        posY.set(state.y);
        width.set(state.width);
        height.set(state.height);
        return;
      }
      posX.set(0);
      posY.set(0);
      width.set(0);
      height.set(0);
    };

    // Initialize with the first value.
    updateMotion(get());
    return subscribe(updateMotion);
  }, [get, height, posX, posY, subscribe, width]);

  return (
    <>
      {/* This is the panel on which options of the components are show. */}
      <motion.div
        style={{
          display: 'flex',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          x: posX,
          y: posY,
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
      </motion.div>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: posX,
          y: posY,
          width,
          height,
          border: `2px solid ${theme.colors.primary[300]}`,
          pointerEvents: 'none',
        }}
      />
    </>
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
