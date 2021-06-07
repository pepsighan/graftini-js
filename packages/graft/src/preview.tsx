import { motion, useMotionValue } from 'framer-motion';
import React, { useContext, useEffect, useState } from 'react';
import { IFrameCorrectionContext } from './correction';
import { useResolver } from './resolver';
import { DraggedOver, useDraggedOverStoreApi } from './store/draggedOver';

/**
 * Shows a drag preview which is snapped to the cursor.
 */
export function DragPreview() {
  const { subscribe } = useDraggedOverStoreApi();
  const posX = useMotionValue(0);
  const posY = useMotionValue(0);
  const opacity = useMotionValue(0);
  const [component, setComponent] = useState<string | null>(null);
  const correction = useContext(IFrameCorrectionContext);

  useEffect(() => {
    return subscribe(
      (draggedOver: DraggedOver) => {
        if (draggedOver?.cursorPosition) {
          // The preview is not pinned to the cursor if not corrected. This may happen if
          // the canvas is in an iframe.
          posX.set(draggedOver.cursorPosition.x + (correction?.x ?? 0));
          posY.set(draggedOver.cursorPosition.y + (correction?.y ?? 0));
          setComponent(draggedOver.component!.type);

          // Do not show the item coming from the origin.
          setTimeout(() => opacity.set(1), 200);
          return;
        }

        opacity.set(0);
        posX.set(0);
        posY.set(0);
        setComponent(null);
      },
      (state) => state.draggedOver
    );
  }, [correction?.x, correction?.y, opacity, posX, posY, subscribe]);

  return (
    <>
      {component && (
        <motion.div
          layout
          style={{
            position: 'fixed',
            opacity,
            top: 0,
            left: 0,
            x: posX,
            y: posY,
            pointerEvents: 'none',
          }}
        >
          <PreviewInner component={component} />
        </motion.div>
      )}
    </>
  );
}

function PreviewInner({ component }: { component: string }) {
  const Component = useResolver(component);
  const Preview = Component.graftOptions?.preview;

  return <>{Preview && <Preview />}</>;
}
