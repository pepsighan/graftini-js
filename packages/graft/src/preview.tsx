import { motion, useMotionValue } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useResolver } from './resolver';
import { useEditorStoreApiInternal } from './schema';

/**
 * Shows a drag preview which is snapped to the cursor.
 */
export function DragPreview() {
  const { subscribe } = useEditorStoreApiInternal();
  const position = useMotionValue<string | null>(null);
  const posX = useMotionValue(0);
  const posY = useMotionValue(0);
  const [component, setComponent] = useState<string | null>(null);

  useEffect(() => {
    return subscribe((state) => {
      if (state.draggedOver.cursorPosition) {
        position.set('fixed');
        posX.set(state.draggedOver.cursorPosition.x);
        posY.set(state.draggedOver.cursorPosition.y);
        setComponent(state.draggedOver.component!.type);
        return;
      }

      position.set(null);
      posX.set(0);
      posY.set(0);
      setComponent(null);
    });
  }, [posX, posY, position, subscribe]);

  return (
    <>
      {component && (
        <motion.div style={{ position, x: posX, y: posY }}>
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
