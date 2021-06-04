import { motion, useMotionValue, useSpring } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useResolver } from './resolver';
import { DraggedOver, DraggingState, useEditorStoreApiInternal } from './schema';

type DragPreviewProps = {
  /**
   * The correction is useful when the canvas is within an iframe. The correction will be
   * added to the actual cursor position when dragging over an iframe. This is equal to
   * the position of the iframe relative to the browser page.
   */
  correction?: {
    x: number;
    y: number;
  };
};

/**
 * Shows a drag preview which is snapped to the cursor.
 */
export function DragPreview({ correction }: DragPreviewProps) {
  const { subscribe } = useEditorStoreApiInternal();
  const posX = useMotionValue(0);
  const posY = useMotionValue(0);
  const opacity = useMotionValue(0);
  const [component, setComponent] = useState<string | null>(null);

  // A spring is used so that there is less abrupt changes in the position. This
  // can happen when going between the boundaries of iframe.
  // TODO: Fix the abrupt position change when going in and out of iframe. This happens
  // because the cursorPosition and isDragging state is not updated at the same time.
  // For now, this works.
  const x = useSpring(posX, { stiffness: 300, damping: 20, mass: 0.1 });
  const y = useSpring(posY, { stiffness: 300, damping: 20, mass: 0.1 });

  useEffect(() => {
    return subscribe(
      (draggedOver: DraggedOver) => {
        if (draggedOver?.cursorPosition) {
          const isInCanvas = draggedOver.isDragging === DraggingState.DraggingInCanvas;

          posX.set(draggedOver.cursorPosition.x + (isInCanvas ? correction?.x ?? 0 : 0));
          posY.set(draggedOver.cursorPosition.y + (isInCanvas ? correction?.y ?? 0 : 0));
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
            x,
            y,
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
