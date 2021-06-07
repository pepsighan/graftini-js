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
    <div id="graft-drag-preview" style={{ display: 'inline-block' }}>
      {component && <PreviewInner component={component} />}
    </div>
  );
}

function PreviewInner({ component }: { component: string }) {
  const Component = useResolver(component);
  const Preview = Component.graftOptions?.preview;

  return <>{Preview && <Preview />}</>;
}
