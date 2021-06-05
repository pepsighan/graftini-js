import { motion, useMotionValue } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useResolver } from './resolver';
import { DraggedOver, useEditorStoreApiInternal } from './schema';

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

  useEffect(() => {
    return subscribe(
      (draggedOver: DraggedOver) => {
        if (draggedOver?.cursorPosition) {
          const isInCanvas = !!draggedOver.dropRegion;

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
