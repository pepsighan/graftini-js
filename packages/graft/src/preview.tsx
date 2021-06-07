import React, { useCallback } from 'react';
import { useResolver } from './resolver';
import { useDraggedOverStore } from './store/draggedOver';

/**
 * Shows a drag preview which is snapped to the cursor.
 */
export function DragPreview() {
  const component = useDraggedOverStore(
    useCallback((state) => state.draggedOver.component?.type, [])
  );

  return (
    <div
      id="graft-drag-preview"
      style={{
        display: 'inline-block',
        position: 'fixed',
        top: 0,
        left: 0,
        // Do not show the original item on the screen and only the preview is visible.
        // Found no other way to hide it.
        transform: 'translateX(-99999px)',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {component && <PreviewInner component={component} />}
    </div>
  );
}

function PreviewInner({ component }: { component: string }) {
  const Component = useResolver(component);
  const Preview = Component.graftOptions?.preview;

  return <>{Preview && <Preview />}</>;
}
