import { motion, useMotionValue } from 'framer-motion';
import { useComponentRegion } from 'graft';
import { useCallback, useEffect } from 'react';
import { useDesignerState } from 'store/designer';
import theme from 'utils/theme';
import ActionBar from './ActionBar';

export default function Selection() {
  const componentId = useDesignerState(useCallback((state) => state.selectedComponentId, []));
  return componentId ? <ActualSelection componentId={componentId} /> : null;
}

function ActualSelection({ componentId }) {
  const { get, subscribe } = useComponentRegion(componentId);

  const posX = useMotionValue(0);
  const posY = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);

  const actionPosY = useMotionValue(0);

  useEffect(() => {
    const updateMotion = (state) => {
      if (state) {
        // If it overflows from the top, then show it to the bottom of the component.
        const y = state.y - 19 >= 0 ? state.y - 19 : state.y + state.height - 1;

        posX.set(state.x);
        posY.set(state.y);
        width.set(state.width);
        height.set(state.height);

        actionPosY.set(y);
        return;
      }

      posX.set(0);
      posY.set(0);
      width.set(0);
      height.set(0);
      actionPosY.set(0);
    };

    // Initialize with the first value.
    updateMotion(get());
    return subscribe(updateMotion);
  }, [actionPosY, get, height, posX, posY, subscribe, width]);

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
          y: actionPosY,
          backgroundColor: theme.colors.primary[300],
          fontSize: 12,
          height: 20,
          paddingLeft: 8,
          paddingRight: 8,
        }}
      >
        <ActionBar componentId={componentId} />
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
